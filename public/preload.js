const {contextBridge, ipcRenderer} = require('electron');
const dom = require('./dom');
const path = require("path");
// const cv = require('./utils/opencv');

// const validChannels = ['READ_FILE', 'WRITE_FILE','TEST_IPC-MAIN'];
contextBridge.exposeInMainWorld(
    'customAPI', {
        ipcRenderer: {...ipcRenderer},
        file: {...dom},
        uploadPath: path.join(__dirname, 'uploads'),
        cv: {
            abc: 'dupa',
            // ass:cv
        }

    }
    // 'ipc', {
    //     send: (channel, data) => {
    //         if (validChannels.includes(channel)) {
    //             ipcRenderer.send(channel, data);
    //         }
    //     },
    //     on: (channel, func) => {
    //         if (validChannels.includes(channel)) {
    //             // Strip event as it includes `sender` and is a security risk
    //             ipcRenderer.on(channel, (event, ...args) => func(...args));
    //         }
    //     },
    // },
);
// contextBridge.exposeInMainWorld();