import { Injectable } from '@angular/core';
import { ThumbnailSelectComponent } from './thumbnail-select.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailSelectService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
    GamepadEvent.registerAreaEvent("thumbnail_select", {
      "B": () => this.close(),
    })

    this.GamepadEvent.registerConfig("thumbnail_select", { region: ["thumbnail_select"] })
  }
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ThumbnailSelectComponent,config);
      document.body.setAttribute("locked_region","thumbnail_select")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="thumbnail_select"&&this.opened) document.body.setAttribute("locked_region","reader")
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
