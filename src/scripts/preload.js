const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createNewWindow: () => ipcRenderer.send("create-new-window"),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  createNewTab: (callback) =>
    ipcRenderer.on("create-new-tab", (_, response) => callback(response)),
  openDevTools: (callback) =>
    ipcRenderer.on("open-dev-tools", (_, response) => callback(response)),
});
