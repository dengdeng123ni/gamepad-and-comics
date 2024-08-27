import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { FilterComponent } from 'src/app/pages/reader/components/filter/filter.component';
import { DataService } from '../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ImageToService {

  filter = null;
  constructor(
    public _dialog: MatDialog,
    public webDb: NgxIndexedDBService,
    public data: DataService
  ) {
  }
  public opened: boolean = false;
  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(FilterComponent, config);
      document.body.setAttribute("locked_region", "image_to")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "image_to" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
