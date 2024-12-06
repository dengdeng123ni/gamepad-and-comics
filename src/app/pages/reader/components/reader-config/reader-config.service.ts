import { Injectable } from '@angular/core';
import { ReaderConfigComponent } from './reader-config.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { GamepadControllerService } from 'src/app/library/public-api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class ReaderConfigService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService,
    public _sheet: MatBottomSheet,
    public GamepadController:GamepadControllerService
  ) {
    GamepadEvent.registerAreaEvent('reader_config_item',{
     "LEFT": e => {
        this.GamepadController.setCurrentTarget("LEFT")
       setTimeout(()=>{
        (document.querySelector("[select=true][region=reader_config_item] button") as any).focus()
       },100)

      },
      "UP": (e) => {
        this.GamepadController.setCurrentTarget("UP")
        setTimeout(()=>{
          (document.querySelector("[select=true][region=reader_config_item] button") as any).focus()
         },100)
      },
      "DOWN": (e) => {
        this.GamepadController.setCurrentTarget("DOWN")
        setTimeout(()=>{
          (document.querySelector("[select=true][region=reader_config_item] button") as any).focus()
         },100)
      },
      "RIGHT": (e) => {
        this.GamepadController.setCurrentTarget("RIGHT")
        setTimeout(()=>{
          (document.querySelector("[select=true][region=reader_config_item] button") as any).focus()
         },100)
      },
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('reader_config', {
      region: ['reader_config_item'],
    });
  }
  open(position?) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ReaderConfigComponent, {
        panelClass: "_reader_config",
        backdropClass:"_reader_config_bg",
        position
      });
      document.body.setAttribute("locked_region", "reader_config")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "reader_config" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll()
  }
  open_bottom_sheet() {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(ReaderConfigComponent, {
          autoFocus: false,
          panelClass: "_reader_config",
        });
        document.body.setAttribute("locked_region", "reader_config")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "reader_config" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  close_bottom_sheet() {
    this._sheet.dismiss();
  }
}
