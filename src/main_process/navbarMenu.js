const { ipcMain } = require('electron');

import { MENU_IMAGE_SAVE, MENU_IMAGE_DUPLICATE } from '@/contracts/menu'

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
          label: 'Zdjęcia',
          enabled: true,
          click: function () {
            win.webContents.send('change-route','Home')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Dodaj zdjęcie',
          enabled: true,
          click: function () {
            win.webContents.send('change-route','FilesPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Duplikuj aktywne',
          click: function () {
            win.webContents.send(MENU_IMAGE_DUPLICATE)
          }
        },
        {
          label: 'Zapisz obraz',
          click: function () {
            win.webContents.send(MENU_IMAGE_SAVE)
          }
        }
      ]
    },
    {
      label: 'Operacje',
      submenu: [
        {
          label: 'Rozciągnij / wyrównaj histogram',
          enabled: false,
          click: function () {
            win.webContents.send('change-route','StretchHistogramPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Negacja',
          enabled: false,
          click: function () {
            win.webContents.send('change-route','NegationPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Progowanie',
          enabled: false,
          click: function () {
            win.webContents.send('change-route','TresholdPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Posteryzacja',
          enabled: false,
          click: function () {
            win.webContents.send('change-route','PosterizationPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Wygładzania liniowego (blur)',
          enabled: false,
          click: function () {
            win.webContents.send('change-route','BlurPage')
          },
          meta: {
            requiredImages: 1
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