// @flow
import PushNotification from 'react-native-push-notification';

export default class NotificationService {
  constructor(onRegister: (token: string) => void) {
    this.configure(onRegister);
  }

  configure(onRegister: (token: string) => void) {
    PushNotification.configure({
      onRegister,

      // (required) Called when a remote or local notification is opened or received
      onNotification: console.log,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: false,
        badge: true,
        sound: false,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }
}
