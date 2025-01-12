const { contextBridge, ipcRenderer } = require('electron'); 

// 使用 contextBridge 暴露 ipcRenderer
contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  receiveMessage: (channel, callback) => ipcRenderer.on(channel, callback)
});
 