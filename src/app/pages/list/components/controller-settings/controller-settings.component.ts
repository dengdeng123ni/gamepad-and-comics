import { Component } from '@angular/core';

@Component({
  selector: 'app-controller-settings',
  templateUrl: './controller-settings.component.html',
  styleUrl: './controller-settings.component.scss'
})
export class ControllerSettingsComponent {
  list = [
    {
      id: "up",
      name: "向上移动",
      keyboard: {
        edit:false,
        key: "",
        name: "↑"
      },
      gamepad:{
        key: "UP",
        name: "UP",
        edit:false,
      }
    },
    {
      id: "down",
      name: "向下移动",
      keyboard: {
        edit:false,
        key: "",
        name: "↓"
      },
      gamepad:{
        key: "DOWN",
        name: "DOWN",
        edit:false,
      }
    },
    {
      id: "right",
      name: "向右移动",
      keyboard: {
        edit:false,
        key: "",
        name: "→"
      },
      gamepad:{
        key: "RIGHT",
        name: "RIGHT",
        edit:false,
      }

    },
    {
      id: "left",
      name: "向左移动",
      keyboard: {
        edit:false,
        key: "",
        name: "←"
      },
      gamepad:{
        key: "LEFT",
        name: "LEFT",
        edit:false,
      }
    },

    {
      id: "click",
      name: "点击",
      mouse:{
        edit:false,
        name:"鼠标左键"
      },
      keyboard: {
        edit:false,
        key: "",
        name: "空格/Enter"
      },
      gamepad:{
        key: "A",
        name: "A",
        edit:false,
      }
    },
    {
      id: "back",
      name: "返回",
      keyboard: {
        edit:false,
        key: "",
        name: "Esc"
      },
      gamepad:{
        key: "B",
        name: "B",
        edit:false,
      }
    },

    {
      id: "key_combinations",
      name: "组合键",
      keyboard: {
        edit:false,
        key: "Control",
        name: "Control"
      },
      gamepad:{
        key: "Y",
        name: "Y",
        edit:false,
      }
    },
    {
      id: "context_menu",
      name: "右键菜单",
      mouse:{
        edit:false,
        name:"鼠标右键"
      },
      keyboard: {
        edit:false,
        key: "SHIFT",
        name: "⇧"
      },
      gamepad:{
        key: "X",
        name: "X",
        edit:false,
      }
    },
    {
      id: "toolbar",
      name: "工具栏",
      keyboard: {
        edit:false,
        key: "P",
        name: "P"
      },
      gamepad:{
        key: "LEFT_ANALOG_PRESS",
        name: "左摇杆键",
        edit:false,
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


}
