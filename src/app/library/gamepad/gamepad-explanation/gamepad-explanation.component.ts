import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { GamepadControllerService } from '../gamepad-controller.service';
import { GamepadEventService } from '../gamepad-event.service';

@Component({
  selector: 'app-gamepad-explanation',
  templateUrl: './gamepad-explanation.component.html',
  styleUrls: ['./gamepad-explanation.component.scss']
})
export class GamepadExplanationComponent {
  events = {
    section_item: {
      RIGHT_Y: "缩略图",
      LEFT_Y: "缩略图",
    },
    detail_toolabr_item: {
      B: ""
    },
    list_toolabr_item: {
      B: ""
    },
    list_mode_item: {
      B: ""
    },
    list_menu_item: {
      B: ""
    },
    reader_mode_1: {
      LEFT_ANALOG: "切换页",
      RIGHT_ANALOG: "切换页",
      UP: "上一页",
      RIGHT: "下一页",
      DOWN: "下一页",
      LEFT: "上一页",
      X: "更改跨页匹配",
      A: "下一页",
      RIGHT_ANALOG_PRESS: "工具栏",
      LEFT_BUMPER: "缩小",
      RIGHT_BUMPER: "放大",
      LEFT_BUMPER_Y: "缩小100%",
      RIGHT_BUMPER_Y: "放大200%",
      LEFT_TRIGGER: "上一章",
      RIGHT_TRIGGER: "下一章"
    },
    reader_mode_2: {
      LEFT_ANALOG: "滚动",
      RIGHT_ANALOG: "滚动",
      UP: "向上滚动",
      RIGHT: "向下滚动",
      DOWN: "向下滚动",
      LEFT: "向上滚动",
      X: "下一页",
      A: "下一页",
      RIGHT_ANALOG_PRESS: "工具栏",
      LEFT_BUMPER: "",
      RIGHT_BUMPER: "",
      LEFT_BUMPER_Y: "",
      RIGHT_BUMPER_Y: "",
      LEFT_TRIGGER: "上一章",
      RIGHT_TRIGGER: "下一章",
    },
    reader_mode_3: {
      LEFT_ANALOG: "滚动",
      RIGHT_ANALOG: "滚动",
      UP: "向左滚动",
      RIGHT: "向右滚动",
      DOWN: "向右滚动",
      LEFT: "向左滚动",
      X: "下一页",
      A: "下一页",
      RIGHT_ANALOG_PRESS: "工具栏",
      LEFT_BUMPER: "",
      RIGHT_BUMPER: "",
      LEFT_BUMPER_Y: "",
      RIGHT_BUMPER_Y: "",
      LEFT_TRIGGER: "上一章",
      RIGHT_TRIGGER: "下一章",
    },
    reader_mode_4: {
      LEFT_ANALOG: "切换页",
      RIGHT_ANALOG: "切换页",
      UP: "上一页",
      RIGHT: "下一页",
      DOWN: "下一页",
      LEFT: "上一页",
      X: "下一页",
      A: "下一页",
      RIGHT_ANALOG_PRESS: "工具栏",
      LEFT_BUMPER: "缩小",
      RIGHT_BUMPER: "放大",
      LEFT_BUMPER_Y: "缩小100%",
      RIGHT_BUMPER_Y: "放大200%",
      LEFT_TRIGGER: "上一章",
      RIGHT_TRIGGER: "下一章",
    },
    gamepad_toolbar_center: {
      LEFT_ANALOG: "旋转",
      RIGHT_ANALOG: "旋转",
      UP: "上一个",
      RIGHT: "下一个",
      DOWN: "下一个",
      LEFT: "上一个",
      LEFT_BUMPER_Y: "",
      RIGHT_BUMPER_Y: "",
      X: "",
      LEFT_TRIGGER: "切换区域",
      RIGHT_TRIGGER: "切换区域"
    },
    gamepad_toolbar_left: {
      LEFT_TRIGGER: "切换区域",
      RIGHT_TRIGGER: "切换区域"
    },
    gamepad_toolbar_right: {
      LEFT_TRIGGER: "切换区域",
      RIGHT_TRIGGER: "切换区域"
    },
    double_page_thumbnail: {
      LEFT_TRIGGER: "上一章",
      RIGHT_TRIGGER: "下一章",
    },
    gamepad_thumbnail: {
      LEFT_TRIGGER: "上一章",
      RIGHT_TRIGGER: "下一章",
    },
    reader_navbar_bar_buttom_item:{
      LEFT_BUMPER: "上一页",
      RIGHT_BUMPER: "下一页",
      LEFT_TRIGGER: "第一页",
      RIGHT_TRIGGER: "最后一页",
      RIGHT_ANALOG_PRESS: "工具栏",
    }


  };

