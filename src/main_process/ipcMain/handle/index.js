import {dialog, ipcMain} from "electron";
import io from "./../../io";
import path from "path";

export const bootIpcMainHandle = () => {
    /**
     * Return list of files
     */
    ipcMain.handle('app:get-files', () => {
        return io.getFiles();
    });

    /**
     * Listen to file(s) add event
     */
    ipcMain.handle('app:on-file-add', (event, files = []) => {
        io.addFiles(files);
    });

    /**
     *  Open filesystem dialog to choose files
     */
    ipcMain.handle('app:on-fs-dialog-open', () => {
        const files = dialog.showOpenDialogSync({
            properties: ['openFile', 'multiSelections'],
        });
        io.addFiles(files.map(filepath => {
            return {
                name: path.parse(filepath).base,
                path: filepath,
            };
        }));
    });

    /**
     * Listen to file delete event
     */
    ipcMain.handle('app:on-file-delete', (event, file) => {
        io.deleteFile(file.filepath);
    });

}