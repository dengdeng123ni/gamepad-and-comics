import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService, GamepadControllerService } from 'src/app/library/public-api';
import { SelectInputNumberComponent } from './select-input-number.component';

@Injectable({
  providedIn: 'root'
})
export class SelectInputNumberService {

  opened = false;

  value=null;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    public _sheet: MatBottomSheet,
    public GamepadController: GamepadControllerService
  ) {
    GamepadEvent.registerAreaEvent('select_input_number_item',{
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('select_input_number', {
      region: ['select_input_number_item'],
    });
  }
  change(data) {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(SelectInputNumberComponent, {
          autoFocus: false,
          panelClass: "_select_input_number",
          data:data
        });
        document.body.setAttribute("locked_region", "select_input_number")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "select_input_number" && this.opened) document.body.setAttribute("locked_region", document.body.getAttribute("router"))
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
            this.close();
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
    this.value=null;
  }
}
