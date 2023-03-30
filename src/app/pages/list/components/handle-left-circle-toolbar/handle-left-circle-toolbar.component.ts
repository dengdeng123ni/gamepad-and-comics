import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DownloadService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { HandleLeftCircleToolbarService } from './handle-left-circle-toolbar.service';
import { saveAs } from 'file-saver';
import { LanguageSettingsService } from '../language-settings/language-settings.service';
import { SoftwareInformationService } from '../software-information/software-information.service';
import { UploadSelectService } from '../upload-select/upload-select.service';
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
  deleteMenuItemId = null;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public HandleLeftCircleToolbar: HandleLeftCircleToolbarService,
    public GamepadController: GamepadControllerService,
    public GamepadEvent: GamepadEventService,
    public config: ConfigListService,
    public current: CurrentListService,
    public uploadSelect: UploadSelectService,
    public i18n: I18nService,
    public LanguageSettings: LanguageSettingsService,
    public SoftwareInformation: SoftwareInformationService
  ) {
    this.GamepadEvent.registerAreaEvent("handel_toolabr_menu", {
      B: () => {
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


  }

  ngOnInit(): void {
  }

  close() {
  }
  uploadSelectOpen($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (position.y + (position.height / 2)) - (openTargetHeight / 2);
    this.uploadSelect.open({ x, y });
  }
  editIsToggle($event){
    this.config.edit=!this.config.edit;
    this.current.edit$.next(this.config.edit);
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
