import { Injectable } from '@angular/core';
import { fromEvent, fromEventPattern } from 'rxjs';
import { tap } from 'rxjs/operators';

import gameControl from './gamepad/gamecontrol';

@Injectable({
  providedIn: 'root'
})
export class GamepadService {

  private gameControl = gameControl;
  private gamepad: any;

  connect() {
    return fromEvent(this.gameControl, 'connect')
      .pipe(
        tap(gamepad => this.gamepad = gamepad)
      );
  }

  after(event: string) {
    return fromEventPattern(
      handler => this.gamepad.after(event, handler)
    );
  }

  before(event: string) {
    return fromEventPattern(
      handler => this.gamepad.before(event, handler)
    );
  }

  on(event: string) {
    return fromEvent(this.gamepad, event);
  }

  vibrate(value = 0.75, duration = 500) {
    return this.gamepad.vibrate(value, duration)
  }
}
