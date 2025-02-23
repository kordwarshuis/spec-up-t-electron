const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

ipcMain.on('run-script', (event, script) => {
    exec(`npm run ${script}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${script}: ${error}`);
            return;
        }
        console.log(`Output of ${script}: ${stdout}`);
        if (stderr) {
            console.error(`Error output of ${script}: ${stderr}`);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});