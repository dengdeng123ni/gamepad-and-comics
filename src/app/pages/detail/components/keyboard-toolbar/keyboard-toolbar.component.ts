import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { KeyboardToolbarService } from './keyboard-toolbar.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-keyboard-toolbar',
  templateUrl: './keyboard-toolbar.component.html',
  styleUrl: './keyboard-toolbar.component.scss'
})
export class KeyboardToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  isMobile = (navigator as any).userAgentData.mobile;

  double_page_reader: any = {}
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public KeyboardToolbar:KeyboardToolbarService,
    public menud:MenuService,
  ) {
  }
  close(){
    this.KeyboardToolbar.close();
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
  back() {
    window.history.back()
  }
  openEdit(){
    this.data.is_edit=!this.data.is_edit;
  }
  openMenu(){
    this.menud.isToggle();
  }
}
