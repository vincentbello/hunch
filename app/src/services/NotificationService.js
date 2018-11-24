import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';

export default class NotificationService {
  constructor(onRegister) {
    this.configure(onRegister);
  }

  configure(onRegister) {
    PushNotification.configure({
      onRegister,

      // (required) Called when a remote or local notification is opened or received
      onNotification: this.onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: false,
        badge: true,
        sound: false,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: false,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }

  onNotification = (notification) => {
    if (notification.data.betId) {
      Actions.betCard({ betId: notification.data.betId });
    }
  };
}
