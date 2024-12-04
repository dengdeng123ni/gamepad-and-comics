import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PulgJavascriptComponent } from './pulg-javascript.component';
import { GamepadEventService } from 'src/app/library/public-api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class PulgJavascriptService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public _sheet: MatBottomSheet,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('pulg_javascript_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('pulg_javascript', {
      region: ['pulg_javascript_item'],
    });

    // this.open();s

  }


  close = () => {
    this._sheet.dismiss();
  }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const sheetRef = this._sheet.open(PulgJavascriptComponent,{
        panelClass:"_pulg_javascript"
      });
      document.body.setAttribute("locked_region", "pulg_javascript")
      sheetRef.afterDismissed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "pulg_javascript" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
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
