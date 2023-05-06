import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { SquareThumbnailComponent } from './square-thumbnail.component';

@Injectable({
  providedIn: 'root'
})
export class SquareThumbnailService {

  opened=false;
  constructor( public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
      this.GamepadEvent.registerAreaEvent("square_thumbnail", {
        "B": () => this.close(),

      })

    this.GamepadEvent.registerConfig("square_thumbnail", { region: ["square_thumbnail"] })
     }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(SquareThumbnailComponent, {
        panelClass: "_square_thumbnail"
      });
      document.body.setAttribute("locked_region", "square_thumbnail")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "square_thumbnail" && this.opened) document.body.setAttribute("locked_region", "all")
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
