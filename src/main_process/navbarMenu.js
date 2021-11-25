const { ipcMain } = require('electron');

import { MENU_IMAGE_SAVE, MENU_IMAGE_DUPLICATE, MENU_ROUTE_HISTOGRAM } from '@/contracts/menu'

const navbarMenu = (win) => {
  return [
    // {
    //     label: 'Edit',
    //     submenu: [
    //         {role: 'undo'},
    //         {role: 'redo'},
    //         {role: 'separator'},
    //         {role: 'cut'},
    //         {role: 'copy'},
    //         {role: 'paste'},
    //         {role: 'pasteandmatchstyle'},
    //         {role: 'delete'},
    //         {role: 'selectall'},
    //     ]
    // },
    {
      label: 'Obraz',
      submenu: [
        {
          label: 'Duplikuj aktywne',
          click: function () {
            console.log(MENU_IMAGE_DUPLICATE);
            win.webContents.send(MENU_IMAGE_DUPLICATE)
          }
        },
        {
          label: 'Zapisz obraz',
          click: function () {
            win.webContents.send(MENU_IMAGE_SAVE)
          }
        }
        // {
        //     label: 'sabmenu3',
        //     click: function () {
        //         console.log('clicked submenu 3')
        //     }
        // }
      ]
    },
    {
      label: 'Operacje',
      submenu: [
        {
          label: 'submenu 4',
          enabled: false,
          click: function () {
            win.webContents.send('change-route',MENU_ROUTE_HISTOGRAM)
          },
          meta: {
            requiredImages: 2
          }
        },
        {
          label: 'sabmenu 5',
          click: function () {
            console.log('clicked submenu 5')
          },
          meta: {
            requiredImages: null
          }
        },
        {
          label: 'sabmenu 6',
          click: function () {
            console.log('clicked submenu 6')
          },
          meta: {
            requiredImages: 5
          }
        }
      ]
    }
  ]
}
export const bootNavbarMenu = (win, Menu) => {
  const menuItems = navbarMenu(win)
  const menu = Menu.buildFromTemplate(menuItems);
  Menu.setApplicationMenu(menu)

  ipcMain.on('logged-in', (event, imagesAmount) => {
    console.log('logged-in')
    console.log(imagesAmount)

    // Modify menu item status
    const navbarMenuItems = menuItems
    // console.log(navbarMenuItems[1].submenu[0].enabled)
    // console.log(navbarMenuItems[1].submenu[0].enabled)
    // navbarMenuItems[1].submenu[0].enabled = !navbarMenuItems[1].submenu[0].enabled;
    const operationMenu = menuItems.find(menuItem=>menuItem.label==='Operacje')
    operationMenu.submenu.forEach(submenu => {
        submenu.enabled = submenu.meta.requiredImages === imagesAmount
    })
    // Rebuild menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(navbarMenuItems));
  });

}