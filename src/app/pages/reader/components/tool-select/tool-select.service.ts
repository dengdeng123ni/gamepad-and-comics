import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ToolSelectComponent } from './tool-select.component';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectService {

  opened = false;
  _bool=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
    GamepadEvent.registerAreaEvent("tool_select", {
      "B": () => this.close(),
    })

    this.GamepadEvent.registerConfig("tool_select", { region: ["tool_select"] })
  }
  open(config?:MatDialogConfig) {
    console.log(config.data);

    if(config.data) this._bool=true;
    else this._bool=false;

    if (this.opened == false) {
      const dialogRef = this._dialog.open(ToolSelectComponent,config);
      document.body.setAttribute("locked_region","tool_select")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="tool_select"&&this.opened) document.body.setAttribute("locked_region","reader")
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
