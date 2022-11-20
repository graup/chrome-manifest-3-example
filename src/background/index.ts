import { Wallet } from '@herajs/wallet';

console.log('%cBackground Script', 'color: #FF36AD');
console.log('Extension ID', chrome.runtime.id);

const wallet = new Wallet();
console.log(wallet.defaultChainId);

/**
 * Browser action context menus
 */
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  id: 'open-full-page',
  title: "Open full page",
  contexts: ["action"],
});
chrome.contextMenus.create({
  id: 'settings',
  title: "Settings",
  contexts: ["action"],
});
chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
  if (menuItemId === 'settings') {
    chrome.tabs.create({ url: "index.html#/settings" });
  }
  if (menuItemId === 'open-full-page') {
    chrome.tabs.create({ url: "index.html" });
  }
});

/**
 * Connections
 */
function deleteTimer(port: { _timer: any }) {
  if (port._timer) {
    clearTimeout(port._timer);
    delete port._timer;
  }
}
function forceReconnect(port: { _timer: any; disconnect(): void }) {
  deleteTimer(port);
  port.disconnect();
}

chrome.runtime.onConnect.addListener(function connectRemote(remotePort) {
  const processName = remotePort.name;
  console.log('Establishing connection with', processName);

  if (processName === 'external') {
    remotePort.onMessage.addListener((msg: any, port: any) => {
      console.log('external', msg);
    });
  } else {
    remotePort.onMessage.addListener((msg: any, port: any) => {
      console.log('popup', msg);
    });
    remotePort.postMessage('hello from background');
  }

  (remotePort as any)._timer = setTimeout(forceReconnect, 250e3, remotePort);
});

/**
 * Idle detection
 */
chrome.idle.setDetectionInterval(60);
chrome.idle.onStateChanged.addListener((newState: string) => {
  if (newState === 'idle' || newState === 'locked') {
    console.log('idle');
  }
});

export { }