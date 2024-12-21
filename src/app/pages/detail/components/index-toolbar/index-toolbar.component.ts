import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-index-toolbar',
  templateUrl: './index-toolbar.component.html',
  styleUrl: './index-toolbar.component.scss'
})
export class IndexToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  is_tablet=false;
  constructor(public menu:MenuService,
    public data:DataService,
    public current:CurrentService


  ){
   this.is_tablet=this.isTablet()
  }
  isTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /ipad|tablet|android(?!.*mobile)/.test(userAgent);
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

  continue() {
    this.current.routerReader(this.data.comics_id, this.data.chapter_id)
  }
}
