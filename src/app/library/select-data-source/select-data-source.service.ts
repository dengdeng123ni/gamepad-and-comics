import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectDataSourceComponent } from './select-data-source.component';

@Injectable({
  providedIn: 'root'
})
export class SelectDataSourceService {
  public opened=false;
  constructor(public _dialog: MatDialog) { }

  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(SelectDataSourceComponent);
      document.body.setAttribute("locked_region","mode")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="mode"&&this.opened) document.body.setAttribute("locked_region","reader")
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
