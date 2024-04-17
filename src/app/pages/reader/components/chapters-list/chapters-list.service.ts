import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChaptersListComponent } from './chapters-list.component';

@Injectable({
  providedIn: 'root'
})
export class ChaptersListService {

  constructor( public _dialog: MatDialog,) { }
  public opened: boolean = false;
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ChaptersListComponent,config);
      document.body.setAttribute("locked_region","chapters_list")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="chapters_list"&&this.opened) document.body.setAttribute("locked_region","reader")
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
