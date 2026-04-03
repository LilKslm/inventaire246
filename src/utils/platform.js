export const isElectron = typeof window !== 'undefined' && !!window.electronAPI

export function downloadFile(filename, content, mimeType = 'text/plain') {
  if (isElectron && window.electronAPI?.saveFile) {
    window.electronAPI.saveFile(filename, content).catch(console.error)
  } else {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }
}
