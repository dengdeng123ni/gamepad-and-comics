import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReaderChangeComponent } from './reader-change.component';

@Injectable({
  providedIn: 'root'
})
export class ReaderChangeService {

  constructor(
    public _dialog: MatDialog
    ) {

  }
  opened: boolean = false;

  open(position?:any,panelClass?:string) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ReaderChangeComponent,{
        position:position,
        delayFocusTrap:false,
        panelClass: panelClass
      });
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
