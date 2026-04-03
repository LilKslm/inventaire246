const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  savePdf:    (filename, buffer) => ipcRenderer.invoke('save-pdf', filename, buffer),
  saveFile:   (filename, content) => ipcRenderer.invoke('save-file', filename, content),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdateAvailable:  (cb) => ipcRenderer.on('update-available',  (_, info) => cb(info)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', () => cb()),
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('update-downloaded')
  },
})
