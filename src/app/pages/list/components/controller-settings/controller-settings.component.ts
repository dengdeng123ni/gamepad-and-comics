import { Component, HostListener } from '@angular/core';
import { GetKeyboardKeyService } from '../get-keyboard-key/get-keyboard-key.service';
import { GamepadControllerService, I18nService, IndexdbControllerService, KeyboardControllerService, KeyboardEventService, NotifyService } from 'src/app/library/public-api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-controller-settings',
  templateUrl: './controller-settings.component.html',
  styleUrl: './controller-settings.component.scss'
})
export class ControllerSettingsComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (this.is_key_capture) {
      if (event.key == "Enter" || event.key == "c" || event.key == "Tab" || event.key == "Escape") {
        this.Notify.messageBox(`${event.key} $[内置快捷键,不可选择]`, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
        return
      }
      if (event.code == "Space") {
        this.KeyboardController.setKeyConfig(this.key, "Space")
      } else {
        this.KeyboardController.setKeyConfig(this.key, event.key)
      }

      this.init();
      clearTimeout(this.timeout)
      this.GetKeyboardKey.close();
      this.is_key_capture = false;
    }
  }
  voice = {
    UP: '上/北风',
    RIGHT: '右/东风',
    DOWN: '下/南风',
    LEFT: '左/西风',
    LEFT_ANALOG_PRESS: '工具栏/幺鸡',
    RIGHT_ANALOG_PRESS: '右摇杆按钮',
    A: '点击/红中',
    B: '退出/白板/返回',
    X: '右键菜单/发财',
    Y: '',
    LEFT_TRIGGER: '左缓冲键',
    LEFT_BUMPER: '左扳机键',
    RIGHT_TRIGGER: '右缓冲键',
    RIGHT_BUMPER: '右扳机键',
    SELECT: '视图按钮',
    START: '菜单按钮',
    SPECIAL: '配置文件按钮'
  }

  voice2 = {
    UP: '上',
    RIGHT: '右',
    DOWN: '下',
    LEFT: '左',
    LEFT_ANALOG_PRESS: '工具栏',
    RIGHT_ANALOG_PRESS: '',
    A: '点击',
    B: '退出',
    X: '右键菜单',
    Y: ''
  }

  list = [
    {
      id: "UP",
      name: "向上移动",
      keyboard: {
        edit: true,
        name: "↑"
      },
      gamepad: {
        key: "UP",
        name: "UP",
        edit: false,
      },
      voice: {
        name: "",
        edit: false,
      }
    },
    {
      id: "DOWN",
      name: "向下移动",
      keyboard: {
        edit: true,
        name: "↓"
      },
      gamepad: {
        key: "DOWN",
        name: "DOWN",
        edit: false,
      }
    },
    {
      id: "RIGHT",
      name: "向右移动",
      keyboard: {
        edit: true,
        name: "→"
      },
      gamepad: {
        key: "RIGHT",
        name: "RIGHT",
        edit: false,
      }

    },
    {
      id: "LEFT",
      name: "向左移动",
      keyboard: {
        edit: true,
        name: "←"
      },
      gamepad: {
        key: "LEFT",
        name: "LEFT",
        edit: false,
      }
    },

    {
      id: "A",
      name: "点击",
      mouse: {
        edit: false,
        name: "鼠标左键"
      },
      keyboard: {
        edit: true,
        name: "空格"
      },
      gamepad: {
        key: "A",
        name: "A",
        edit: false,
      }
    },
    {
      id: "B",
      name: "返回",
      keyboard: {
        edit: true,
        name: "Esc"
      },
      gamepad: {
        key: "B",
        name: "B",
        edit: false,
      }
    },


    {
      id: "X",
      name: "右键菜单",
      mouse: {
        edit: false,
        name: "鼠标右键"
      },
      keyboard: {
        edit: true,
        key: "SHIFT",
        name: "⇧"
      },
      gamepad: {
        key: "X",
        name: "X",
        edit: false,
      }
    },
    {
      id: "Y",
      name: "组合键",
      keyboard: {
        edit: true,
        key: "Control",
        name: "Control"
      },
      gamepad: {
        key: "Y",
        name: "Y",
        edit: false,
      }
    },
    {
      id: "LEFT_ANALOG_PRESS",
      name: "工具栏",
      keyboard: {
        edit: true,
        key: "P",
        name: "P"
      },
      gamepad: {
        key: "LEFT_ANALOG_PRESS",
        name: "左摇杆键",
        edit: false,
      }
    },
    {
      id: "previous",
      name: "移动到上一个"
    },
    {
      id: "next",
      name: "移动到下一个"
    },
    {
      id: "first",
      name: "移动到第一个"
    },
    {
      id: "last",
      name: "移动到最后一个"
    }
  ]

  is_key_capture = false
  key = null;

  timeout = null;
  constructor(
    public GetKeyboardKey: GetKeyboardKeyService,
    public GamepadController: GamepadControllerService,
    public webDb: IndexdbControllerService,
    public Notify:NotifyService,
    public I18n: I18nService,
    public KeyboardController: KeyboardControllerService
  ) {
    this.init();

  }

  async init() {
    const 空格 = await this.I18n.getTranslatedText("空格")
    const language = document.body.getAttribute('language');
    if (language != "zh") {
      this.voice = this.voice2 as any;
    }
    this.list.forEach(x => {
      if (this.KeyboardController.config[x.id]) {

        x.keyboard.name = this.KeyboardController.config[x.id];
        if (x.keyboard.name == "ArrowUp") x.keyboard.name = "↑";
        if (x.keyboard.name == "ArrowDown") x.keyboard.name = "↓";
        if (x.keyboard.name == "ArrowLeft") x.keyboard.name = "←";
        if (x.keyboard.name == "ArrowRight") x.keyboard.name = "→";
        if (x.keyboard.name == "Space") x.keyboard.name = 空格;

        if (x.id == "A") x.keyboard.name = `${x.keyboard.name}/Enter`;

      } else {

        if (x.keyboard) {
          x.keyboard.name = ""
        }
        if (x.id == "A") x.keyboard.name = "Enter";
      }
    })
    this.list.forEach(x => {
      x.voice = {
        edit: false,
        name: ""
      }
      if (this.voice[x.id]) {
        x.voice.name = this.voice[x.id];

      } else {


      }
    })
  }

  on(id) {
    setTimeout(() => {
      this.is_key_capture = true;
      this.key = id;
      this.GetKeyboardKey.open();
      this.timeout = setTimeout(() => {
        if (this.is_key_capture) {
          this.GetKeyboardKey.close();
          this.is_key_capture = false;
        }
      }, 2899)
    }, 100)

  }
  reset() {
    this.KeyboardController.reset();
    this.init();
  }

  ngOnDestroy() {
    this.webDb.update('data', {
      id: "gamepad_controller_config",
      is_enabled_voice: this.GamepadController.is_voice_controller,
      is_enabled_sound: this.GamepadController.GamepadSound.opened
    })
  }
}
