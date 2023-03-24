import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { UploadListComponent } from './upload-list.component';

@Injectable({
  providedIn: 'root'
})
export class UploadListService {



  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    ) {

      // this.GamepadEvent.registerAreaEvent("upload_list", {
      //   "B": () => this.close(),
      // })
      // this.open();
  }

  opened: boolean = false;

  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(UploadListComponent,{
        panelClass:"upload_list",
        backdropClass:"upload_list_backdrop",
      });
      document.body.setAttribute("locked_region","[region=list_upload_list],[region=list_upload_list_item]")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="[region=list_upload_list],[region=list_upload_list_item]"&&this.opened) document.body.setAttribute("locked_region","all")
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
