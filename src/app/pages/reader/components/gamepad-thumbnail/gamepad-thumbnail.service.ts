import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadThumbnailComponent } from './gamepad-thumbnail.component';

@Injectable({
  providedIn: 'root'
})
export class GamepadThumbnailService {
  opened=false;
  constructor( public _dialog: MatDialog,) { }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(GamepadThumbnailComponent, {
        panelClass: "_gamepad_thumbnail"
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
    else this.open();
  }
  close() {
    this._dialog.closeAll();
  }
}
