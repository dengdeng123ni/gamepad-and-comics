import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ReadTimeComponent } from './read-time.component';

@Injectable({
  providedIn: 'root'
})
export class ReadTimeService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
    GamepadEvent.registerAreaEvent("reading_time", {
      "B": () => this.close(),
    })
    GamepadEvent.registerConfig("reading_time", { region: ["reading_time"] })
  }
  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ReadTimeComponent,{
        panelClass:"_reading_time"
      });
      document.body.setAttribute("locked_region","reading_time")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="reading_time"&&this.opened) document.body.setAttribute("locked_region","reader")
        this.opened = false;
      });
      this.opened=true;
    }
  }
  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
  close() {
    this._dialog.closeAll();
  }
}
