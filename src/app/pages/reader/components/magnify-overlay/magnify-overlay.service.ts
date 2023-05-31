import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { MagnifyOverlayComponent } from './magnify-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class MagnifyOverlayService {

  opened=false;
  constructor( public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
      this.GamepadEvent.registerAreaEvent("square_thumbnail", {
        "B": () => this.close(),

      })

    // this.GamepadEvent.registerConfig("square_thumbnail", { region: ["square_thumbnail"] })
     }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(MagnifyOverlayComponent, {
        panelClass: "_magnify_overlay",
        hasBackdrop:false,
        enterAnimationDuration:0,
        exitAnimationDuration:0
      });
      // document.body.setAttribute("locked_region", "square_thumbnail")
      dialogRef.afterClosed().subscribe(result => {
        // if (document.body.getAttribute("locked_region") == "square_thumbnail" && this.opened) document.body.setAttribute("locked_region", "reader")
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
