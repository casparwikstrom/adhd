const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { SimpleGit, simpleGit } = require('simple-git');

let mainWindow;

// Get the current terminal's working directory
const currentWorkingDir = process.env.PWD || process.cwd();
const git = simpleGit(currentWorkingDir);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the index.html from a url in development
  // or the local file in production.
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open the DevTools in development.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
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

// Watch for Git commits
let lastCommitHash = '';

async function checkGitCommits() {
  try {
    const log = await git.log();
    const latestCommit = log.latest;
    debugger;
    if (latestCommit && latestCommit.hash !== lastCommitHash) {
      console.log('New commit detected:', latestCommit.message);
      lastCommitHash = latestCommit.hash;
      mainWindow.webContents.send('git-commit', latestCommit);
    }
  } catch (error) {
    // Silently handle the error - the directory might not be a git repo
    // or we might not have permission to access it
    console.log('Checking git directory:', currentWorkingDir);
  }
}

// Check for new commits every 30 seconds
setInterval(checkGitCommits, 10000);
