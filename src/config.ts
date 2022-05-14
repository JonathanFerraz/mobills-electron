import Store from 'electron-store';
import { is } from 'electron-util';

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
  LastWindowState = 'lastWindowState',
  LaunchMinimized = 'launchMinimized',
}

type TypedStore = {
  [ConfigKey.LastWindowState]: LastWindowState;
  [ConfigKey.LaunchMinimized]: boolean;
};

const defaults: TypedStore = {
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
};

const config = new Store<TypedStore>({
  defaults,
  name: is.development ? 'config.dev' : 'config',
});

export default config;
