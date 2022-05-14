import { app, BrowserWindow, nativeTheme } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import config, { ConfigKey } from './config';
import { platform } from './helpers';

const shouldStartMinimized =
  app.commandLine.hasSwitch('launch-minimized') ||
  config.get(ConfigKey.LaunchMinimized);

app.setAppUserModelId('io.cheung.gmail-desktop');

let mainWindow: BrowserWindow;

function createWindow(): void {
  const lastWindowState = config.get(ConfigKey.LastWindowState);

  mainWindow = new BrowserWindow({
    title: app.name,
    minWidth: 992,
    width: lastWindowState.bounds.width,
    minHeight: 680,
    height: lastWindowState.bounds.height,
    x: lastWindowState.bounds.x,
    y: lastWindowState.bounds.y,
    webPreferences: {
      nodeIntegration: false,
      nativeWindowOpen: false,
      preload: path.join(__dirname, 'preload'),
    },
    show: !shouldStartMinimized,
    icon: path.join(__dirname, '..', 'static', 'icon.ico'),
    darkTheme: nativeTheme.shouldUseDarkColors,
  });

  if (lastWindowState.fullscreen && !mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(lastWindowState.fullscreen);
  }

  if (lastWindowState.maximized && !mainWindow.isMaximized()) {
    mainWindow.maximize();
  }

  mainWindow.loadURL('https://web.mobills.com.br/dashboard'); // use desired URL

  mainWindow.on('app-command', (_event, command) => {
    if (command === 'browser-backward' && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    } else if (
      command === 'browser-forward' &&
      mainWindow.webContents.canGoForward()
    ) {
      mainWindow.webContents.goForward();
    }
  });

  mainWindow.webContents.on('dom-ready', () => {
    addCustomCSS(mainWindow);
  });
}

function addCustomCSS(windowElement: BrowserWindow): void {
  windowElement.webContents.insertCSS(
    fs.readFileSync(path.join(__dirname, '..', 'styles', 'style.css'), 'utf8')
  );

  const platformCSSFile = path.join(
    __dirname,
    '..',
    'styles',
    `style.${platform}.css`
  );
  if (fs.existsSync(platformCSSFile)) {
    windowElement.webContents.insertCSS(
      fs.readFileSync(platformCSSFile, 'utf8')
    );
  }
}

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});

app.whenReady().then(() => {
  createWindow();

  const { webContents } = mainWindow!;

  webContents.on('dom-ready', () => {
    if (!shouldStartMinimized) {
      mainWindow.show();
    }
  });
});
