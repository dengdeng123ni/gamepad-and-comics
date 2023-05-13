import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailComponent } from './double-page-thumbnail.component';
interface DialogData {
  id: number;
  index:number
}
@Injectable({
  providedIn: 'root'
})
export class DoublePageThumbnailService {

  opened=false;
  constructor( public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
      this.GamepadEvent.registerAreaEvent("double_page_thumbnail", {
        "B": () => this.close(),

      })

    this.GamepadEvent.registerConfig("double_page_thumbnail", { region: ["double_page_thumbnail"] })
     }
  open(data:DialogData) {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(DoublePageThumbnailComponent, {
        panelClass: "_double_page_thumbnail",
        data:data
      });
      document.body.setAttribute("locked_region", "double_page_thumbnail")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "double_page_thumbnail" && this.opened) document.body.setAttribute("locked_region", "reader")
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
