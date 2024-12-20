import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { ComicsDetailComponent } from './comics-detail.component';

@Injectable({
  providedIn: 'root'
})
export class ComicsDetailService {
  opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService) {
      GamepadEvent.registerAreaEvent('comics_detail_item', {
        B: () => setTimeout(() => this.close())
      })
      GamepadEvent.registerConfig('comics_detail', {
        region: ['comics_detail_item'],
      });


  }
  open(position?) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ComicsDetailComponent, {
        panelClass: "_comics_detail",
        backdropClass:"_comics_detail_bg",
        position
      });
      document.body.setAttribute("locked_region", "comics_detail")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "comics_detail" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }
  close() {
    this._dialog.closeAll();
  }
}
