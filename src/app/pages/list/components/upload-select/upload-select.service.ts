import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { UploadSelectComponent } from './upload-select.component';

@Injectable({
  providedIn: 'root'
})
export class UploadSelectService {

  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    ) {

      this.GamepadEvent.registerAreaEvent("upload_select", {
        "B": () => this.close(),
      })
      GamepadEvent.registerConfig("upload_select", { region: ["upload_select"] })
      // this.open();
  }

  opened: boolean = false;

  open(config?) {
    if (this.opened == false) {
      const isToolbar=document.body.getAttribute('isfullscreen')=='false'&&document.body.getAttribute('toolbar')=='default'||document.body.getAttribute('toolbar')=='fixed';
      const dialogRef = this._dialog.open(UploadSelectComponent,config);
      document.body.setAttribute("locked_region","upload_select")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="upload_select"&&this.opened) document.body.setAttribute("locked_region","list")
        this.opened = false;
      });
      this.opened=true;
    }
  }
  // isToggle = () => {
  //   if (this.opened) this.close()
  //   else this.open(0,0);
  // }
  close() {
    this._dialog.closeAll();
  }


}
