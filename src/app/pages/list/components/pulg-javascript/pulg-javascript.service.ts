import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PulgJavascriptComponent } from './pulg-javascript.component';

@Injectable({
  providedIn: 'root'
})
export class PulgJavascriptService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
  ) {
  }
  open(data?: any) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(PulgJavascriptComponent, {
        panelClass: "_pulg_javascript",
        data: data
      });
      document.body.setAttribute("locked_region", "pulg_javascript")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "pulg_javascript" && this.opened) document.body.setAttribute("locked_region", "reader")
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
