import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GamepadEventService } from 'src/app/library/public-api';
import { ThumbnailBottomComponent } from './thumbnail-bottom.component';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailBottomService {

  constructor(
    private _sheet: MatBottomSheet,
    public GamepadEvent:GamepadEventService
  ) {

    this.GamepadEvent.registerConfig("thumbnail_bottom", { region: ["thumbnail_bottom"] })
  }

  opened: boolean = false;

  open() {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(ThumbnailBottomComponent, {backdropClass:"sheet_bg_transparent", panelClass: "_thumbnail_bottom"});
        document.body.setAttribute("locked_region", "thumbnail_bottom")
        sheetRef.afterDismissed().subscribe(() => {
          if(document.body.getAttribute("locked_region")=="thumbnail_bottom"&&this.opened) document.body.setAttribute("locked_region","reader")
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
