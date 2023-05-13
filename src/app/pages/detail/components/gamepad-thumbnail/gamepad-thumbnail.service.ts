import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadThumbnailComponent } from './gamepad-thumbnail.component';
import { GamepadEventService } from 'src/app/library/public-api';
interface DialogData {
  id: number;
  index:number
}
@Injectable({
  providedIn: 'root'
})
export class GamepadThumbnailService {
  opened=false;
  constructor( public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService,
    ) {

      this.GamepadEvent.registerConfig("gamepad_thumbnail", { region: ["gamepad_thumbnail"] })
   }
  open(data:DialogData) {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(GamepadThumbnailComponent, {
        panelClass: "_gamepad_thumbnail",
        data:data
      });
      document.body.setAttribute("locked_region", "gamepad_thumbnail")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "gamepad_thumbnail" && this.opened) document.body.setAttribute("locked_region", "detail")
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
