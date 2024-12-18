import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GamepadEventService } from 'src/app/library/public-api';
import { FavoritesPageComponent } from './favorites-page.component';

@Injectable({
  providedIn: 'root'
})
export class FavoritesPageService {

    opened = false;

    is_close = false;
    index = null;
    constructor(
      private _sheet: MatBottomSheet,
      public GamepadEvent: GamepadEventService
    ) {
      GamepadEvent.registerAreaEvent('drop_down_menu_item', {
        B: () => setTimeout(() => this.close())
      })
      GamepadEvent.registerConfig('drop_down_menu', {
        region: ['drop_down_menu_item'],
      });
    }

    open(data?) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(FavoritesPageComponent, { autoFocus: true,data});
        document.body.setAttribute("locked_region", "drop_down_menu")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "drop_down_menu" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
          this.opened = false;
        });
        this.opened = true;
      }
    }

    close() {
      this._sheet.dismiss();
    }
}
