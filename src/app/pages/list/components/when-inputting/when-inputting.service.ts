import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WhenInputtingComponent } from './when-inputting.component';
import { GamepadControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class WhenInputtingService {

  public opened=false;
  public dialogRef
  constructor(
    public _dialog: MatDialog,
    public GamepadController: GamepadControllerService,
  ) {
    this.open();
  }

  open() {
    if (this.opened == false) {
      this.opened = true;

      this.dialogRef = this._dialog.open(WhenInputtingComponent, {
        hasBackdrop:false,
        panelClass: "_when_inputting",
        autoFocus:false,
        disableClose:true,
        delayFocusTrap:false,
        position:{
          right:"12px",
          top:"12px"
        },
        enterAnimationDuration:0
      });
      this.GamepadController.is_when_inputting=true;

      this.dialogRef.afterClosed().subscribe(result => {
        this.opened = false;
        this.GamepadController.is_when_inputting=false;
        this.blur();
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
  blur(){
    let node= document.createElement("input")
    node.style.position= "absolute";
    node.style.left= "1px";
    node.style.top= "1px";
    node.style.opacity="0"
    node.setAttribute("id","input_v10000")
    document.body.appendChild(node);
    (document.querySelector("#input_v10000") as any).focus()
    setTimeout(()=>{
      document.querySelector("#input_v10000").remove();
    },100)
  }
}
