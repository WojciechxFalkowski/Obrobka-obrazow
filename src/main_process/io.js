const path = require('path');
const fs = require('fs-extra');
const open = require('open');
const chokidar = require('chokidar');

// local dependencies
const notification = require('./notification');

// get application directory
const uploadPath = path.join(__dirname, 'uploads').replace("app.asar", "");

// const uploadPath = path.resolve( os.homedir(), 'electron-app-files' );

/****************************/

// get the list of files
exports.getFiles = () => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
    }

    const files = fs.readdirSync(uploadPath);
    console.log('files')
    console.log(files)

    return files.map(filename => {
        const filePath = path.resolve(uploadPath, filename);
        const fileStats = fs.statSync(filePath);

        return {
            name: filename,
            path: filePath,
            size: {
                number: Number(fileStats.size / 1000).toFixed(1),
                unit: 'kb'
            },
            time:{
              atime:fileStats.atime,
              mtime:fileStats.mtime,
              ctime:fileStats.ctime,
            }
        };
    });
};

/****************************/

// add files
exports.addFiles = (files = []) => {

    // ensure `uploadPath` exists
    fs.ensureDirSync(uploadPath);

    // copy `files` recursively (ignore duplicate file names)
    files.forEach(file => {
        const filePath = path.resolve(uploadPath, file.name);
        if (!fs.existsSync(filePath)) {
            fs.copyFileSync(file.path, filePath);
        }
    });

    // display notification
    notification.filesAdded(files.length);
};

// delete a file
exports.deleteFile = (filename) => {
    const filePath = path.resolve(uploadPath, filename);

    // remove file from the file system
    if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
    }
};

// open a file
exports.openFile = (filename) => {
    const filePath = path.resolve(uploadPath, filename);

    // open a file using default application
    if (fs.existsSync(filePath)) {
        open(filePath);
    }
};

/*-----*/

// watch files from the application's storage directory
exports.watchFiles = (win) => {
    chokidar.watch(uploadPath).on('unlink', (filepath) => {
        win.webContents.send('app:delete-file', path.parse(filepath).base);
    });
}
