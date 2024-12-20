import { Injectable } from '@angular/core';
import { AboutSoftwareComponent } from './about-software.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class AboutSoftwareService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('about_software_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('about_software', {
      region: ['about_software_item'],
    });
    // this.open()
  }
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(AboutSoftwareComponent, {
        panelClass: "_controller_settings",
        ...config
      });
      document.body.setAttribute("locked_region", "about_software")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "about_software" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  close() {
    this._dialog.closeAll();
  }
}
