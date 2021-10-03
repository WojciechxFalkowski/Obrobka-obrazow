'use strict'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import * as electron from "electron";
import path from 'path';

const {ipcMain} = require('electron');
const fs = require('fs');
const isDevelopment = process.env.NODE_ENV !== 'production'
// const cv = require('/public/opencv');
// console.log('cv');
// console.log(cv)
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

const Menu = electron.Menu;
const MenuItems = electron.MenuItem;

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: false,//process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: true,//!process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: false,
            // __static is set by webpack and will point to the public directory
            preload: path.resolve(__static, 'preload.js'),
            //TODO :src="images[0].path" not working without it
            webSecurity: process.env.NODE_ENV !== 'development'
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
    const template = [
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {role: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'pasteandmatchstyle'},
                {role: 'delete'},
                {role: 'selectall'},
            ]
        },
        {
            label: 'demo',
            submenu: [
                {
                    label: 'sabmenu1',
                    click: function () {
                        console.log('clicked submenu 1')
                    }
                },
                {
                    label: 'sabmenu2',
                    click: function () {
                        console.log('clicked submenu 2')
                    }
                },
                {
                    label: 'sabmenu3',
                    click: function () {
                        console.log('clicked submenu 3')
                    }
                }
            ]
        },
        {
            label: 'demo 2',
            submenu: [
                {
                    label: 'sabmenu 4',
                    click: function () {
                        console.log('clicked submenu 4')
                    }
                },
                {
                    label: 'sabmenu 5',
                    click: function () {
                        console.log('clicked submenu 5')
                    }
                },
                {
                    label: 'sabmenu 6',
                    click: function () {
                        console.log('clicked submenu 6')
                    }
                }
            ]
        }]
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)

    const ctxMenu = new Menu();
    ctxMenu.append(new MenuItems({
        label: 'Hello',
        click: function () {
            console.log('Context menu item clicked')
        }
    }))
    ctxMenu.append(new MenuItems({
        role: 'selectAll',
    }))
    win.webContents.on('context-menu', function (e, params) {
        ctxMenu.popup(win, params.x, params.y)
    })
}
ipcMain.on('TEST_IPC-MAIN', (event, payload) => {
    console.log("TEST_IPC-MAIN")
    console.log(payload) // prints "ping"
    event.returnValue = "test value"
});
ipcMain.on('READ_FILE', (event, payload) => {
    console.log('READ_FILE')
    // console.log(event)
    console.log(payload)
    console.log(fs)
    console.log(__dirname)
    console.log(fs.existsSync(__dirname))

    const pathName = path.join(__dirname, 'images');
    let file = path.join(pathName, 'file1');
    let contents = 'siemka';
    

    if (!fs.existsSync(pathName)) {
        fs.mkdirSync(pathName);
    }
    fs.writeFile(file, contents, function (err) {
        console.log('BEZ BLEDU')
        if (err) {
            console.log(err)
        }
    })


    console.log(fs.readdir('C:\\Users\\48698\\OneDrive\\Documents\\skill\\projects\\apo_wojciech_falkowski\\', (e, files) => {
        console.log(files)
    }))
    console.log(fs.readdir(__dirname, (e, files) => {
        console.log(e)
        console.log("ee?")
        console.log(files)
    }))
    // const content = fs.readFile(payload.path);
    // console.log(content)
    // event.reply('READ_FILE', { content });
    event.reply('READ_FILE', {content: 'content'});
});

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
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
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
