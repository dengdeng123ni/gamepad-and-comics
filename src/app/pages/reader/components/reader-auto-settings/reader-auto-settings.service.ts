import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService, GamepadControllerService } from 'src/app/library/public-api';
import { ReaderAutoSettingsComponent } from './reader-auto-settings.component';

@Injectable({
  providedIn: 'root'
})
export class ReaderAutoSettingsService {

  opened = false;
  constructor(public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService,
    public GamepadController:GamepadControllerService
    ) {
    GamepadEvent.registerAreaEvent("detail_settings", {
      "B": () => this.close(),
      "A":()=>{
        const node = this.GamepadController.getCurrentNode();
        const type = node.getAttribute("type")
        if (type=='chip' || type=='slide') {
          node.querySelector("button").click();
        }else if(type=='radio'){
          node.querySelector("input").click();
        } else {
          GamepadController.leftKey();
        }
      }
    })
    GamepadEvent.registerConfig("detail_settings", { region: ["detail_settings"] })
  }
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ReaderAutoSettingsComponent,config);
      document.body.setAttribute("locked_region","detail_settings")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="detail_settings"&&this.opened) document.body.setAttribute("locked_region","all")
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
}
