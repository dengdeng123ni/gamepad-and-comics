import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataService } from '../../services/data.service';
import { DownloadProgressComponent } from './download-progress.component';
import { GamepadEventService, IndexdbControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class DownloadProgressService {

  constructor(
    public _dialog: MatDialog,
    public webDb: IndexdbControllerService,
    public data: DataService,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('download_progress_item', {
      B: () => setTimeout(() => {

      })
    })
    GamepadEvent.registerConfig('download_progress', {
      region: ['download_progress_item'],
    });
  }
  public opened: boolean = false;
  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(DownloadProgressComponent, config);
      document.body.setAttribute("locked_region", "download_progress")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "download_progress" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
