export const navbarMenu = (win) => {
    return [
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
            label: 'Obraz',
            submenu: [
                {
                    label: 'Duplikuj aktywne',
                    click: function () {
                        console.log('images:duplicate');
                        win.webContents.send('images:duplicate')
                    }
                },
                {
                    label: 'Zapisz obraz',
                    click: function () {
                        win.webContents.send('images:save')
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
}
export const bootNavbarMenu = (win, Menu) => {
    const menu = Menu.buildFromTemplate(navbarMenu(win));
    Menu.setApplicationMenu(menu)
}