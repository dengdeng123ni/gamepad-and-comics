import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PulgJavascriptComponent } from './pulg-javascript.component';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class PulgJavascriptService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('pulg_javascript', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('pulg_javascript', {
      region: ['item'],
    });

  }
  open(data?: any) {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(PulgJavascriptComponent, {
        panelClass: "_pulg_javascript",
        data: data
      });
      document.body.setAttribute("locked_region", "pulg_javascript")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "pulg_javascript" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
  // constructor(private _sheet: MatBottomSheet,) { }

  // opened: boolean = false;
  // open() {
  //   if (this.opened == false) {
  //     if (this.opened == false) {
  //       const sheetRef = this._sheet.open(PulgJavascriptComponent, { backdropClass: "_pulg_javascript_bg", panelClass: "_pulg_javascript" });
  //       document.body.setAttribute("locked_region", "pulg_javascript")
  //       sheetRef.afterDismissed().subscribe(() => {
  //         if (document.body.getAttribute("locked_region") == "pulg_javascript" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
  //         this.opened = false;
  //       });
  //     }
  //     this.opened = true;
  //   }
  // }

  // isToggle = () => {
  //   if (this.opened) this.close()
  //   else this.open();
  // }

  // close() {
  //   this._sheet.dismiss();
  // }
}
