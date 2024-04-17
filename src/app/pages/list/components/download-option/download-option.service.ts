import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadOptionComponent } from './download-option.component';

@Injectable({
  providedIn: 'root'
})
export class DownloadOptionService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
  ) {
  }
  open(data) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(DownloadOptionComponent, {
        panelClass: "_download_option",
        data:data
      });
      document.body.setAttribute("locked_region", "download_option")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "download_option" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open([])
  }
  close() {
    this._dialog.closeAll();
  }
}
