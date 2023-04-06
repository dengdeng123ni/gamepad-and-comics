import { Injectable, NgZone } from '@angular/core';
import { ResponsiveGamepad } from './responsive-Gamepad/index';
import { bufferCount, Subject } from 'rxjs';
import { GamepadService } from './lib/ngx-gamepad.service';

ResponsiveGamepad.enable();

@Injectable({
  providedIn: 'root',
})
export class GamepadInputService {
  public down$ = new Subject<string>();
  public press$ = new Subject<string>();
  public up$ = new Subject<string>();

  isDown: string | null = null;
  isPress: any = null;

  changeMove(move: string) {
    if (this.isDown !== move) {
      if (this.isDown) {
        clearInterval(this.isPress);
        this.isPress = null;
      }
      this.isDown = move;
      this.down$.next(move);
    } else {
      if (!this.isPress) {
        this.isPress = setInterval(() => {
          if (this.isDown === move) {
            this.press$.next(move);
          }
        }, 150);
      }
    }
  }

  constructor(public Gamepad: GamepadService, private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        const gamepadState = ResponsiveGamepad.getState();
        const state: any = {};
        for (const [key, value] of Object.entries(gamepadState)) {
          if (value === true) {
            state[key] = value;
          }
        }
        if (state.UP) {
          this.changeMove('UP');
        } else if (state.DOWN) {
          this.changeMove('DOWN');
        } else if (state.LEFT) {
          this.changeMove('LEFT');
        } else if (state.RIGHT) {
          this.changeMove('RIGHT');
        } else {
          if (this.isPress) {
            this.up$.next('NO_DIRECTION');
            clearInterval(this.isPress);
          }
          this.isDown = null;
          this.isPress = null;
        }
      }, 50);
    });

    this.Gamepad.connect().subscribe(() => {
      // this.Gamepad.before('up0').subscribe(() => { this.down$.next("LEFT_ANALOG_UP") });
      // this.Gamepad.before('down0').subscribe(() => { this.down$.next("LEFT_ANALOG_DOWN") });
      // this.Gamepad.before('right0').subscribe(() => { this.down$.next("LEFT_ANALOG_RIGHT") });
      // this.Gamepad.before('left0').subscribe(() => { this.down$.next("LEFT_ANALOG_LEFT") });

      // this.Gamepad.before('up1').subscribe(() => { this.down$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.before('down1').subscribe(() => { this.down$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.before('right1').subscribe(() => { this.down$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.before('left1').subscribe(() => { this.down$.next("RIGHT_ANALOG_UP") });

      this.Gamepad.before('button0').subscribe(() => { this.down$.next("A") });
      this.Gamepad.before('button1').subscribe(() => { this.down$.next("B") });
      this.Gamepad.before('button2').subscribe(() => { this.down$.next("X") });
      this.Gamepad.before('button3').subscribe(() => { this.down$.next("Y") });

      this.Gamepad.before('button4').subscribe(() => { this.down$.next("LEFT_TRIGGER") });
      this.Gamepad.before('button5').subscribe(() => { this.down$.next("RIGHT_TRIGGER") });
      this.Gamepad.before('button6').subscribe(() => { this.down$.next("LEFT_BUMPER") });
      this.Gamepad.before('button7').subscribe(() => { this.down$.next("RIGHT_BUMPER") });

      this.Gamepad.before('button8').subscribe(() => { this.down$.next("SELECT") });
      this.Gamepad.before('button9').subscribe(() => { this.down$.next("START") });

      this.Gamepad.before('button10').subscribe(() => { this.down$.next("LEFT_ANALOG_PRESS") });
      this.Gamepad.before('button11').subscribe(() => { this.down$.next("RIGHT_ANALOG_PRESS") });

      // this.Gamepad.before('button12').subscribe(() => { this.down$.next("DPAD_UP") });
      // this.Gamepad.before('button13').subscribe(() => { this.down$.next("DPAD_DOWN") });
      // this.Gamepad.before('button14').subscribe(() => { this.down$.next("DPAD_LEFT") });
      // this.Gamepad.before('button15').subscribe(() => { this.down$.next("DPAD_RIGHT") });

      this.Gamepad.before('button16').subscribe(() => { this.down$.next("CENTER") });

      // this.Gamepad.after('up0').subscribe(() => { this.up$.next("LEFT_ANALOG_UP") });
      // this.Gamepad.after('down0').subscribe(() => { this.up$.next("LEFT_ANALOG_DOWN") });
      // this.Gamepad.after('right0').subscribe(() => { this.up$.next("LEFT_ANALOG_RIGHT") });
      // this.Gamepad.after('left0').subscribe(() => { this.up$.next("LEFT_ANALOG_LEFT") });

      // this.Gamepad.after('up1').subscribe(() => { this.up$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.after('down1').subscribe(() => { this.up$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.after('right1').subscribe(() => { this.up$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.after('left1').subscribe(() => { this.up$.next("RIGHT_ANALOG_UP") });

      this.Gamepad.after('button0').subscribe(() => { this.up$.next("A") });
      this.Gamepad.after('button1').subscribe(() => { this.up$.next("B") });
      this.Gamepad.after('button2').subscribe(() => { this.up$.next("X") });
      this.Gamepad.after('button3').subscribe(() => { this.up$.next("Y") });

      this.Gamepad.after('button4').subscribe(() => { this.up$.next("LEFT_TRIGGER") });
      this.Gamepad.after('button5').subscribe(() => { this.up$.next("RIGHT_TRIGGER") });
      this.Gamepad.after('button6').subscribe(() => { this.up$.next("LEFT_BUMPER") });
      this.Gamepad.after('button7').subscribe(() => { this.up$.next("RIGHT_BUMPER") });

      this.Gamepad.after('button8').subscribe(() => { this.up$.next("SELECT") });
      this.Gamepad.after('button9').subscribe(() => { this.up$.next("START") });

      this.Gamepad.after('button10').subscribe(() => { this.up$.next("LEFT_ANALOG_PRESS") });
      this.Gamepad.after('button11').subscribe(() => { this.up$.next("RIGHT_ANALOG_PRESS") });

      // this.Gamepad.after('button12').subscribe(() => { this.up$.next("DPAD_UP") });
      // this.Gamepad.after('button13').subscribe(() => { this.up$.next("DPAD_DOWN") });
      // this.Gamepad.after('button14').subscribe(() => { this.up$.next("DPAD_LEFT") });
      // this.Gamepad.after('button15').subscribe(() => { this.up$.next("DPAD_RIGHT") });

      this.Gamepad.after('button16').subscribe(() => { this.up$.next("CENTER") });


      // this.Gamepad.on('up0').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_ANALOG_UP") });
      // this.Gamepad.on('down0').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_ANALOG_DOWN") });
      // this.Gamepad.on('right0').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_ANALOG_RIGHT") });
      // this.Gamepad.on('left0').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_ANALOG_LEFT") });

      // this.Gamepad.on('up1').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.on('down1').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.on('right1').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_ANALOG_UP") });
      // this.Gamepad.on('left1').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_ANALOG_UP") });

      this.Gamepad.on('button0').pipe(bufferCount(2)).subscribe(() => { this.press$.next("A") });
      this.Gamepad.on('button1').pipe(bufferCount(2)).subscribe(() => { this.press$.next("B") });
      this.Gamepad.on('button2').pipe(bufferCount(2)).subscribe(() => { this.press$.next("X") });
      this.Gamepad.on('button3').pipe(bufferCount(2)).subscribe(() => { this.press$.next("Y") });

      this.Gamepad.on('button4').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_TRIGGER") });
      this.Gamepad.on('button5').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_TRIGGER") });
      this.Gamepad.on('button6').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_BUMPER") });
      this.Gamepad.on('button7').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_BUMPER") });

      this.Gamepad.on('button8').pipe(bufferCount(2)).subscribe(() => { this.press$.next("SELECT") });
      this.Gamepad.on('button9').pipe(bufferCount(2)).subscribe(() => { this.press$.next("START") });

      this.Gamepad.on('button10').pipe(bufferCount(2)).subscribe(() => { this.press$.next("LEFT_ANALOG_PRESS") });
      this.Gamepad.on('button11').pipe(bufferCount(2)).subscribe(() => { this.press$.next("RIGHT_ANALOG_PRESS") });

      // this.Gamepad.on('button12').pipe(bufferCount(2)).subscribe(() => { this.press$.next("DPAD_UP") });
      // this.Gamepad.on('button13').pipe(bufferCount(2)).subscribe(() => { this.press$.next("DPAD_DOWN") });
      // this.Gamepad.on('button14').pipe(bufferCount(2)).subscribe(() => { this.press$.next("DPAD_LEFT") });
      // this.Gamepad.on('button15').pipe(bufferCount(2)).subscribe(() => { this.press$.next("DPAD_RIGHT") });

      this.Gamepad.on('button16').pipe(bufferCount(2)).subscribe(() => { this.press$.next("CENTER") });

    });
  }

  down() {
    return this.down$;
  }

  press() {
    return this.press$;
  }

  up() {
    return this.up$;
  }
  getState(){
    return ResponsiveGamepad.getState()
  }

  vibrate(value = 0.75, duration = 500) {
    return this.Gamepad.vibrate(value, duration)
  }
}
