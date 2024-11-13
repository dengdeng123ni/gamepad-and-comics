import { Injectable } from '@angular/core';
import { RepliesPageComponent } from './replies-page.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class RepliesPageService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('double_page_thumbnail_item',{
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('double_page_thumbnail_item', {
      region: ['chapters_item'],
    });
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(RepliesPageComponent);
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
