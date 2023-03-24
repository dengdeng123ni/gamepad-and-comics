import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ReaderSettingsComponent } from './reader-settings.component';

@Injectable({
  providedIn: 'root'
})
export class ReaderSettingsService {

  opened = false;
  constructor(public _dialog: MatDialog,
    public _sheet:MatBottomSheet,
    public GamepadEvent:GamepadEventService
    ) {
    GamepadEvent.registerAreaEvent("reader_settings", {
      "B": () => this.close(),
    })
  }
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ReaderSettingsComponent,config);
      document.body.setAttribute("locked_region","[region=reader_settings]")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="[region=reader_settings]"&&this.opened) document.body.setAttribute("locked_region","all")
        this.opened = false;
      });
      this.opened=true;
    }
  }
  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
  close() {
    this._dialog.closeAll();
  }

  open_bottom_sheet(config:MatBottomSheetConfig) {
    if (this.opened == false) {
      // const images = this.current.images.list;
      // this.list=Object.keys(images).map(x=>({id:x,total:images[x].length,image:images[x][0].image}))
      if (this.opened == false) {
        const sheetRef = this._sheet.open(ReaderSettingsComponent,config);
        document.body.setAttribute("locked_region", "[region=reader_settings]")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "[region=reader_settings]" && this.opened) document.body.setAttribute("locked_region", "all")
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  isToggle_bottom_sheet = () => {
    if (this.opened) this.close()
    else this.open();
  }

  close_bottom_sheet() {
    this._sheet.dismiss();
  }
}
