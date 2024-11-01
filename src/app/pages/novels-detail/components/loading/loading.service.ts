import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from './loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    public _dialog:MatDialog
  ) {
  }

  opened: boolean = false;
  handleRegion: any;
  dialogRef:any;
  open() {
    if (this.opened == false) {
      this.handleRegion = document.body.getAttribute('locked_region') ?? 'all';
      this.dialogRef = this._dialog.open(LoadingComponent,{
        panelClass:"_loading",
        backdropClass:"_loading_backdrop",
        disableClose:true
      });
      document.body.setAttribute("locked_region","loading")
      this.dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="loading") document.body.setAttribute("locked_region","list")
        document.body.setAttribute('locked_region', this.handleRegion);
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
    if (this.opened) this.dialogRef.close();
  }

}
