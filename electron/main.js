const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
let mainWindow;
let serverProcess;

function startServer() {
  // Start the server from the built files
  const serverPath = path.join(__dirname, '../server/dist/index.js');
  serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit'
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // In production, load the built client files
  mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));

  // Uncomment for dev tools in production
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
}); 