const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')

let win
let downloadedFilePath = null

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Inventaire246',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  // Auto-updater (production only)
  if (app.isPackaged) {
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true

    autoUpdater.on('update-available', info => {
      if (win) win.webContents.send('update-available', { version: info.version })
    })
    autoUpdater.on('update-downloaded', (info) => {
      downloadedFilePath = info.downloadedFile || null
      if (win) win.webContents.send('update-downloaded')
    })
    autoUpdater.on('error', err => {
      console.error('AutoUpdater error:', err.message)
    })

    let lastCheck = 0
    function safeCheck() {
      const now = Date.now()
      if (now - lastCheck < 3_600_000) return
      lastCheck = now
      autoUpdater.checkForUpdates().catch(err => console.error('Update check failed:', err))
    }

    safeCheck()
    setInterval(safeCheck, 4 * 3_600_000)
    win.on('focus', safeCheck)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ── IPC handlers ────────────────────────────────────────────────────────────

ipcMain.handle('install-update', () => {
  if (process.platform === 'darwin' && downloadedFilePath) {
    // Strip the macOS quarantine flag that Gatekeeper applies to
    // files downloaded from the internet. Without this, the unsigned
    // extracted .app is silently blocked from launching after install.
    try {
      const { execSync } = require('child_process')
      execSync(`xattr -cr "${downloadedFilePath}"`)
    } catch (e) {
      console.error('xattr strip failed:', e.message)
    }
  }
  // isSilent=false on macOS: avoids the silent-failure code path
  // that affects unsigned apps. isSilent=true is fine on Windows.
  const silent = process.platform !== 'darwin'
  autoUpdater.quitAndInstall(silent, true)
})

ipcMain.handle('save-pdf', async (_, filename, buffer) => {
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    defaultPath: filename,
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
  })
  if (!canceled && filePath) {
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return filePath
  }
  return null
})

ipcMain.handle('save-file', async (_, filename, content) => {
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    defaultPath: filename,
    filters: [{ name: 'All Files', extensions: ['*'] }],
  })
  if (!canceled && filePath) {
    fs.writeFileSync(filePath, content, 'utf-8')
    return filePath
  }
  return null
})
