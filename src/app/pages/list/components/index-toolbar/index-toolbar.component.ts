import { Component } from '@angular/core';
import { MenuService } from '../menu/menu.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-index-toolbar',
  templateUrl: './index-toolbar.component.html',
  styleUrl: './index-toolbar.component.scss'
})
export class IndexToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  opened=false;
  constructor(public menu:MenuService,public data:DataService){

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

  on(){
    this.menu.opened=!this.menu.opened;
  }
  on1(){
    this.data.is_edit=!this.data.is_edit;
  }
}
