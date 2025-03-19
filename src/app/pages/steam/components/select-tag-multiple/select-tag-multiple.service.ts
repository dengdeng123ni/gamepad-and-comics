import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { SelectTagMultipleComponent } from './select-tag-multiple.component';

@Injectable({
  providedIn: 'root'
})
export class SelectTagMultipleService {

  public opened = false;
  public value=null;
  constructor(
    public _dialog: MatDialog,
    private _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('select_tag_multiple_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('select_tag_multiple', {
      region: ['select_tag_multiple_item','chip_option_v32'],
    });

  }

  change(data) {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(SelectTagMultipleComponent, {
          autoFocus: false,
          panelClass: "_select_tag_multiple",
          data:data
        });
        document.body.setAttribute("locked_region", "select_tag_multiple")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "select_tag_multiple" && this.opened) document.body.setAttribute("locked_region", document.body.getAttribute("router"))
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
