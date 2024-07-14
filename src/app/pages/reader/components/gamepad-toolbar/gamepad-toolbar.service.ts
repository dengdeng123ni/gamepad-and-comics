import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService, GamepadControllerService, GamepadInputService } from 'src/app/library/public-api';
import { GamepadToolbarComponent } from './gamepad-toolbar.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class GamepadToolbarService {
  list = [1, 2, 3, 4, 5, 6, 7, 8];
  current: number = 8;
  record_list = [0, 0, 0]
  up$=null;
  constructor(
    public _dialog: MatDialog,
    private _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public GamepadInput: GamepadInputService,
  ) {

    this.GamepadEvent.registerConfig("gamepad_left_circle_toolbar", { region: ["gamepad_toolbar_left","gamepad_toolbar_right","gamepad_toolbar_center","gamepad_toolbar_menu"] })
  }

  init(){
    this.GamepadEvent.registerAreaEvent("gamepad_toolbar_center", {
      "B": () => this.close(),
      "A": () => {
        this.close();
        (document.querySelector(`[_id=gamepad_toolbar_center_${this.current}]`) as any).click();
        this.record_list = [0, 0, 0];
      },
      "UP": () => {
        this.down("DPAD_UP");
      },
      "DOWN": () => {
        this.down("DPAD_DOWN");
      },
      "LEFT": () => {
        this.down("DPAD_LEFT");
      },
      "RIGHT": () => {
        this.down("DPAD_RIGHT");
      },
      RIGHT_BUMPER: () => {
        this.next();
      },
      LEFT_BUMPER:() => {
        this.previous();
      },
      LEFT_TRIGGER:() => {
        this.GamepadController.setCurrentTargetId("gamepad_toolbar_left_1")
        document.querySelector(".inner-triangle").classList.add("opacity-0")
      },
      RIGHT_TRIGGER:() => {
        this.GamepadController.setCurrentTargetId("gamepad_toolbar_right_1")
        document.querySelector(".inner-triangle").classList.add("opacity-0")
      }
    })
    this.GamepadEvent.registerAreaEvent("gamepad_toolbar_left", {
      "B": () => this.close(),
      "UP": () => {
        this.GamepadController.setCurrentRegionTarget("UP");
      },
      "DOWN": () => {
        this.GamepadController.setCurrentRegionTarget("DOWN");
      },
      "LEFT": () => {
        this.GamepadController.setCurrentRegionTarget("LEFT");
      },
      "RIGHT": () => {
        this.GamepadController.setCurrentRegionTarget("RIGHT");
      },
      LEFT_TRIGGER:() => {
        this.GamepadController.setCurrentTargetId("gamepad_toolbar_right_1")
      },
      RIGHT_TRIGGER:() => {
        document.querySelector(".inner-triangle").classList.remove("opacity-0");
        this.GamepadController.setCurrentTargetId(`gamepad_toolbar_center_${this.current}`)
        const node:any=document.querySelector(".inner-select");
        node.style=`transform:rotate(${45*this.current}deg);`
      }
    })

    this.GamepadEvent.registerAreaEvent("gamepad_toolbar_right", {
      "B": () => this.close(),
      "UP": () => {
        this.GamepadController.setCurrentRegionTarget("UP");
      },
      "DOWN": () => {
        this.GamepadController.setCurrentRegionTarget("DOWN");
      },
      "LEFT": () => {
        this.GamepadController.setCurrentRegionTarget("LEFT");
      },
      "RIGHT": () => {
        this.GamepadController.setCurrentRegionTarget("RIGHT");
      },
      LEFT_TRIGGER:() => {
        document.querySelector(".inner-triangle").classList.remove("opacity-0");
        this.GamepadController.setCurrentTargetId(`gamepad_toolbar_center_${this.current}`)
        const node:any=document.querySelector(".inner-select");
         node.style=`transform:rotate(${45*this.current}deg);`
      },
      RIGHT_TRIGGER:() => {
        this.GamepadController.setCurrentTargetId("gamepad_toolbar_left_1")
      }
    })
    this.up$=this.GamepadInput.up().subscribe(e => {
      if (e == "NO_DIRECTION" && this.opened) {
        if(this.GamepadController.current.region!="gamepad_toolbar_center") return
        if (this.record_list[0] == this.current) {
          this.close();
          (document.querySelector(`[_id=gamepad_toolbar_center_${this.current}]`) as any).click();
          this.record_list = [0, 0, 0];
          this.current=8;
          return
        }
      }
    })
  }

  record(current) {
    if (this.record_list[0] != current) this.record_list[0] = current;
    else if (this.record_list[0] == current) this.record_list[1] = current;
  }
  down(e) {
    let state = this.GamepadInput.getState();
    state[e] = true;
    if (state.LEFT_ANALOG_LEFT || state.LEFT_ANALOG_UP || state.LEFT_ANALOG_RIGHT || state.LEFT_ANALOG_DOWN) {
      let angle = this.GamepadController.getAngle(state.LEFT_ANALOG_HORIZONTAL_AXIS, state.LEFT_ANALOG_VERTICAL_AXIS);
      if (45 >= angle && angle >= 0) this.current =1;
      else if (90 >= angle && angle >= 45) this.current = 2;
      else if (135 >= angle && angle >= 90) this.current = 3;
      else if (180 >= angle && angle >= 135) this.current = 4;
      else if (225 >= angle && angle >= 180) this.current = 5;
      else if (270 >= angle && angle >= 225) this.current = 6;
      else if (315 >= angle && angle >= 270) this.current = 7;
      else if (360 >= angle && angle >= 315) this.current = 8;
      this.record(this.current);
      const node:any=document.querySelector(".inner-select");
      node.style=`transform:rotate(${45*this.current}deg);`
      this.GamepadController.setCurrentTargetId("gamepad_toolbar_center_" + this.current)

    } else if (state.RIGHT_ANALOG_LEFT || state.RIGHT_ANALOG_UP || state.RIGHT_ANALOG_RIGHT || state.RIGHT_ANALOG_DOWN) {
      let angle = this.GamepadController.getAngle(state.RIGHT_ANALOG_HORIZONTAL_AXIS, state.RIGHT_ANALOG_VERTICAL_AXIS);
      if (45 >= angle && angle >= 0) this.current =1;
      else if (90 >= angle && angle >= 45) this.current = 2;
      else if (135 >= angle && angle >= 90) this.current = 3;
      else if (180 >= angle && angle >= 135) this.current = 4;
      else if (225 >= angle && angle >= 180) this.current = 5;
      else if (270 >= angle && angle >= 225) this.current = 6;
      else if (315 >= angle && angle >= 270) this.current = 7;
      else if (360 >= angle && angle >= 315) this.current = 8;
      this.record(this.current);
      const node:any=document.querySelector(".inner-select");
      node.style=`transform:rotate(${45*this.current}deg);`
      this.GamepadController.setCurrentTargetId("gamepad_toolbar_center_" + this.current)
    } else if (state.DPAD_DOWN || state.DPAD_LEFT || state.DPAD_RIGHT || state.DPAD_UP) {
      if (state.DPAD_DOWN && !state.DPAD_LEFT && !state.DPAD_RIGHT && !state.DPAD_UP) this.next()
      else if (!state.DPAD_DOWN && state.DPAD_LEFT && !state.DPAD_RIGHT && !state.DPAD_UP) this.previous();
      else if (!state.DPAD_DOWN && !state.DPAD_LEFT && state.DPAD_RIGHT && !state.DPAD_UP) this.next()
      else if (!state.DPAD_DOWN && !state.DPAD_LEFT && !state.DPAD_RIGHT && state.DPAD_UP) this.previous();
    }
  }


  previous() {
    this.current--;
    if (this.current == 0) this.current = 8;
    const node:any=document.querySelector(".inner-select");
    node.style=`transform:rotate(${45*this.current}deg);`

    this.GamepadController.setCurrentTargetId("gamepad_toolbar_center_" + this.current)
  }
  next() {
    this.current++;
    if (this.current == 9) this.current = 1;
    const node:any=document.querySelector(".inner-select");
    node.style=`transform:rotate(${45*this.current}deg);`

    this.GamepadController.setCurrentTargetId("gamepad_toolbar_center_" + this.current)
  }

  opened: boolean = false;
  region = "";
  open() {
    this._dialog.closeAll();
    this._sheet.dismiss();
if (this.opened == false) {
      this.init();
      this.current=8;
      this.opened = true;
      const dialogRef = this._dialog.open(GamepadToolbarComponent, {
        panelClass: "gamepad_reader_circle_toolbar"
      });
      this.region = document.body.getAttribute("locked_region") ?? "";
      document.body.setAttribute("locked_region", "gamepad_left_circle_toolbar")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "gamepad_left_circle_toolbar" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
      });
    }
  }
  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
  close() {
    this.up$.unsubscribe();
    document.body.setAttribute("locked_region", this.region)
    if (document.body.getAttribute("locked_region") == "gamepad_left_circle_toolbar" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
    this._dialog.closeAll();
    this.opened = false;
    //
  }
}
