import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DataService } from '../../services/data.service';
import { NovelsDownloadComponent } from './novels-download.component';

@Injectable({
  providedIn: 'root'
})
export class NovelsDownloadService {

  constructor(
    public _dialog: MatDialog,
    public webDb: NgxIndexedDBService,
    public data: DataService
  ) {
  }
  public opened: boolean = false;
  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(NovelsDownloadComponent, config);
      document.body.setAttribute("locked_region", "novels_download")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "novels_download" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
      this.opened = true;
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
