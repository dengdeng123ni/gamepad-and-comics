import { Injectable } from '@angular/core';
import { GamepadInputService } from './gamepad-input.service';
import { KeyboardEventService } from './keyboard-event.service';


import { IndexdbControllerService } from '../public-api';



@Injectable({
  providedIn: 'root'
})
export class KeyboardControllerService {
  key = '_keyboard_config';

  public config = {
    "UP": "ArrowUp",
    "RIGHT": "ArrowRight",
    "DOWN": "ArrowDown",
    "LEFT": "ArrowLeft",
    "LEFT_ANALOG_PRESS": "p",
    "RIGHT_ANALOG_PRESS": "l",
    "A": "Space",
    "B": "Alt",
    "X": "Shift",
    "Y": "Control",
    "LEFT_TRIGGER": "[",
    "LEFT_BUMPER": "-",
    "RIGHT_TRIGGER": "]",
    "RIGHT_BUMPER": "=",
    "SELECT": "",
    "START": "",
    "SPECIAL": ""
  }

  public _config = {
    "UP": "ArrowUp",
    "RIGHT": "ArrowRight",
    "DOWN": "ArrowDown",
    "LEFT": "ArrowLeft",
    "LEFT_ANALOG_PRESS": "p",
    "RIGHT_ANALOG_PRESS": "l",
    "A": "Space",
    "B": "Alt",
    "X": "Shift",
    "Y": "Control",
    "LEFT_TRIGGER": "[",
    "LEFT_BUMPER": "-",
    "RIGHT_TRIGGER": "]",
    "RIGHT_BUMPER": "=",
    "SELECT": "视图按钮",
    "START": "菜单按钮",
    "SPECIAL": "配置文件按钮"
  }



  constructor(
    public GamepadInput: GamepadInputService,
    public KeyboardEvent: KeyboardEventService,
    public webDb: IndexdbControllerService,
  ) {
    this.init();
  }

  async init() {
    const config: any = await this.webDb.getByKey('data', this.key);
    if (config) {
      this.config = config.data;
    }
    this.register();


  }

  register(){
    let obj = {};
    Object.keys(this.config).forEach(x => {
      obj[this.config[x]] = () => this.GamepadInput.down$.next(x)
    })
    this.KeyboardEvent.registerGlobalEvent(obj)
  }

  reset(){
    this.config=this._config;
    this.webDb.update('data', {
      id: this.key,
      data: this.config
    })
    this.register();
  }



  setKeyConfig(key, value) {
    Object.keys(this.config).forEach(x => {
      if (this.config[x] == value) {
        this.config[x] = "";
      }
    })
    this.config[key] = value;
    this.register();
    this.webDb.update('data', {
      id: this.key,
      data: this.config
    })

  }




}
