const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const PythonBridge = require("./python-bridge");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      `file://${path.join(__dirname, "../renderer/index.html")}`
  );

  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  PythonBridge.start();
  createWindow();

  ipcMain.handle("select-files", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Images", extensions: ["png", "jpg", "jpeg", "bmp", "gif", "tiff"] }
      ]
    });
    if (result.canceled) return [];
    return result.filePaths;
  });
});

app.on("window-all-closed", () => {
  const PythonBridge = require("./python-bridge");
  PythonBridge.stop();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
