import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SoundEffectsComponent } from './sound-effects.component';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';

@Injectable({
  providedIn: 'root'
})
export class SoundEffectsService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('sound_effects', {
      region: ['item'],
    });
  }
  open(config:MatDialogConfig) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(SoundEffectsComponent, {
        panelClass: "_controller_settings",
        backdropClass:"_reader_config_bg",
        ...config
      });
      document.body.setAttribute("locked_region", "sound_effects")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "sound_effects" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  close() {
    this._dialog.closeAll();
  }
}
