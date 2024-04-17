import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GamepadLeftCircleToolbarService } from './gamepad-left-circle-toolbar.service';
import { GamepadControllerService } from 'src/app/library/gamepad/gamepad-controller.service';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { EventService } from '../event.service';
@Component({
  selector: 'app-gamepad-left-circle-toolbar',
  templateUrl: './gamepad-left-circle-toolbar.component.html',
  styleUrls: ['./gamepad-left-circle-toolbar.component.scss']
})
export class GamepadLeftCircleToolbarComponent implements OnInit {
  index = 1;
  isfullscreen = !!document.fullscreenElement;
  menuObj = {
    list: [],
    type: "delete"
  }
  deleteMenuItemId = null;

  list = []

  right=[];
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public GamepadLeftCircleToolbar: GamepadLeftCircleToolbarService,
    public GamepadController: GamepadControllerService,
    public GamepadEvent: GamepadEventService,
    public Event: EventService

  ) {
    this.GamepadEvent.registerAreaEvent("handel_toolabr_menu", {
      B: () => {
        this.menu.closeMenu();
        this.GamepadController.setCurrentTargetId("handel_toolabr_left_delete")
      },
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
      A: () => {
        this.GamepadController.leftKey();
        setTimeout(() => {
          this.GamepadController.setCurrentTargetId("handel_toolabr_left_delete")
        }, 50)
      },
      RIGHT_BUMPER: () => {

      },
      LEFT_BUMPER: () => {
      },
      LEFT_TRIGGER: () => {
      },
      RIGHT_TRIGGER: () => {
      }
    })
    Object.keys(Event.events).forEach(x => {
      if (Event.events[x].shortcut_key&&document.body.getAttribute('router')==Event.events[x].router) {
        if (Event.events[x].shortcut_key.gamepad) {
          if (Event.events[x].shortcut_key.gamepad.position == 'center') {
            this.list.push(Event.events[x])
          }
        }
      }
    })
    this.list.sort((a, b) => a.shortcut_key.gamepad.index - b.shortcut_key.gamepad.index)

    // GamepadEvent.registerHoverEvent("handel_toolabr_menu", {
    //   ENTER: e => {
    //     const id = parseInt(e.getAttribute("id"))
    //     this.deleteMenuItemId = id;
    //   },
    //   LEAVE: e => {
    //     const id = parseInt(e.getAttribute("id"))
    //     this.deleteMenuItemId = null;
    //   }
    // })
  }
  ngOnInit(): void {
  }

  on(index) {
    this.close();
    setTimeout(() => {
      this.list[index].event();
    })
  }
  on2(index){

  }
  close() {
    this.GamepadLeftCircleToolbar.close();
  }
  isFullChange() {
    this.isfullscreen = !this.isfullscreen
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  }


}
