import { Injectable } from '@angular/core';
import { RepliesPageComponent } from './replies-page.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class RepliesPageService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
     public _sheet: MatBottomSheet,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('double_page_thumbnail_item',{
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('double_page_thumbnail_item', {
      region: ['chapters_item'],
    });
    setTimeout(()=>{
      this.open_bottom_sheet()
    },3000)
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

  open_bottom_sheet() {
      if (this.opened == false) {
        if (this.opened == false) {
          const sheetRef = this._sheet.open(RepliesPageComponent, {
            autoFocus: false,
            // panelClass: "_reader_config",
          });
          document.body.setAttribute("locked_region", "reader_config")
          sheetRef.afterDismissed().subscribe(() => {
            if (document.body.getAttribute("locked_region") == "reader_config" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
            this.opened = false;
          });
        }
        this.opened = true;
      }
    }

    close_bottom_sheet() {
      this._sheet.dismiss();
    }
}
