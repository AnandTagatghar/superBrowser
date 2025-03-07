const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  globalShortcut,
  Menu,
} = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    x: width - 600,
    y: 0,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    frame: false,
    transparent: false,
    fullscreen: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "/src/scripts/preload.js"),
    },
  });
  mainWindow.loadFile(path.join(__dirname, "/src/views/index.html"));
  // mainWindow.webContents.openDevTools();

  let registerShortcuts = () => {
    globalShortcut.register("CmdOrCtrl+Shift+N", () => {
      createWindow();
    });
    globalShortcut.register("CmdOrCtrl+Shift+M", () => {
      mainWindow.minimize();
    });
    globalShortcut.register("CmdOrCtrl+Shift+X", () => {
      mainWindow.close();
    });
    globalShortcut.register("CmdOrCtrl+Shift+R", () => {
      mainWindow.reload();
    });
    globalShortcut.register("CmdOrCtrl+Shift+I", () => {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else mainWindow.webContents.openDevTools();
    });

    globalShortcut.register("CmdOrCtrl+Shift+Left", () => {
      mainWindow.navigationHistory.goBack();
    });
    globalShortcut.register("CmdOrCtrl+Shift+Right", () => {
      mainWindow.navigationHistory.goForward();
    });

    globalShortcut.register("CmdOrCtrl+T", () => {
      mainWindow.webContents.send("create-new-tab");
    });
  };
  registerShortcuts();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("focus", () => {
    registerShortcuts();
  });
  mainWindow.on("blur", () => {
    globalShortcut.unregisterAll();
  });


}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("create-new-window", () => {
  createWindow();
});

ipcMain.on("minimize-window", () => {
  mainWindow.minimize();
});

ipcMain.on("maximize-window", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("close-window", () => {
  let win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

app.on("window-all-closed", () => {
  app.quit();
});
