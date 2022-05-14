import { ipcRenderer as ipc } from 'electron';
import { ConfigKey } from './config';

// Toggle a custom style class when a message is received from the main process
ipc.on('set-custom-style', (_: Event, key: ConfigKey, enabled: boolean) => {
  document.body.classList[enabled ? 'add' : 'remove'](key);
});

// Toggle a full screen class when a message is received from the main process
ipc.on('set-full-screen', (_: Event, enabled: boolean) => {
  document.body.classList[enabled ? 'add' : 'remove']('full-screen');
});

// function clickElement(selector: string) {
//   const element = document.querySelector<HTMLDivElement>(selector);
//   if (element) {
//     element.click();
//   }
// }
