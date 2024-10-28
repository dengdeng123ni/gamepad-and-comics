import { Injectable } from '@angular/core';
import { GamepadInputService } from './gamepad-input.service';
import { KeyboardEventService } from './keyboard-event.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';



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
    "RIGHT_ANALOG_PRESS": "右摇杆按钮",
    "A": "Space",
    "B": "Alt",
    "X": "Shift",
    "Y": "Control",
    "LEFT_TRIGGER": "左缓冲键",
    "LEFT_BUMPER": "左扳机键",
    "RIGHT_TRIGGER": "右缓冲键",
    "RIGHT_BUMPER": "右扳机键",
    "SELECT": "视图按钮",
    "START": "菜单按钮",
    "SPECIAL": "配置文件按钮"
  }



  constructor(
    public GamepadInput: GamepadInputService,
    public KeyboardEvent: KeyboardEventService,
    public webDb: NgxIndexedDBService,
  ) {
    this.init();
  }

  async init() {
    const config: any = await firstValueFrom(this.webDb.getByKey('data', this.key));
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



  setKeyConfig(key, value) {
    Object.keys(this.config).forEach(x => {
      if (this.config[x] == value) {
        this.config[x] = "";
      }
    })
    this.config[key] = value;
    this.register();
    firstValueFrom(this.webDb.update('data', {
      id: this.key,
      data: this.config
    }))

  }




}
