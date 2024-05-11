import { Component } from '@angular/core';

@Component({
  selector: 'app-controller-settings',
  templateUrl: './controller-settings.component.html',
  styleUrl: './controller-settings.component.scss'
})
export class ControllerSettingsComponent {
  gamepad = {
    LEFT_ANALOG: "移动",
    RIGHT_ANALOG: "移动",
    UP: "向上移动",
    RIGHT: "向右移动",
    DOWN: "向下移动",
    LEFT: "想左移动",
    LEFT_ANALOG_PRESS: "手柄工具栏",
    RIGHT_ANALOG_PRESS: "",
    A: "点击",
    B: "返回",
    X: "右键菜单",
    Y: "组合键",
    LEFT_TRIGGER: "",
    RIGHT_TRIGGER: "",
    LEFT_BUMPER: "移动到上一个",
    RIGHT_BUMPER: "移动到下一个",
    SELECT: "",
    START: "手柄按键说明",
    SPECIAL: "",
    UP_Y: "",
    RIGHT_Y: "",
    DOWN_Y: "",
    LEFT_Y: "",
    LEFT_ANALOG_PRESS_Y: "",
    RIGHT_ANALOG_PRESS_Y: "",
    A_Y: "",
    B_Y: "",
    X_Y: "",
    Y_Y: "",
    LEFT_TRIGGER_Y: "",
    LEFT_BUMPER_Y: "移动到第一个",
    RIGHT_TRIGGER_Y: "",
    RIGHT_BUMPER_Y: "移动到最后一个",
    SELECT_Y: "",
    START_Y: "",
    SPECIAL_Y: "",
  }
}
