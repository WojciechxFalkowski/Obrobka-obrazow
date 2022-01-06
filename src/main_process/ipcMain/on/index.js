import {dialog} from "electron";
import fs from "fs";
import io from "./../../io";
import path from "path";

const {ipcMain} = require('electron');

export const bootIpcMainOn = (win) => {
    /**
     * Save image after choose in navbar menu option 'Zapisz obraz'.
     */
    ipcMain.on('app:save-image', (event, activeImages) => {
        console.log('on app:save-image')
        // console.log(event)
        console.log(activeImages)

        if (activeImages.length > 1) {
            dialog.showErrorBox('ERROR', 'Można zapisać na raz tylko jedno zdjęcie.')
        } else if (activeImages.length === 1) {
            const activeImage = activeImages[0];
            const url = activeImage.imageDataURL;
            if (!url) {
                dialog.showErrorBox('ERROR', 'Zdjęcię nie posiada wartości "imageDataURL".')
                return;
            }
            dialog.showSaveDialog(win, {
                title: 'Title',
                defaultPath: 'Capture',
                filters: [{name: 'Images', extensions: ['png', 'jpg','bmp']}],
            }).then(res => {
                console.log('data')
                console.log(res)

                // remove Base64 stuff from the Image
                const base64Data = url.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(res.filePath, base64Data, 'base64', function (err) {
                    if (err) {
                        console.log(err);
                        dialog.showErrorBox('ERROR', 'Nie można zapisać zdjęcia.')
                    } else {
                        dialog.showMessageBox(win, {
                            title: 'Obraz',
                            message: 'Zapisano zdjęcię.'
                        })
                    }

                });
            })
        } else {
            dialog.showErrorBox('ERROR', 'Zapisanie zdjęcia nie powiodło się.')
        }
    });

    /**
     * listen to file open event
     */
    ipcMain.on('app:on-file-open', (event, file) => {
        io.openFile(file.filepath);
    });

    /**
     * TEST
     */
    ipcMain.on('asynchronous-message', function (evt, message) {

        if (message.text === 'createNewWindow') {

            console.log('Message received.')
            console.log(message)
            evt.reply('asynchronous-reply', {a: 'A', id: message.id, text: message.text})
            // Message received.
            // Create new window here.
        }
    });

    /**
     * Listen to file copy event
     */
    ipcMain.on('app:on-file-copy', (event, file) => {
        event.sender.startDrag({
            file: file.filepath,
            icon: path.resolve(__dirname, './resources/paper.png'),
        });
    });
}