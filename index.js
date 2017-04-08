const {app, BrowserWindow, ipcMain, session} = require('electron')
const path = require('path')
const url = require('url')

let win

const PORT = 3000;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 500,
    height: 600,
    // frame: false,
    // resizable: false,
  })

  let config = 'http://localhost:4200';

  if(process.env.NODE_ENV === "production") {
      config = url.format({
        pathname: path.join(__dirname, 'html/', 'index.html'),
        protocol: 'file:',
        slashes: true
    })
  }

  win.loadURL(config);
  // and load the index.html of the app.

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

let server;
ipcMain.on('start:express', () => {
  if (!server) {
    const expressApp = require('./server/app');
    server = expressApp.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
    })
  }
})

ipcMain.on('end:express', () => {
  if (server) {
    console.log(`Closing on port ${PORT}`)
    server.close();
    server = null;
  }
})

ipcMain.on('logout', () => {
  session.defaultSession.cookies.remove('*', '*', () => {})
  session.defaultSession.clearCache(() => {})
  session.defaultSession.clearStorageData(() => {})
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})