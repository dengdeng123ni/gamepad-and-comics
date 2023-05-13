import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { SoftwareInformationComponent } from './software-information.component';

@Injectable({
  providedIn: 'root'
})
export class SoftwareInformationService {

  constructor(public _dialog:MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
      this.GamepadEvent.registerAreaEvent("software_information", {
        "B": () => this.close(),
      })
      GamepadEvent.registerConfig("software_information",{region:["software_information"]})
   }
  opened=false;
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(SoftwareInformationComponent, config);
      document.body.setAttribute("locked_region", "software_information")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region")=="software_information" && this.opened) document.body.setAttribute("locked_region", "list")
        this.opened = false;
      });
      this.opened = true;
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
