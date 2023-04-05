import { log2, error, isGamepadSupported } from './tools';
import { MESSAGES } from './constants';
import gamepad from './gamepad';
declare const window: any;
const gameControl = {
  gamepads: {},
  axeThreshold: [1.0], // this is an array so it can be expanded without breaking in the future
  isReady: isGamepadSupported(),
  onConnect() {},
  onDisconnect() {},
  onBeforeCycle() {},
  onAfterCycle() {},
  getGamepads() {
    return this.gamepads;
  },
  getGamepad(id) {
    if (this.gamepads[id]) {
      return this.gamepads[id];
    }
    return null;
  },
  set(property, value) {
    const properties = ['axeThreshold'];
    if (properties.indexOf(property) >= 0) {
      if (property === 'axeThreshold' && (!parseFloat(value) || value < 0.0 || value > 1.0)) {
        error(MESSAGES.INVALID_VALUE_NUMBER);
        return;
      }

      this[property] = value;

      if (property === 'axeThreshold') {
        const gps = this.getGamepads();
        const ids = Object.keys(gps);
        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < ids.length; x++) {
          gps[ids[x]].set('axeThreshold', this.axeThreshold);
        }
      }
    } else {
      error(MESSAGES.INVALID_PROPERTY);
    }
  },
  checkStatus() {
    const requestAnimationFrame =
      window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    const gamepadIds = Object.keys(gameControl.gamepads);

    gameControl.onBeforeCycle();

    // tslint:disable-next-line: prefer-for-of
    for (let x = 0; x < gamepadIds.length; x++) {
      gameControl.gamepads[gamepadIds[x]].checkStatus();
    }

    gameControl.onAfterCycle();

    if (gamepadIds.length > 0) {
      requestAnimationFrame(gameControl.checkStatus);
    }
  },
  init() {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      const win = (window as any);
      const egp = e.gamepad || (e as any).detail.gamepad;
      log2(MESSAGES.ON);
      if (!win.gamepads) { win.gamepads = {}; }
      if (egp) {
        if (!win.gamepads[egp.index]) {
          win.gamepads[egp.index] = egp;
          const gp = gamepad.init(egp);
          gp.set('axeThreshold', this.axeThreshold);
          this.gamepads[gp.id] = gp;
          this.onConnect(this.gamepads[gp.id]);
        }
        if (Object.keys(this.gamepads).length === 1) { this.checkStatus(); }
      }
    });
    window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
      const win = (window as any);
      const egp = e.gamepad || (e as any).detail.gamepad;
      log2(MESSAGES.OFF);
      if (egp) {
        delete win.gamepads[egp.index];
        delete this.gamepads[egp.index];
        this.onDisconnect(egp.index);
      }
    });
  },
  on(eventName, callback) {
    switch (eventName) {
      case 'connect':
        this.onConnect = callback;
        break;
      case 'disconnect':
        this.onDisconnect = callback;
        break;
      case 'beforeCycle':
      case 'beforecycle':
        this.onBeforeCycle = callback;
        break;
      case 'afterCycle':
      case 'aftercycle':
        this.onAfterCycle = callback;
        break;
      default:
        error(MESSAGES.UNKNOWN_EVENT);
        break;
    }
    return this;
  },
  off(eventName) {
    switch (eventName) {
      case 'connect':
        this.onConnect = () => {};
        break;
      case 'disconnect':
        this.onDisconnect = () => {};
        break;
      case 'beforeCycle':
      case 'beforecycle':
        this.onBeforeCycle = () => {};
        break;
      case 'afterCycle':
      case 'aftercycle':
        this.onAfterCycle = () => {};
        break;
      default:
        error(MESSAGES.UNKNOWN_EVENT);
        break;
    }
    return this;
  }
};

gameControl.init();

export default gameControl;
