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
          click: function () {
            win.webContents.send('change-route', 'Home')
          }
        },
        {
          label: 'Dodaj zdjęcie',
          click: function () {
            win.webContents.send('change-route', 'FilesPage')
          }
        },
        {
          label: 'Duplikuj aktywne',
          enabled: false,
          click: function () {
            win.webContents.send(MENU_IMAGE_DUPLICATE)
          },
          meta: {
            minImages: 1
          }
        },
        {
          label: 'Zapisz obraz',
          enabled: false,
          click: function () {
            win.webContents.send(MENU_IMAGE_SAVE)
          },
          meta: {
            requiredImages: 1
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
            win.webContents.send('change-route', 'StretchHistogramPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Negacja',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'NegationPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Progowanie',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'TresholdPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Posteryzacja',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'PosterizationPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Wygładzania liniowego (blur)',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'BlurPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Wyostrzanie liniowego',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'Filters2DPage')
          },
          meta: {
            requiredImages: 1
          }
        },
        {
          label: 'Dwuargumentowe',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'MaskPage')
          },
          meta: {
            requiredImages: 2
          }
        },
        {
          label: 'Segmentacja',
          enabled: false,
          click: function () {
            win.webContents.send('change-route', 'SegmentationPage')
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

  ipcMain.on('app:on-active-images-change', (event, imagesAmount) => {

    // Modify menu item status
    const navbarMenuItems = menuItems

    menuItems.forEach(menuItem => {
      menuItem.submenu.forEach(submenu => {
        if (submenu.meta) {
          if (submenu.meta.requiredImages) {
            submenu.enabled = submenu.meta.requiredImages === imagesAmount

          } else if (submenu.meta.minImages) {
            submenu.enabled = submenu.meta.minImages <= imagesAmount
          }
        }
      })
    })

    // Rebuild menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(navbarMenuItems));
  });

}