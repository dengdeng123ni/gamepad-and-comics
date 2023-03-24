import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from './loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    public _dialog:MatDialog
  ) { }

  opened: boolean = false;

  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(LoadingComponent,{
        panelClass:"_loading",
        backdropClass:"_loading_backdrop",
        disableClose:true
      });
      document.body.setAttribute("locked_region","[region=loading]")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="[locked_region=loading]"&&this.opened) document.body.setAttribute("locked_region","all")
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
