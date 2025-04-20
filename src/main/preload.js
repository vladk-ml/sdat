const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("seekeraug", {
  selectFiles: async () => {
    return await ipcRenderer.invoke("select-files");
  }
});
