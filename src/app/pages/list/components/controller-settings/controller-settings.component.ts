import { Component, HostListener } from '@angular/core';
import { GetKeyboardKeyService } from '../get-keyboard-key/get-keyboard-key.service';
import { KeyboardControllerService, KeyboardEventService } from 'src/app/library/public-api';

@Component({
  selector: 'app-controller-settings',
  templateUrl: './controller-settings.component.html',
  styleUrl: './controller-settings.component.scss'
})
export class ControllerSettingsComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (this.is_key_capture) {
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
        name: "空格/Enter"
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
      id: "X",
      name: "右键菜单",
      mouse: {
        edit: true,
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
    public KeyboardController: KeyboardControllerService
  ) {
    this.init();
  }

  init() {
    this.list.forEach(x => {
      if (this.KeyboardController.config[x.id]) {
        x.keyboard.name = this.KeyboardController.config[x.id];
        if (x.keyboard.name == "ArrowUp") x.keyboard.name = "↑";
        if (x.keyboard.name == "ArrowDown") x.keyboard.name = "↓";
        if (x.keyboard.name == "ArrowLeft") x.keyboard.name = "←";
        if (x.keyboard.name == "ArrowRight") x.keyboard.name = "→";
        if (x.keyboard.name == "Space") x.keyboard.name = "空格";
      }else{

        if(x.keyboard)  {
          x.keyboard.name=""
        }
      }
    })
  }

  on(id) {
   setTimeout(()=>{
    this.is_key_capture = true;
    this.key = id;
    this.GetKeyboardKey.open();
    this.timeout = setTimeout(() => {
      if (this.is_key_capture) {
        this.GetKeyboardKey.close();
        this.is_key_capture = false;
      }
    }, 2899)
   },100)

  }

}
