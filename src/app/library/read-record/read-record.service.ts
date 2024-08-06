import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from '../public-api';
import { ReadRecordComponent } from './read-record.component';

@Injectable({
  providedIn: 'root'
})
export class ReadRecordService {

  public opened = false;
  constructor(
    public _dialog: MatDialog,
    private _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('read_record', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('read_record', {
      region: ['read_record_item'],
    });
  }
  open(data?: any) {
    this._dialog.closeAll();
    this._sheet.dismiss();
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ReadRecordComponent, {
        panelClass: "_read_record",
        data: data
      });
      document.body.setAttribute("locked_region", "read_record")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "read_record" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
