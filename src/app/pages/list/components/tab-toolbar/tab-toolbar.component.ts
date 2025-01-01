import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { MenuService } from '../menu/menu.service';
import { TabToolbarService } from './tab-toolbar.service';
import { TabService } from 'src/app/library/tab.service';

@Component({
  selector: 'app-tab-toolbar',
  templateUrl: './tab-toolbar.component.html',
  styleUrl: './tab-toolbar.component.scss'
})
export class TabToolbarComponent {

  isfullscreen = !!document.fullscreenElement;
  isMobile = navigator?.userAgentData?.mobile;

  double_page_reader: any = {}
  constructor(
    public current: CurrentService,
    public data: DataService,
    public menu1: MenuService,
    public TabToolbar: TabToolbarService,
    public tab: TabService
  ) {
  }
  close() {
    this.TabToolbar.close();
  }
  setPrevious_5() {
    setTimeout(() => this.tab.setPrevious_5(), 500)
  }
  setPrevious_first() {
    setTimeout(() => this.tab.setPrevious_first(), 500)
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
