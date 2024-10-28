import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetKeyboardKeyComponent } from './get-keyboard-key.component';

@Injectable({
  providedIn: 'root'
})
export class GetKeyboardKeyService {


  public opened=false;
  public dialogRef:any;
  handleRegion=""
  constructor(
    public _dialog: MatDialog,
  ) {
    // this.open({})
  }
  open(data?: any) {
    if (this.opened == false) {
      this.opened = true;

      this.handleRegion = document.body.getAttribute('locked_region');
      this.dialogRef = this._dialog.open(GetKeyboardKeyComponent, {
        panelClass: "_get_keyboard_key",
        data: data
      });

      document.body.setAttribute("locked_region", "get_keyboard_key")
      this.dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "get_keyboard_key" && this.opened) {
          document.body.setAttribute('locked_region', this.handleRegion);
        }
        this.opened = false;
      });

    }
  }



  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this.dialogRef.close();
  }


}
