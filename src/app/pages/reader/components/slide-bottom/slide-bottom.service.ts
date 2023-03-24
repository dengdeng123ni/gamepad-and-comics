
import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GamepadEventService } from 'src/app/library/public-api';
import { SlideBottomComponent } from './slide-bottom.component';
@Injectable({
  providedIn: 'root'
})
export class SlideBottomService {

  constructor(private _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService,
  ) {
    this.GamepadEvent.registerAreaEvent("thumbnail_sidebar_bottom", {
      "B": () => this.close(),
    })
  }
  opened: boolean = false;
  open() {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(SlideBottomComponent, {backdropClass:"sheet_bg_transparent",panelClass: "_side_bottom"});
        document.body.setAttribute("locked_region", "[region=thumbnail_sidebar_bottom]")
        sheetRef.afterDismissed().subscribe(() => {
          if(document.body.getAttribute("locked_region")=="[region=thumbnail_sidebar_bottom]"&&this.opened) document.body.setAttribute("locked_region","all")
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
