import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { SelectTimeRangeComponent } from './select-time-range.component';

@Injectable({
  providedIn: 'root'
})
export class SelectTimeRangeService {

    public opened = false;
    public value=null;
    constructor(
      public _dialog: MatDialog,
      private _sheet: MatBottomSheet,
      public GamepadEvent: GamepadEventService
    ) {
      GamepadEvent.registerAreaEvent('select_time_range_item', {
        B: () => setTimeout(() => this.close())
      })
      GamepadEvent.registerConfig('select_time_range', {
        region: ['select_time_range_item','select_time_range_button'],
      });
    }

    change(data) {
      if (this.opened == false) {
        if (this.opened == false) {
          const sheetRef = this._sheet.open(SelectTimeRangeComponent, {
            autoFocus: false,
            panelClass: "_select_time_range",
            data:data
          });
          document.body.setAttribute("locked_region", "select_time_range")
          sheetRef.afterDismissed().subscribe(() => {
            if (document.body.getAttribute("locked_region") == "select_time_range" && this.opened) document.body.setAttribute("locked_region", document.body.getAttribute("router"))
            this.opened = false;
          });
        }
        this.opened = true;
      }
      return new Promise((r, j) => {
        const _f = () => {
          setTimeout(() => {
            if (!this.opened) {
              r(this.value)
              this._sheet.dismiss();
            } else {
              _f();
            }
          }, 66)
        }
        _f();
      })
    }


    close() {
      this._sheet.dismiss();
    }
}
