import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenuSearchComponent } from './menu-search.component';

@Injectable({
  providedIn: 'root'
})
export class MenuSearchService {


  public opened=false;
  constructor(
    public _dialog: MatDialog,
  ) {
  }
  open(config:MatDialogConfig) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(MenuSearchComponent, {
        panelClass: "_controller_settings",
        backdropClass:"_reader_config_bg",
        ...config
      });
      document.body.setAttribute("locked_region", "controller_settings")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "controller_settings" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  close() {
    this._dialog.closeAll();
  }

}
