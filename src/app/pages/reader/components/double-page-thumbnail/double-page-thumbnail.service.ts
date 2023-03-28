import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailComponent } from './double-page-thumbnail.component';

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
     }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(DoublePageThumbnailComponent, {
        panelClass: "_double_page_thumbnail"
      });
      document.body.setAttribute("locked_region", "[region=double_page_thumbnail]")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "[region=double_page_thumbnail]" && this.opened) document.body.setAttribute("locked_region", "all")
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
