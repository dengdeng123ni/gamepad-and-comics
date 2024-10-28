import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { PlugInInstructionsComponent } from './plug-in-instructions.component';

@Injectable({
  providedIn: 'root'
})
export class PlugInInstructionsService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('plug_in_instructions', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('plug_in_instructions', {
      region: ['item'],
    });
  }
  open(config:MatDialogConfig) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(PlugInInstructionsComponent, {
        panelClass: "_controller_settings",
        ...config
      });
      document.body.setAttribute("locked_region", "plug_in_instructions")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "plug_in_instructions" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  close() {
    this._dialog.closeAll();
  }
}