  EegionBefore$ = null;
  GamepadEventAfter$ = null;
  router$=null;
  constructor(
    public GamepadController: GamepadControllerService,
    public GamepadEvent: GamepadEventService,
    public router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.router$=this.router.events.subscribe((event) => {
      // NavigationEnd,NavigationCancel,NavigationError,RoutesRecognized
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          const node = GamepadController.getCurrentNode();

          const region = node.getAttribute("region");
          if (this.events[region]) {
            if (!node.getAttribute("content_menu_key")) this.gamepad_all.X = ""
            else this.gamepad_all.X = "右键菜单"
            this.gamepad = { ...this.gamepad_all, ...this.events[region] };

          } else {
            if (!node.getAttribute("content_menu_key")) this.gamepad_all.X = ""
            else this.gamepad_all.X = "右键菜单"
            this.gamepad = this.gamepad_all;
          }
        }, 500)
      }
    })
    this.EegionBefore$ = GamepadController.EegionBefore().subscribe((x: any) => {
      setTimeout(() => {
        const node = GamepadController.getCurrentNode();
        const region = node.getAttribute("region");
        if (this.events[region]) {
          if (!node.getAttribute("content_menu_key")) this.gamepad_all.X = ""
          else this.gamepad_all.X = "右键菜单"
          this.gamepad = { ...this.gamepad_all, ...this.events[region] };

        } else {
          if (!node.getAttribute("content_menu_key")) this.gamepad_all.X = ""
          else this.gamepad_all.X = "右键菜单"
          this.gamepad = this.gamepad_all;
        }
      }, 350)

    })

    this.GamepadEventAfter$ = GamepadController.GamepadEventAfter().subscribe((x: any) => {
      const region = x.region;
      const node = x.node;
      const input = x.input;

      if (this.events[region]) {
        if (!node.getAttribute("content_menu_key")) this.gamepad_all.X = ""
        else this.gamepad_all.X = "右键菜单"
        this.gamepad = { ...this.gamepad_all, ...this.events[region] };

      } else {
        if (!node.getAttribute("content_menu_key")) this.gamepad_all.X = ""
        else this.gamepad_all.X = "右键菜单"
        this.gamepad = this.gamepad_all;
      }
      // const message=node.getAttribute("ng-reflect-message");
      // if(message){
      //  if(this.message!=message){
      //   this.message=message;
      //   this._snackBar.open(message, null, { panelClass: "_chapter_prompt", duration: 1500, horizontalPosition: 'start', verticalPosition: 'bottom', });
      //  }
      // }

      if (this.GamepadController.Y) {
        if (this.GamepadEvent.areaEventsY[region]?.[input]) {

        } else if (this.GamepadEvent.globalEventsY[input]) {
        }
      } else {
        if (this.GamepadEvent.areaEvents[region]?.[input]) {

        } else if (this.GamepadEvent.globalEvents[input]) {

        }
      }
    })
  }
  ngOnDestroy() {
    this.EegionBefore$.unsubscribe();
    this.GamepadEventAfter$.unsubscribe();
    this.router$.unsubscribe();
  }
  message = ""
  gamepad = {
    LEFT_ANALOG: "",
    RIGHT_ANALOG: "",
    UP: "",
    RIGHT: "",
    DOWN: "",
    LEFT: "",
    LEFT_ANALOG_PRESS: "",
    RIGHT_ANALOG_PRESS: "",
    A: "",
    B: "",
    X: "",
    Y: "",
    LEFT_TRIGGER: "",
    RIGHT_TRIGGER: "",
    LEFT_BUMPER: "",
    RIGHT_BUMPER: "",
    SELECT: "",
    START: "",
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
    LEFT_BUMPER_Y: "",
    RIGHT_TRIGGER_Y: "",
    RIGHT_BUMPER_Y: "",
    SELECT_Y: "",
    START_Y: "",
    SPECIAL_Y: "",
  }
  gamepad_all = {
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
