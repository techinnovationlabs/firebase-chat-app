
import React, { useEffect, useReducer, useContext } from 'react';

import PushNotification from 'react-native-push-notification';

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);
    },
    popInitialNotification: true,
    requestPermissions: true,
});

export const LocalNotification = () => {
    PushNotification.localNotification({
        message: "My Notification Message", // (required)
        date: new Date(Date.now() + 60 * 1000), // in 60 secs
        // allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        channelId: "channel-id",
        /* Android Only Properties */
        // repeatTime: 1,
    });
};