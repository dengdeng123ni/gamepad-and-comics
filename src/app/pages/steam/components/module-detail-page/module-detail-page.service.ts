import { Injectable } from '@angular/core';
import { ModuleDetailPageComponent } from './module-detail-page.component';
import { GamepadEventService } from 'src/app/library/public-api';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
interface DialogData {
  chapter_id: string;
  page_index: number
}
@Injectable({
  providedIn: 'root'
})
export class ModuleDetailPageService {
  constructor(private _sheet: MatBottomSheet, public GamepadEvent: GamepadEventService) {
    // this.open();
    GamepadEvent.registerAreaEvent('one_page_thumbnail_mode3', {
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
        const sheetRef = this._sheet.open(ModuleDetailPageComponent, { backdropClass: "sheet_bg_transparent", panelClass: "_side_bottom_12213213", data: data });
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
