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
    GamepadEvent.registerAreaEvent('one_page_mode1', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('one_page_mode1', {
      region: ['item'],
    });
  }

  open(list: Array<any>) {
    this.list = list;
    if (this.opened == false) {
      const sheetRef = this._sheet.open(DropDownMenuComponent, { autoFocus: true});
      document.body.setAttribute("locked_region", "one_page_mode1")
      sheetRef.afterDismissed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "one_page_mode1" && this.opened) document.body.setAttribute("locked_region", "list")
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
