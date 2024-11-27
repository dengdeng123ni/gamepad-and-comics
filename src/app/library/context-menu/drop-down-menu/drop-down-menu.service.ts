import { Injectable } from '@angular/core';
import { DropDownMenuComponent } from './drop-down-menu.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class DropDownMenuService {

  opened = false;

  is_close = false;
  list: Array<{
    id: string | number,
    name: string
  }> = [];
  index = null;
  constructor(private _sheet: MatBottomSheet, public GamepadEvent: GamepadEventService) {
    GamepadEvent.registerAreaEvent('drop_down_menu_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('drop_down_menu', {
      region: ['drop_down_menu_item'],
    });
  }

  open(list: Array<any>) {
    this.list = list;
    if (this.opened == false) {
      const sheetRef = this._sheet.open(DropDownMenuComponent, { autoFocus: true});
      document.body.setAttribute("locked_region", "drop_down_menu")
      sheetRef.afterDismissed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "drop_down_menu" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
      this.opened = true;
    }
    return new Promise((r, j) => {
      const _f = () => {
        setTimeout(() => {
          if (!this.opened) {
            r(this.list[this.index])
            this.close();
          } else {
            _f();
          }
        }, 33)
      }
      _f();
    })
  }

  close() {
    this._sheet.dismiss();
  }
}
