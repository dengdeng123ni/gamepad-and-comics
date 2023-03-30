import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent {
  config = {
    isRightAngle: false
  }
  constructor(public i18n: I18nService,) {
    if (localStorage.getItem('angle') == "none") {
      this.config.isRightAngle = true;
    }
  }

  change() {
    if (this.config.isRightAngle) {
      document.body.setAttribute("angle", "none")
      localStorage.setItem('angle', "none")
    } else {
      document.body.setAttribute("angle", "")
      localStorage.removeItem('angle')
    }
  }
}
