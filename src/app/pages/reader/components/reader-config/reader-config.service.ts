import { Injectable } from '@angular/core';
import { ReaderConfigComponent } from './reader-config.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';

@Injectable({
  providedIn: 'root'
})
export class ReaderConfigService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('_reader_config_item',{
      B:()=>setTimeout(()=>this.close())
    })
  }
  open(position?) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ReaderConfigComponent, {
        panelClass: "_reader_config",
        backdropClass:"_reader_config_bg",
        position
      });
      document.body.setAttribute("locked_region", "_reader_config")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "_reader_config" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll()
  }
}
