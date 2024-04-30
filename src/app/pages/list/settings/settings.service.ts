import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from './settings.component';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
  ) {
  }
  open(data?: any) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(SettingsComponent, {
        panelClass: "_settings",
        data: data
      });
      document.body.setAttribute("locked_region", "settings")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "settings" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }
}
