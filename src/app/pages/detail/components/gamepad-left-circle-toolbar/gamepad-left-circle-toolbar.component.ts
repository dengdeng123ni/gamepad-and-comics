import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DownloadService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { GamepadLeftCircleToolbarService } from './gamepad-left-circle-toolbar.service';
import { saveAs } from 'file-saver';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';
import { DetailSettingsService } from '../detail-settings/detail-settings.service';
import { ResetReadingProgressService } from '../reset-reading-progress/reset-reading-progress.service';
import { OnePageThumbnailService } from '../one-page-thumbnail/one-page-thumbnail.service';
@Component({
  selector: 'app-gamepad-left-circle-toolbar',
  templateUrl: './gamepad-left-circle-toolbar.component.html',
  styleUrls: ['./gamepad-left-circle-toolbar.component.scss']
})
export class GamepadLeftCircleToolbarComponent implements OnInit {
  index = 1;
  isfullscreen =!!document.fullscreenElement;
  menuObj = {
    list: [],
    type: "delete"
  }
  deleteMenuItemId=null;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public GamepadLeftCircleToolbar: GamepadLeftCircleToolbarService,
    public GamepadController: GamepadControllerService,
    public GamepadEvent:GamepadEventService,
    public config: ConfigDetailService,
    public current: CurrentDetailService,
    public detailSettings:DetailSettingsService,
    public i18n:I18nService,
    public onePageThumbnail:OnePageThumbnailService,
    public resetReadingProgress:ResetReadingProgressService
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
    this.GamepadLeftCircleToolbar.close();
  }

  cursorChange() {
    if (document.body.getAttribute("cursor") == "none") {
      document.body.setAttribute("cursor", "")
    } else {
      document.body.setAttribute("cursor", "none")
    }
    this.GamepadLeftCircleToolbar.close();
  }
  handelClose() {
    document.body.setAttribute("pattern", "")
  }
  openSettings() {
    // readerSettings.open_bottom_sheet({});

    this.detailSettings.open({
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }





}
