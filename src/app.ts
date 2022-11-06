import { app, BrowserWindow, nativeTheme } from 'electron';
import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import * as path from 'path';
import config, { ConfigKey } from './config';
import { platform } from './helpers';

const pkgJSON = jsonfile.readFileSync(
  path.join(__dirname, '..', 'package.json')
);

const shouldStartMinimized =
  app.commandLine.hasSwitch('launch-minimized') ||
  config.get(ConfigKey.LaunchMinimized);

app.setAppUserModelId(pkgJSON.appId);

let mainWindow: BrowserWindow;

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

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
      nativeWindowOpen: true,
      preload: path.join(__dirname, 'preload'),
      devTools: false,
    },
    show: !shouldStartMinimized,
    icon: path.join(__dirname, '..', 'static', 'icon.ico'),
    darkTheme: nativeTheme.shouldUseDarkColors,
    frame: true,
  });

  mainWindow.removeMenu();

  if (lastWindowState.fullscreen && !mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(lastWindowState.fullscreen);
  }

  if (lastWindowState.maximized && !mainWindow.isMaximized()) {
    mainWindow.maximize();
  }

  mainWindow.loadURL(config.get(ConfigKey.AppUrl));

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

app.on('before-quit', () => {
  if (mainWindow) {
    config.set(ConfigKey.LastWindowState, {
      bounds: mainWindow.getBounds(),
      fullscreen: mainWindow.isFullScreen(),
      maximized: mainWindow.isMaximized(),
    });
    mainWindow.removeAllListeners('close');
    mainWindow.close();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

(async () => {
  await Promise.all([app.whenReady()]);

  createWindow();

  const { webContents } = mainWindow!;

  webContents.on('dom-ready', () => {
    if (!shouldStartMinimized) {
      mainWindow.show();
    }
  });
})();
