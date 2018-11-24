import apn from 'apn';
import apnProvider from './apnProvider';

const defaultOptions = {
  expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // Expires two weeks from now
  badge: 0,
  alert: '',
  title: '',
  body: '',
  payload: null,
  topic: 'com.vincentbello.Hunch',
};

export default class Notification {
  constructor(options) {
    const fullOptions = { ...defaultOptions, ...options };

    this.notification = new apn.Notification();
    this.notification.expiry = fullOptions.expiry;
    this.notification.badge = fullOptions.badge;
    this.notification.alert = fullOptions.alert;
    this.notification.title = fullOptions.title;
    this.notification.body = fullOptions.body;
    this.notification.payload = fullOptions.payload;
    this.notification.topic = fullOptions.topic;
  }

  async send(deviceToken) {
    return await apnProvider.send(this.notification, deviceToken);
  }
}
