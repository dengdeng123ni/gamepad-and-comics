import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadThumbnailComponent } from './gamepad-thumbnail.component';
interface DialogData {
  id: number;
  index:number
}
@Injectable({
  providedIn: 'root'
})
export class GamepadThumbnailService {
  opened=false;
  constructor( public _dialog: MatDialog,) { }
  open(data:DialogData) {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(GamepadThumbnailComponent, {
        panelClass: "_gamepad_thumbnail",
        data:data
      });
      document.body.setAttribute("locked_region", "[region=gamepad_thumbnail]")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "[region=gamepad_thumbnail]" && this.opened) document.body.setAttribute("locked_region", "all")
        this.opened = false;
      });
    }
  }
  isToggle = () => {
    if (this.opened) this.close()
  }
  close() {
    this._dialog.closeAll();
  }
}
