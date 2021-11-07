// const rightClickMenu = require('./main_process/right_click_menu');
// exports.getMenuItems = () =>
//     [
//         {
//             label: 'Hello',
//             click: function () {
//                 console.log('Context menu item clicked')
//             }
//         },
//         {
//             role: 'selectAll',
//         },
//         {
//             role: 'toggleDevTools',
//         },
//         {
//             role: 'forceReload',
//         },
//     ]
export const getMenuItems = () =>
    [
        {
            label: 'Hello',
            click: function () {
                console.log('Context menu item clicked')
            }
        },
        {
            role: 'selectAll',
        },
        {
            role: 'toggleDevTools',
        },
        {
            role: 'forceReload',
        },
    ]
export const bootRightClickMenu = (ctxMenu, MenuItems) => {
    getMenuItems().forEach(rightClickMenuItem => {
        ctxMenu.append(new MenuItems(rightClickMenuItem))
    })
}