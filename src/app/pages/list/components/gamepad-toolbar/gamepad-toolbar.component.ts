import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { GamepadToolbarService } from './gamepad-toolbar.service';

@Component({
  selector: 'app-gamepad-toolbar',
  templateUrl: './gamepad-toolbar.component.html',
  styleUrl: './gamepad-toolbar.component.scss'
})
export class GamepadToolbarComponent {

  isfullscreen = !!document.fullscreenElement;
  isMobile = navigator?.userAgentData?.mobile;

  double_page_reader: any = {}
  constructor(
    public current: CurrentService,
    public data: DataService,
    public GamepadToolbar:GamepadToolbarService
  ) {
  }
  close(){
    this.GamepadToolbar.close();
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
