const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  globalShortcut,
  Menu,
} = require("electron");
const electron = require("electron");
const path = require("path");
const contextMenu = require("electron-context-menu").default;

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
    fullscreen: false,
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

  const template = [
    {
      label: "File",
      submenu: [{ role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "Actions",
      submenu: [
        {
          label: "open devtools",
          accelerator: "CmdOrCtrl+I",
          click: () => {
            if (mainWindow.webContents.isDevToolsOpened()) {
              mainWindow.webContents.closeDevTools();
            } else {
              mainWindow.webContents.openDevTools({ mode: "detach" });
            }
          },
        },
        {
          label: "guest devtools",
          accelerator: "CmdOrCtrl+shift+I",
          click: () => mainWindow.webContents.send("open-dev-tools"),
        }, 
        {
          label: "reload",
          accelerator: "CmdOrCtrl+R",
          role: "reload"
        }
      ],
    },
    
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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

app.on("web-contents-created", (e, contents) => {
  contextMenu({
    window: contents,
    showInspectElement: true,
  });
});
