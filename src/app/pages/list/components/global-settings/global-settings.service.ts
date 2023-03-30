import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalSettingsComponent } from './global-settings.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {
  opened=false;
  constructor(public _dialog:MatDialog) { }
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
