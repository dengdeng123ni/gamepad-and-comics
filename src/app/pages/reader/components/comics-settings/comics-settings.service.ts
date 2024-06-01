import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ComicsSettingsComponent } from './comics-settings.component';

@Injectable({
  providedIn: 'root'
})
export class ComicsSettingsService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('comics_settings_item',{
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('comics_settings_item', {
      region: ['chapter_item'],
    });
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ComicsSettingsComponent, {
        panelClass: "_comics_settings"
      });
      document.body.setAttribute("locked_region", "comics_settings")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "comics_settings" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }


}
