import { Component } from '@angular/core';

@Component({
  selector: 'app-index-toolbar',
  templateUrl: './index-toolbar.component.html',
  styleUrl: './index-toolbar.component.scss'
})
export class IndexToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
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
