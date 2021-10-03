const { Notification } = require( 'electron' );

// display files added notification
exports.filesAdded = ( size ) => {
    const notification = new Notification( {
        title: 'Files added',
        body: `${ size } file(s) has been successfully added.`
    } );

    notification.show();
};
