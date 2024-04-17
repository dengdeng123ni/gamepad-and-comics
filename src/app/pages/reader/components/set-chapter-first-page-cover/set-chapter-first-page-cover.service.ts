import { Injectable } from '@angular/core';
import { SetChapterFirstPageCoverComponent } from './set-chapter-first-page-cover.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class SetChapterFirstPageCoverService {

  constructor(
    public _dialog: MatDialog
    ) {

  }
  opened: boolean = false;

  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(SetChapterFirstPageCoverComponent,config);
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
