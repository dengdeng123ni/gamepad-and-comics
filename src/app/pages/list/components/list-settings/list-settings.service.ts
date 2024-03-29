import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService, GamepadControllerService } from 'src/app/library/public-api';
import { ListSettingsComponent } from './list-settings.component';

@Injectable({
  providedIn: 'root'
})
export class ListSettingsService {

  opened=false;
  constructor(
    public _dialog:MatDialog,
    public GamepadEvent:GamepadEventService,
    public GamepadController:GamepadControllerService

    ) {
      GamepadEvent.registerAreaEvent("list_settings", {
        "B": () => this.close(),
        "A":()=>{
          const node = GamepadController.getCurrentNode();
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
      GamepadEvent.registerConfig("list_settings", { region: ["list_settings"] })
    }

  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ListSettingsComponent,config);
      document.body.setAttribute("locked_region","list_settings")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="list_settings"&&this.opened) document.body.setAttribute("locked_region","list")
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
