exports.getMenuItems = () =>
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
