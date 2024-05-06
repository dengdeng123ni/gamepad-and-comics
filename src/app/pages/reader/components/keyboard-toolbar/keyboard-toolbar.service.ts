import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KeyboardToolbarComponent } from './keyboard-toolbar.component';
import { GamepadEventService } from 'src/app/library/public-api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class KeyboardToolbarService {


  public opened = false;
  constructor(
    public _dialog: MatDialog,
    private _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('kyboard_toolbar', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('kyboard_toolbar', {
      region: ['kyboard_toolbar_item'],
    });
  }
  open(data?: any) {
    this._dialog.closeAll();
    this._sheet.dismiss();
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(KeyboardToolbarComponent, {
        panelClass: "_kyboard_toolbar",
        data: data
      });
      document.body.setAttribute("locked_region", "kyboard_toolbar")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "kyboard_toolbar" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }
}
