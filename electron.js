
import { app , BrowserWindow , ipcMain , dialog } from 'electron';

// pour la mise a jour autuomatique
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const { autoUpdater } = require("electron-updater");
// const log = require("electron-log");

app.commandLine.appendSwitch('high-dpi-support', '1'); // Active le support DPI
app.commandLine.appendSwitch('force-device-scale-factor', '1'); // Force le facteur de zoom à 1 (100%)


// import isDev from 'electron-is-dev';
// const isDev = require('electron-is-dev');
const isDev = !app.isPackaged;

import path from 'path'; // 💡 pas {path}, juste path
import { fileURLToPath } from 'url';

// Ces lignes sont nécessaires pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// pour la mise a jour autuomatique
// log.transports.file.level = "info"
// autoUpdater.logger = log

let mainWindow;


// 🔥 Désactive l'accélération GPU
app.disableHardwareAcceleration();



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, "../build/logo.png"), // 🔥 ici
    minWidth: 1200,      // largeur minimale
    minHeight: 850,     // hauteur minimale
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 🔹 chemin correct
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // événements autoUpdater
  // autoUpdater.on("update-available", () => {
  //   log.info("Mise à jour trouvée, téléchargement...")
  // })
  
  // autoUpdater.on("update-downloaded", () => {
  //   dialog.showMessageBox({
  //     type: "info",
  //     buttons: ["Installer et redémarrer", "Plus tard"],
  //     title: "Mise à jour disponible",
  //     message: "Une mise à jour a été téléchargée.",
  //     detail: "Voulez-vous redémarrer pour l’installer maintenant ?"
  //   }).then(result => {
  //     if (result.response === 0) {
  //       autoUpdater.quitAndInstall()
  //     }
  //   })
  // })


 
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
  // Ouvre les DevTools si en développement
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => (mainWindow = null));

}

app.on('ready',()=>{
  createWindow();
  autoUpdater.checkForUpdatesAndNotify()
} );


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});





// import { ipcMain } from 'electron';
import fs from 'fs';
// import path from 'path';
import os from 'os';

const tokenFile = path.join(os.homedir(), '.g_stock_token.json');

ipcMain.handle('save-token', async (event, token) => {
  fs.writeFileSync(tokenFile, JSON.stringify({ token }), 'utf-8');
  return true;
});

ipcMain.handle('get-token', async () => {
  try {
    const data = fs.readFileSync(tokenFile, 'utf-8');
    return JSON.parse(data).token;
  } catch (e) {
    return null;
  }
});

ipcMain.handle('delete-token', async () => {
  try {
    fs.unlinkSync(tokenFile);
    return true;
  } catch (e) {
    return false;
  }
});