import { Component } from '@angular/core';
import { GamepadSoundService, I18nService } from 'src/app/library/public-api';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent {
  config = {
    isRightAngle: false
  }
  constructor(
    public i18n: I18nService,
    public GamepadSound:GamepadSoundService
    ) {
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

  soundChange() {
    if (this.GamepadSound.opened) {
      localStorage.setItem('sound', "close")
    } else {
      localStorage.setItem('sound', "open")
    }
  }
}
