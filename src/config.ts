import * as path from 'path';
import { is } from 'electron-util';
import * as jsonfile from 'jsonfile';

import Store = require('electron-store');

const pkgJSON = jsonfile.readFileSync(
  path.join(__dirname, '..', 'package.json')
);

interface LastWindowState {
  bounds: {
    width: number;
    height: number;
    x: number | undefined;
    y: number | undefined;
  };
  fullscreen: boolean;
  maximized: boolean;
}

export enum ConfigKey {
  AppUrl = 'appUrl',
  LastWindowState = 'lastWindowState',
  LaunchMinimized = 'launchMinimized',
  TrustedHosts = 'trustedHosts',
  ConfirmExternalLinks = 'confirmExternalLinks',
}

type TypedStore = {
  [ConfigKey.AppUrl]: string;
  [ConfigKey.LastWindowState]: LastWindowState;
  [ConfigKey.LaunchMinimized]: boolean;
  [ConfigKey.TrustedHosts]: string[];
  [ConfigKey.ConfirmExternalLinks]: boolean;
};

const defaults: TypedStore = {
  [ConfigKey.AppUrl]: pkgJSON.appUrl,
  [ConfigKey.LastWindowState]: {
    bounds: {
      width: 992,
      height: 680,
      x: undefined,
      y: undefined,
    },
    fullscreen: false,
    maximized: false,
  },
  [ConfigKey.LaunchMinimized]: false,
  [ConfigKey.TrustedHosts]: [],
  [ConfigKey.ConfirmExternalLinks]: true,
};

const config = new Store<TypedStore>({
  defaults,
  name: is.development ? 'config.dev' : 'config',
});

export default config;
