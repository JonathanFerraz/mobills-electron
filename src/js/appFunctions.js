const { ipcRenderer } = require('electron');
const maxResBtn = document.getElementById('maxResBtn');
const ipc = ipcRenderer;

minimizeBtn.addEventListener('click', () => {
  ipc.send('minimizeApp');
});

const changeMaxResBtn = (isMaximizeApp) => {
  if (isMaximizeApp) {
    maxResBtn.title = 'Restore';
    maxResBtn.classList.remove('maximizeBtn');
    maxResBtn.classList.add('restoreBtn');
  } else {
    maxResBtn.title = 'Maximize';
    maxResBtn.classList.remove('restoreBtn');
    maxResBtn.classList.add('maximizeBtn');
  }
};

ipc.on('isMaximized', () => {
  changeMaxResBtn(true);
});

ipc.on('isRestored', () => {
  changeMaxResBtn(false);
});

maxResBtn.addEventListener('click', () => {
  ipc.send('maximizeRestoreApp');
});

closeBtn.addEventListener('click', () => {
  ipc.send('closeApp');
});
