import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarOptionComponent } from './toolbar-option.component';

@Injectable({
  providedIn: 'root'
})
export class ToolbarOptionService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
  ) {
  }
  open(data?: any) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ToolbarOptionComponent, {
        panelClass: "_double_page_thumbnail",
        data: data
      });
      document.body.setAttribute("locked_region", "double_page_thumbnail")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "double_page_thumbnail" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }
}
