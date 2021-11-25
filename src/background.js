'use strict'
// external dependencies
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import * as electron from 'electron';
import path from 'path';

// local dependencies
import { bootNavbarMenu } from './main_process/navbarMenu';
import { bootRightClickMenu } from './main_process/rightClickMenu';
import { bootIpcMainOn } from './main_process/ipcMain/on';
import { bootIpcMainHandle } from './main_process/ipcMain/handle';

const io = require('./main_process/io');
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const Menu = electron.Menu;
const MenuItems = electron.MenuItem;

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1800,
    height: 1000,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,//process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: true,//!process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: false,
      // __static is set by webpack and will point to the public directory
      preload: path.resolve(__static, 'preload.js'),
      //TODO :src="images[0].path" not working without it
      // webSecurity: process.env.NODE_ENV !== 'development'
      webSecurity: false
    }
  })
  // win.maximize();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  /**
   * Create navbar menu
   */
  bootNavbarMenu(win, Menu)

  /**
   * Create right click menu
   * @type {Electron.Menu}
   */
  const ctxMenu = new Menu();
  bootRightClickMenu(ctxMenu, MenuItems);

  win.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(win, params.x, params.y)
  })

  /**
   * Open dev tools on initialization application.
   */
  win.webContents.openDevTools()


  /**
   * Watch files
   * TODO probably its not working on macOs and it should be changed.
   */
  io.watchFiles(win);

  /**
   * Boot ipcMain on functions.
   */
  bootIpcMainOn(win);

  /**
   * Boot ipcMain handle functions.
   */
  bootIpcMainHandle();

}


/**
 * Quit when all windows are closed.
 */
app.on('window-all-closed', () => {

  //On macOS it is common for applications and their menu bar
  //to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  await createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
