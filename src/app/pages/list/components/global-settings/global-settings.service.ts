import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { GlobalSettingsComponent } from './global-settings.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {
  opened=false;
  constructor(public _dialog:MatDialog,
    public GamepadEvent:GamepadEventService,
    public GamepadController:GamepadControllerService

    ) {
      GamepadEvent.registerAreaEvent("global_settings", {
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
    }

  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(GlobalSettingsComponent,config);
      document.body.setAttribute("locked_region","[region=global_settings]")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="[region=global_settings]"&&this.opened) document.body.setAttribute("locked_region","all")
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
