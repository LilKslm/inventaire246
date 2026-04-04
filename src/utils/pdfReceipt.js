import { formatDate } from './dates.js'

function hexToRGB(hex) {
  const h = (hex || '#007AFF').replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16) || 0,
    parseInt(h.substring(2, 4), 16) || 0,
    parseInt(h.substring(4, 6), 16) || 0,
  ]
}

function safe(val) {
  if (val === null || val === undefined) return ''
  return String(val)
}

function contrastRGB(hex) {
  const [r, g, b] = hexToRGB(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? [28, 28, 30] : [255, 255, 255]
}

/**
 * Generate and download a checkout receipt PDF — Inventaire246.
 */
export async function generateCheckoutPDF({ team, personName, checkoutDate, returnDate, items }) {
  const { default: jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const margin = 16
  const contentW = pageW - margin * 2

  const [r, g, b] = hexToRGB(team?.color)
  const [tr, tg, tb] = contrastRGB(team?.color)
  const teamLabel = safe(team?.label || 'Scout')
  const person = safe(personName)

  // ── Header band (team color) ─────────────────────────────────────
  const headerH = 28
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, pageW, headerH, 'F')

  doc.setTextColor(tr, tg, tb)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('INVENTAIRE246', margin, 12)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(safe(teamLabel) + ' - Recu de reservation', margin, 20)

  // ── Info box ─────────────────────────────────────────────────────
  const infoY = headerH + 8
  const infoH = 32
  doc.setDrawColor(220, 220, 225)
  doc.setLineWidth(0.4)
  doc.roundedRect(margin, infoY, contentW, infoH, 3, 3, 'S')

  const col1X = margin + 5
  const col2X = margin + contentW / 2 + 5

  // Row 1
  doc.setTextColor(142, 142, 147)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('PERSONNE', col1X, infoY + 7)
  doc.text('UNITE', col2X, infoY + 7)

  doc.setTextColor(28, 28, 30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(person, col1X, infoY + 13)
  doc.text(teamLabel, col2X, infoY + 13)

  // Divider
  doc.setDrawColor(235, 235, 240)
  doc.line(margin + 5, infoY + 16, margin + contentW - 5, infoY + 16)

  // Row 2
  doc.setTextColor(142, 142, 147)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('DATE DE RESERVATION', col1X, infoY + 22)
  doc.text('RETOUR AVANT LE', col2X, infoY + 22)

  doc.setTextColor(28, 28, 30)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(safe(formatDate(checkoutDate)), col1X, infoY + 28)
  doc.text(safe(formatDate(returnDate)), col2X, infoY + 28)

  // ── Items table ──────────────────────────────────────────────────
  const tableY = infoY + infoH + 8

  doc.autoTable({
    startY: tableY,
    margin: { left: margin, right: margin },
    head: [['Article', 'Qte', 'Emplacement']],
    body: items.map(i => [
      safe(i.itemName),
      safe(i.quantity),
      safe(i.storageLocation) || '-',
    ]),
    headStyles: {
      fillColor: [r, g, b],
      textColor: [tr, tg, tb],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [28, 28, 30],
    },
    alternateRowStyles: { fillColor: [248, 248, 250] },
    styles: { font: 'helvetica', lineWidth: 0, overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 'auto' },
    },
  })

  // ── Reminder box ─────────────────────────────────────────────────
  const reminderY = doc.lastAutoTable.finalY + 8
  doc.setFillColor(255, 249, 230)
  doc.roundedRect(margin, reminderY, contentW, 12, 2, 2, 'F')
  doc.setDrawColor(255, 204, 0)
  doc.setLineWidth(0.4)
  doc.roundedRect(margin, reminderY, contentW, 12, 2, 2, 'S')
  doc.setTextColor(120, 90, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(
    'RAPPEL : Veuillez retourner tous les articles avant le ' + safe(formatDate(returnDate)),
    margin + 5,
    reminderY + 7.5
  )

  // ── Decorative image ──────────────────────────────────────────────
  let imageEndY = reminderY + 16
  try {
    const resp = await fetch('./inventory.jpg')
    if (resp.ok) {
      const blob = await resp.blob()
      const dataUrl = await new Promise(resolve => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = dataUrl
      })
      const maxImgH = 60
      let imgW = contentW
      let imgH = (img.height / img.width) * imgW
      if (imgH > maxImgH) {
        imgW = imgW * (maxImgH / imgH)
        imgH = maxImgH
      }
      const imgX = margin + (contentW - imgW) / 2
      doc.addImage(dataUrl, 'JPEG', imgX, reminderY + 16, imgW, imgH)
      imageEndY = reminderY + 16 + imgH + 4
    }
  } catch {
    // Image not available — skip silently
  }

  // ── Footer ───────────────────────────────────────────────────────
  const footerY = imageEndY + 4
  doc.setTextColor(174, 174, 178)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Inventaire246 - Systeme de gestion d\'inventaire', margin, footerY)
  doc.text(safe(formatDate(new Date())), pageW - margin, footerY, { align: 'right' })

  // ── Signature ────────────────────────────────────────────────────
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(153, 153, 153)
  doc.text('Fait par Chef Khalil 2026', pageW / 2, footerY + 8, { align: 'center' })

  // ── Save ─────────────────────────────────────────────────────────
  const filename = 'recu-' + person.replace(/\s+/g, '-') + '-' + Date.now() + '.pdf'

  try {
    if (typeof window !== 'undefined' && window.electronAPI?.savePdf) {
      const buffer = doc.output('arraybuffer')
      await window.electronAPI.savePdf(filename, buffer)
    } else {
      doc.save(filename)
    }
  } catch (err) {
    console.error('PDF save error:', err)
    // Fallback: open in new tab
    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }
}
