import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OnePageThumbnailMode3Component } from './one-page-thumbnail-mode3.component';
import { GamepadEventService } from 'src/app/library/public-api';
interface DialogData {
  chapter_id: string;
  page_index: number
}
@Injectable({
  providedIn: 'root'
})
export class OnePageThumbnailMode3Service {

  constructor(private _sheet: MatBottomSheet, public GamepadEvent: GamepadEventService) {
    GamepadEvent.registerAreaEvent('one_page_mode3', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('one_page_mode3', {
      region: ['one_page_thumbnail_mode3'],
    });
  }

  opened: boolean = false;
  open(data?: DialogData) {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(OnePageThumbnailMode3Component, { backdropClass: "sheet_bg_transparent", panelClass: "_side_bottom", data: data });
        document.body.setAttribute("locked_region", "one_page_mode3")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "one_page_mode3" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }

  close() {
    this._sheet.dismiss();
  }
}
