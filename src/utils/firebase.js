// Lazy singleton — initializes Firebase only when first needed
let _dbPromise = null

function getDb() {
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const [{ initializeApp, getApps }, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/firestore'),
      ])
      const cfg = {
        apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId:             import.meta.env.VITE_FIREBASE_APP_ID,
      }
      const app = getApps().length ? getApps()[0] : initializeApp(cfg)
      return getFirestore(app)
    })()
  }
  return _dbPromise
}

// ── Inventory ──────────────────────────────────────────────────────────────

export function subscribeToInventory(onChange) {
  let unsub = () => {}
  getDb().then(async (db) => {
    const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore')
    unsub = onSnapshot(
      query(collection(db, 'inventoryItems'), orderBy('name')),
      (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        onChange(items)
      },
      (err) => console.error('inventoryItems subscription error:', err)
    )
  })
  return () => unsub()
}

export async function addInventoryItem(item) {
  const db = await getDb()
  const { collection, addDoc } = await import('firebase/firestore')
  return addDoc(collection(db, 'inventoryItems'), item)
}

export async function upsertInventoryItem(item) {
  const db = await getDb()
  const { collection, query, where, getDocs, addDoc, setDoc, doc } = await import('firebase/firestore')
  // Match by name (case-insensitive) to avoid duplicates on re-import
  const q = query(
    collection(db, 'inventoryItems'),
    where('name', '==', item.name)
  )
  const snap = await getDocs(q)
  if (!snap.empty) {
    await setDoc(doc(db, 'inventoryItems', snap.docs[0].id), item, { merge: true })
  } else {
    await addDoc(collection(db, 'inventoryItems'), item)
  }
}

export async function deleteAllInventoryItems() {
  const db = await getDb()
  const { collection, getDocs, writeBatch } = await import('firebase/firestore')
  const snap = await getDocs(collection(db, 'inventoryItems'))
  if (snap.empty) return 0
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
  return snap.size
}

// ── Checkouts ──────────────────────────────────────────────────────────────

export function subscribeToCheckouts(onChange) {
  let unsub = () => {}
  getDb().then(async (db) => {
    const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore')
    unsub = onSnapshot(
      query(collection(db, 'checkouts'), orderBy('checkoutDate', 'desc')),
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        onChange(docs)
      },
      (err) => console.error('checkouts subscription error:', err)
    )
  })
  return () => unsub()
}

export async function getActiveCheckoutsByName(personName) {
  const db = await getDb()
  const { collection, query, where, getDocs } = await import('firebase/firestore')
  const q = query(
    collection(db, 'checkouts'),
    where('personName', '==', personName),
    where('status', '==', 'active')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Create checkout docs + atomically decrement availableQty for each item.
 * Uses a Firestore transaction per item to prevent over-checkout.
 */
export async function createCheckout(cartItems, checkoutMeta) {
  const db = await getDb()
  const {
    collection, doc, runTransaction, serverTimestamp, Timestamp,
  } = await import('firebase/firestore')

  const results = []

  for (const { item, quantity } of cartItems) {
    const itemRef = doc(db, 'inventoryItems', item.id)
    const checkoutRef = doc(collection(db, 'checkouts'))

    await runTransaction(db, async (tx) => {
      const itemSnap = await tx.get(itemRef)
      if (!itemSnap.exists()) throw new Error(`Item ${item.name} not found`)
      const available = itemSnap.data().availableQty
      if (available < quantity) throw new Error(`Not enough stock for ${item.name}`)

      tx.update(itemRef, { availableQty: available - quantity })
      tx.set(checkoutRef, {
        personName:       checkoutMeta.personName,
        teamName:         checkoutMeta.team.label,
        teamColor:        checkoutMeta.team.color,
        teamTextColor:    checkoutMeta.team.textColor,
        itemId:           item.id,
        itemName:         item.name,
        quantity,
        storageLocation:  item.storageLocation,
        checkoutDate:     serverTimestamp(),
        returnDate:       Timestamp.fromDate(checkoutMeta.returnDate),
        actualReturnDate: null,
        status:           'active',
      })
    })

    results.push(checkoutRef.id)
  }

  return results
}

/**
 * Mark checkout docs as returned and increment availableQty back.
 */
export async function returnItems(checkoutDocs) {
  const db = await getDb()
  const {
    doc, writeBatch, serverTimestamp, increment,
  } = await import('firebase/firestore')

  const batch = writeBatch(db)

  for (const co of checkoutDocs) {
    const coRef = doc(db, 'checkouts', co.id)
    batch.update(coRef, {
      status:           'returned',
      actualReturnDate: serverTimestamp(),
    })
    const itemRef = doc(db, 'inventoryItems', co.itemId)
    batch.update(itemRef, { availableQty: increment(co.quantity) })
  }

  await batch.commit()
}
