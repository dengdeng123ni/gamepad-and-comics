import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DownloadService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { HandleLeftCircleToolbarService } from './handle-left-circle-toolbar.service';
import { saveAs } from 'file-saver';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';
@Component({
  selector: 'app-handle-left-circle-toolbar',
  templateUrl: './handle-left-circle-toolbar.component.html',
  styleUrls: ['./handle-left-circle-toolbar.component.scss']
})
export class HandleLeftCircleToolbarComponent implements OnInit {
  index = 1;
  isfullscreen =!!document.fullscreenElement;
  menuObj = {
    list: [],
    type: "delete"
  }
  deleteMenuItemId=null;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public HandleLeftCircleToolbar: HandleLeftCircleToolbarService,
    public GamepadController: GamepadControllerService,
    public GamepadEvent:GamepadEventService,
    public config: ConfigDetailService,
    public current: CurrentDetailService,
    public i18n:I18nService
  ) {
    this.GamepadEvent.registerAreaEvent("handel_toolabr_menu", {
      B:()=>{
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
      A:()=>{
        this.GamepadController.leftKey();
        setTimeout(()=>{
          this.GamepadController.setCurrentTargetId("handel_toolabr_left_delete")
        },50)
      },
      RIGHT_BUMPER: () => {

      },
      LEFT_BUMPER:() => {
      },
      LEFT_TRIGGER:() => {
      },
      RIGHT_TRIGGER:() => {
      }
    })


  }

  ngOnInit(): void {
  }

  editIsToggle(){
    this.config.edit=!this.config.edit;
    this.current.edit$.next(this.config.edit);
  }

  close() {
  }

  back() {
    window.history.back()
  }

  isFullChange(e) {
    this.isfullscreen = !this.isfullscreen;
    if (e == "window") {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    if (e == "full_screen") {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
    this.HandleLeftCircleToolbar.close();
  }

  cursorChange() {
    if (document.body.getAttribute("cursor") == "none") {
      document.body.setAttribute("cursor", "")
    } else {
      document.body.setAttribute("cursor", "none")
    }
    this.HandleLeftCircleToolbar.close();
  }
  handelClose() {
    document.body.setAttribute("pattern", "")
  }






}
