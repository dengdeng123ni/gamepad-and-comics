import { Injectable } from '@angular/core';
import { OnePageThumbnailComponent } from './one-page-thumbnail.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class OnePageThumbnailService {

  opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
      this.GamepadEvent.registerAreaEvent("one_page_thumbnail", {
        "B": () => this.close(),

      })
     }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(OnePageThumbnailComponent, {
        panelClass: "_one_page_thumbnail"
      });
      document.body.setAttribute("locked_region", "[region=one_page_thumbnail]")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "[region=one_page_thumbnail]" && this.opened) document.body.setAttribute("locked_region", "all")
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
