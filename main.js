const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const path = require('path');
const ipc = ipcMain;

function createWindow() {
  // Icon

  new Tray(__dirname + '/src/assets/icons/icon.png');

  const win = new BrowserWindow({
    width: 1280,
    height: 775,
    minWidth: 940,
    minHeight: 745,
    frame: false,
    icon: __dirname + '/src/assets/icons/icon.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('src/index.html');
  win.setBackgroundColor('rgb(32, 32, 32)');

  // Window Control

  ipc.on('minimizeApp', () => {
    win.minimize();
  });

  ipc.on('maximizeRestoreApp', () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  win.on('maximize', () => {
    win.webContents.send('isMaximized');
  });

  win.on('unmaximize', () => {
    win.webContents.send('isRestored');
  });

  ipc.on('restoreApp', () => {
    win.restore();
  });

  ipc.on('closeApp', () => {
    win.close();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
