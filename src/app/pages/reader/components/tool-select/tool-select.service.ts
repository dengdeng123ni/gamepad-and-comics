import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ToolSelectComponent } from './tool-select.component';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
    GamepadEvent.registerAreaEvent("reader_settings", {
      "B": () => this.close(),
    })

    this.GamepadEvent.registerConfig("reader_settings", { region: ["locked_region"] })
  }
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ToolSelectComponent,config);
      document.body.setAttribute("locked_region","reader_settings")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="reader_settings"&&this.opened) document.body.setAttribute("locked_region","reader")
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
