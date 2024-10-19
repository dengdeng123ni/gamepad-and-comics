import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoublePageThumbnailComponent } from './double-page-thumbnail.component';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';

interface DialogData {
  chapter_id: string;
  page_index?: number
}

@Injectable({
  providedIn: 'root'
})
export class DoublePageThumbnailService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('double_page_thumbnail_item',{
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('double_page_thumbnail_item', {
      region: ['chapter_item'],
    });
  }
  open(data?: DialogData) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(DoublePageThumbnailComponent, {
        panelClass: "_double_page_thumbnail",
        data: data
      });
      document.body.setAttribute("locked_region", "double_page_thumbnail")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "double_page_thumbnail" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }
}
