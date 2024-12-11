import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ReplaceChannelPageComponent } from './replace-channel-page.component';

@Injectable({
  providedIn: 'root'
})
export class ReplaceChannelPageService {


  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public _sheet: MatBottomSheet,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('replace_channel_page_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('replace_channel_page', {
      region: ['replace_channel_page_item'],
    });

    // this.open();

  }


  close = () => {
    this._sheet.dismiss();
  }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const sheetRef = this._sheet.open(ReplaceChannelPageComponent,{
        panelClass:"_replace_channel_page"
      });
      document.body.setAttribute("locked_region", "replace_channel_page")
      sheetRef.afterDismissed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "replace_channel_page" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
  //       const sheetRef = this._sheet.open(PulgJavascriptComponent, { backdropClass: "_replace_channel_page_bg", panelClass: "_replace_channel_page" });
  //       document.body.setAttribute("locked_region", "replace_channel_page")
  //       sheetRef.afterDismissed().subscribe(() => {
  //         if (document.body.getAttribute("locked_region") == "replace_channel_page" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
