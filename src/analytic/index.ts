import config from 'config/config';

// eslint-disable-next-line
const mixpanel = require('mixpanel');

export class Analytic {
  constructor() {
    this.start();
  }

  instance;

  start() {
    this.instance = mixpanel.init(config.mixPanel.token, {
      debug: config.isDev,
    });
  }
  send(eventName: string, id: string | number, options: object = {}) {
    if (this.instance) {
      this.instance.track(eventName, {
        distinct_id: id,
        UserID: id,
        ...options,
      });
    }
  }
  sendError(message, error) {
    this.send('APP CAUGHT ERROR', 'APP', { error, message });
  }
}

export default new Analytic();
