import { Component } from '@angular/core';
import { GamepadSoundService } from 'src/app/library/public-api';

@Component({
  selector: 'app-sound-effects',
  templateUrl: './sound-effects.component.html',
  styleUrl: './sound-effects.component.scss'
})
export class SoundEffectsComponent {
  is = false;

  constructor(public GamepadSound: GamepadSoundService) {
    this.is = GamepadSound.opened;
  }

  save() {

  }

  change(e) {
    setTimeout(() => {
      this.GamepadSound.opened = this.is;
      if (!this.is) {
        localStorage.setItem('sound', 'close')
      } else {
        localStorage.removeItem('sound')
      }
    })
  }
}
