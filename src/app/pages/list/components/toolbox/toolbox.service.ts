import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ToolboxComponent } from './toolbox.component';

@Injectable({
  providedIn: 'root'
})
export class ToolboxService {

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
      const dialogRef = this._dialog.open(ToolboxComponent,config);
      document.body.setAttribute("locked_region","upload_select")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="upload_select"&&this.opened) document.body.setAttribute("locked_region","list")
        this.opened = false;
      });
      this.opened=true;
    }
  }
  // background: rgba(0,0,0,.8);
  // backdrop-filter: blur(5px);

  // isToggle = () => {
  //   if (this.opened) this.close()
  //   else this.open(0,0);
  // }
  close() {
    this._dialog.closeAll();
  }
}
