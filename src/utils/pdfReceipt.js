import { formatDate } from './dates.js'

/**
 * Generate and download a checkout receipt PDF.
 * @param {Object} params
 * @param {Object} params.team        - { label, color, textColor }
 * @param {string} params.personName
 * @param {Date}   params.checkoutDate
 * @param {Date}   params.returnDate
 * @param {Array}  params.items       - [{ itemName, quantity, storageLocation }]
 */
export async function generateCheckoutPDF({ team, personName, checkoutDate, returnDate, items }) {
  const { default: jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // ── Header band (team color) ─────────────────────────────────────
  const headerH = 32
  // Convert hex to RGB
  const hex = team.color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, 210, headerH, 'F')

  // Team name on header
  const textHex = team.textColor.replace('#', '')
  const tr = parseInt(textHex.substring(0, 2), 16) || 255
  const tg = parseInt(textHex.substring(2, 4), 16) || 255
  const tb = parseInt(textHex.substring(4, 6), 16) || 255
  doc.setTextColor(tr, tg, tb)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(team.label, 14, 15)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Scout Inventory — Checkout Receipt', 14, 24)

  // ── Meta block ───────────────────────────────────────────────────
  doc.setTextColor(28, 28, 30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Person:', 14, 44)
  doc.text('Checked out:', 14, 52)
  doc.text('Expected return:', 14, 60)

  doc.setFont('helvetica', 'normal')
  doc.text(personName, 52, 44)
  doc.text(formatDate(checkoutDate), 52, 52)
  doc.text(formatDate(returnDate), 52, 60)

  // ── Divider ──────────────────────────────────────────────────────
  doc.setDrawColor(209, 209, 214)
  doc.setLineWidth(0.4)
  doc.line(14, 66, 196, 66)

  // ── Items table ──────────────────────────────────────────────────
  doc.autoTable({
    startY: 70,
    head: [['Item', 'Qty', 'Storage Location']],
    body: items.map(i => [i.itemName, i.quantity, i.storageLocation || '—']),
    headStyles: {
      fillColor: [r, g, b],
      textColor: [tr, tg, tb],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [242, 242, 247] },
    styles: { font: 'helvetica', cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 'auto' },
    },
  })

  // ── Footer ───────────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 12
  doc.setFontSize(9)
  doc.setTextColor(99, 99, 102)
  doc.text(`Please return all items by ${formatDate(returnDate)}.`, 14, finalY)
  doc.text('Thank you — Groupe Scout', 14, finalY + 6)

  // ── Save ─────────────────────────────────────────────────────────
  const filename = `receipt-${personName.replace(/\s+/g, '-')}-${Date.now()}.pdf`

  if (typeof window !== 'undefined' && window.electronAPI?.savePdf) {
    const buffer = doc.output('arraybuffer')
    await window.electronAPI.savePdf(filename, buffer)
  } else {
    doc.save(filename)
  }
}
