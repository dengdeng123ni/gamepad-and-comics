import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { DataService } from '../../services/data.service';
import { ImageToComponent } from './image-to.component';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class ImageToService {

  constructor(
    public _dialog: MatDialog,
    public webDb: NgxIndexedDBService,
    public data: DataService,
    public GamepadEvent:GamepadEventService
  ) {

  }

  public opened: boolean = false;
  open(config?: MatDialogConfig) {
    this.GamepadEvent.registerAreaEvent('dialog', {
      B: () => setTimeout(() => this.close())
    })
    this.GamepadEvent.registerConfig('dialog', {
      region: ['item'],
    });
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ImageToComponent, config);
      document.body.setAttribute("locked_region", "dialog")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "dialog" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
