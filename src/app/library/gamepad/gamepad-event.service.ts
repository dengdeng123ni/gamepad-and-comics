import { Injectable } from '@angular/core';

interface GamepadEvents {
  UP?: Function;
  RIGHT?: Function;
  DOWN?: Function;
  LEFT?: Function;
  LEFT_ANALOG_PRESS?: Function;
  RIGHT_ANALOG_PRESS?: Function;
  A?: Function;
  B?: Function;
  X?: Function;
  Y?: Function;
  LEFT_TRIGGER?: Function;
  LEFT_BUMPER?: Function;
  RIGHT_TRIGGER?: Function;
  RIGHT_BUMPER?: Function;
  SELECT?: Function;
  START?: Function;
  SPECIAL?: Function;

  MoveEnd?: Function;
}

interface HoverEvents {
  ENTER: Function;
  LEAVE: Function;
}

interface Config {
  region: Array<string>,
  queryStr?: string
}

interface VoiceConfig {
  event: Function,
  keywords: Array<string>
  key: string,
  region: string
}

@Injectable({
  providedIn: 'root'
})
export class GamepadEventService {
  public areaEvents: Record<string, GamepadEvents> = {};
  public areaEventsY: Record<string, GamepadEvents> = {};
  public globalEvents: GamepadEvents = {};
  public globalEventsY: GamepadEvents = {};

  public areaSoundEvents: Record<string, GamepadEvents> = {};
  public areaSoundEventsY: Record<string, GamepadEvents> = {};
  public globalSoundEvents: GamepadEvents = {};
  public globalSoundEventsY: GamepadEvents = {};

  public hoverEvents: Record<string, HoverEvents> = {};

  public configs: Record<string, Config> = {};

  public voiceEvents: Record<string, any> = {};

  constructor() {
    window._gh_region_register = this.registerConfig
  }

  // Register Y, area event as the first trigger
  registerAreaEventY(key: string, gamepad: GamepadEvents): void {
    if (this.areaEventsY[key]) this.areaEventsY[key] = { ...this.areaEventsY[key], ...gamepad };
    else this.areaEventsY[key] = gamepad;
  }

  // Register area event as the second trigger
  registerAreaEvent(key: string, gamepad: GamepadEvents): void {
    if (this.areaEvents[key]) this.areaEvents[key] = { ...this.areaEvents[key], ...gamepad };
    else this.areaEvents[key] = gamepad;
  }

  // Register Y, global event as the third trigger
  registerGlobalEventY(gamepad: GamepadEvents): void {
    this.globalEventsY = { ...this.globalEventsY, ...gamepad };
  }

  // Register global event as the fourth trigger
  registerGlobalEvent(gamepad: GamepadEvents): void {
    this.globalEvents = { ...this.globalEvents, ...gamepad };
  }


  // Register Y, area event as the first trigger
  registerAreaSoundEventY(key: string, gamepad: GamepadEvents): void {
    if (this.areaSoundEventsY[key]) this.areaSoundEventsY[key] = { ...this.areaSoundEventsY[key], ...gamepad };
    else this.areaSoundEventsY[key] = gamepad;
  }

  // Register area event as the second trigger
  registerAreaSoundEvent(key: string, gamepad: GamepadEvents): void {
    if (this.areaSoundEvents[key]) this.areaSoundEvents[key] = { ...this.areaSoundEvents[key], ...gamepad };
    else this.areaSoundEvents[key] = gamepad;
  }

  // Register Y, global event as the third trigger
  registerGlobalSoundEventY(gamepad: GamepadEvents): void {
    this.globalSoundEventsY = { ...this.globalSoundEventsY, ...gamepad };
  }

  // Register global event as the fourth trigger
  registerGlobalSoundEvent(gamepad: GamepadEvents): void {
    this.globalSoundEvents = { ...this.globalSoundEvents, ...gamepad };
  }

  // Register hover event
  registerHoverEvent(key: string, hover: HoverEvents): void {
    this.hoverEvents[key] = hover;
  }

  registerConfig = (key: string, config: Config): void => {
    const list = config.region;
    const str = list.map(x => `[region=${x}]`).toString();
    config.queryStr = str;
    this.configs[key] = config;
  }

  registerVoice(config: VoiceConfig) {
    if (!this.voiceEvents[config.region]) this.voiceEvents[config.region] = {};
    this.voiceEvents[config.region][config.key] = {
      keywords: config.keywords,
      event: config.event
    };
  }

}
