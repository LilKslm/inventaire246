import { useState, useEffect, useCallback } from 'react'
import TeamSelector from '../components/checkout/TeamSelector.jsx'
import PersonForm from '../components/checkout/PersonForm.jsx'
import InventoryBrowser from '../components/checkout/InventoryBrowser.jsx'
import CartPanel from '../components/checkout/CartPanel.jsx'
import CheckoutReview from '../components/checkout/CheckoutReview.jsx'
import TeamBadge from '../components/ui/TeamBadge.jsx'
import { calcReturnDate } from '../utils/dates.js'
import { createCheckout } from '../utils/firebase.js'
import { generateCheckoutPDF } from '../utils/pdfReceipt.js'

const DRAFT_KEY = 'scout_checkout_draft_v1'
const STEPS = { TEAM: 0, PERSON: 1, BROWSE: 2, REVIEW: 3, SUCCESS: 4 }

const EMPTY_DRAFT = {
  team: null,
  personName: '',
  selectedDuration: null,
  customDays: '',
  returnDate: null,
  cart: [],
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function CheckoutPage() {
  const [step, setStep] = useState(STEPS.TEAM)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resumePrompt, setResumePrompt] = useState(false)

  // Check for saved draft on mount
  useEffect(() => {
    const saved = loadDraft()
    if (saved?.team && saved?.personName) {
      setResumePrompt(true)
    }
  }, [])

  // Auto-save draft (debounced)
  useEffect(() => {
    if (step === STEPS.TEAM || step === STEPS.SUCCESS) return
    const id = setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch {}
    }, 500)
    return () => clearTimeout(id)
  }, [step, draft])

  // Set team accent color on selection
  useEffect(() => {
    if (draft.team) {
      document.documentElement.style.setProperty('--team-color', draft.team.color)
      document.documentElement.style.setProperty('--team-text', draft.team.textColor)
    }
  }, [draft.team])

  function updateDraft(patch) {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  function handleTeamSelect(team) {
    updateDraft({ team })
    setStep(STEPS.PERSON)
  }

  function handlePersonNext() {
    const rd = draft.selectedDuration
      ? calcReturnDate(draft.selectedDuration.hours, null)
      : calcReturnDate(null, draft.customDays)
    updateDraft({ returnDate: rd })
    setStep(STEPS.BROWSE)
  }

  function handleAddToCart(item, qty) {
    setDraft(prev => {
      const cart = prev.cart.filter(c => c.item.id !== item.id)
      if (qty > 0) cart.push({ item, quantity: qty })
      return { ...prev, cart }
    })
  }

  function handleRemoveFromCart(itemId) {
    setDraft(prev => ({ ...prev, cart: prev.cart.filter(c => c.item.id !== itemId) }))
  }

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      await createCheckout(draft.cart, {
        personName: draft.personName,
        team: draft.team,
        returnDate: draft.returnDate,
      })
      await generateCheckoutPDF({
        team: draft.team,
        personName: draft.personName,
        checkoutDate: new Date(),
        returnDate: draft.returnDate,
        items: draft.cart.map(c => ({
          itemName: c.item.name,
          quantity: c.quantity,
          storageLocation: c.item.storageLocation,
        })),
      })
      localStorage.removeItem(DRAFT_KEY)
      setStep(STEPS.SUCCESS)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleNewCheckout() {
    setDraft(EMPTY_DRAFT)
    setStep(STEPS.TEAM)
    setError(null)
  }

  function handleResume() {
    const saved = loadDraft()
    if (saved) {
      setDraft(saved)
      setStep(STEPS.BROWSE)
    }
    setResumePrompt(false)
  }

  // ── Resume prompt ──────────────────────────────────────────────────────────
  if (resumePrompt) {
    const saved = loadDraft()
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-apple p-6">
          <p className="text-base font-semibold text-apple-dark mb-1">Resume checkout?</p>
          <p className="text-sm text-apple-secondary mb-5">
            {saved?.personName} ({saved?.team?.label}) has an unfinished checkout.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setResumePrompt(false); localStorage.removeItem(DRAFT_KEY) }}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-apple-secondary bg-apple-gray hover:bg-apple-gray-2"
            >
              Start fresh
            </button>
            <button
              onClick={handleResume}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-apple-blue hover:bg-apple-blue-dark"
            >
              Resume
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === STEPS.SUCCESS) {
    return (
      <div className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-apple-dark mb-2">Checkout Complete!</h2>
        <p className="text-apple-secondary text-sm mb-2">
          Receipt PDF has been downloaded.
        </p>
        <p className="text-apple-secondary text-sm mb-8">
          Remember to pick up your items from their storage locations.
        </p>
        <button
          onClick={handleNewCheckout}
          className="px-8 py-3 rounded-2xl font-semibold text-sm text-white bg-apple-blue hover:bg-apple-blue-dark transition-colors"
        >
          New Checkout
        </button>
      </div>
    )
  }

  // ── Step: TEAM ─────────────────────────────────────────────────────────────
  if (step === STEPS.TEAM) {
    return <TeamSelector onSelect={handleTeamSelect} />
  }

  // ── Step: PERSON ───────────────────────────────────────────────────────────
  if (step === STEPS.PERSON) {
    return (
      <PersonForm
        team={draft.team}
        draft={draft}
        onChange={updateDraft}
        onNext={handlePersonNext}
        onBack={() => setStep(STEPS.TEAM)}
      />
    )
  }

  // ── Step: BROWSE ───────────────────────────────────────────────────────────
  if (step === STEPS.BROWSE) {
    return (
      <div className="page-enter flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-3.5rem)]">
        {/* Sub-header */}
        <div className="px-4 py-3 bg-white border-b border-apple-gray-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setStep(STEPS.PERSON)} className="text-apple-secondary hover:text-apple-dark text-sm transition-colors">
              ← Back
            </button>
            <TeamBadge team={draft.team} />
            <span className="text-xs text-apple-secondary">{draft.personName}</span>
          </div>
          {/* Mobile cart badge */}
          <button
            onClick={() => setStep(STEPS.REVIEW)}
            className="sm:hidden relative text-sm font-medium text-apple-blue"
          >
            Cart {draft.cart.length > 0 && (
              <span className="ml-1 bg-apple-red text-white rounded-full text-xs w-4 h-4 inline-flex items-center justify-center">
                {draft.cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Main area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Inventory browser */}
          <div className="flex-1 flex flex-col pt-3 overflow-hidden">
            <InventoryBrowser
              cart={draft.cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              teamColor={draft.team.color}
            />
          </div>

          {/* Cart panel — desktop only */}
          <div className="hidden sm:flex w-64 flex-col border-l border-apple-gray-2 bg-white">
            <CartPanel
              team={draft.team}
              cart={draft.cart}
              onReview={() => setStep(STEPS.REVIEW)}
              onRemove={handleRemoveFromCart}
            />
          </div>
        </div>

        {/* Mobile sticky checkout button */}
        <div className="sm:hidden px-4 py-3 bg-white border-t border-apple-gray-2">
          <button
            onClick={() => setStep(STEPS.REVIEW)}
            disabled={draft.cart.length === 0}
            className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
            style={{ backgroundColor: draft.team.color, color: draft.team.textColor }}
          >
            Review ({draft.cart.reduce((s, c) => s + c.quantity, 0)} items) →
          </button>
        </div>
      </div>
    )
  }

  // ── Step: REVIEW ───────────────────────────────────────────────────────────
  return (
    <>
      {error && (
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-apple-red">
            {error}
          </div>
        </div>
      )}
      <CheckoutReview
        team={draft.team}
        personName={draft.personName}
        returnDate={draft.returnDate}
        cart={draft.cart}
        onConfirm={handleConfirm}
        onBack={() => setStep(STEPS.BROWSE)}
        loading={loading}
      />
    </>
  )
}
