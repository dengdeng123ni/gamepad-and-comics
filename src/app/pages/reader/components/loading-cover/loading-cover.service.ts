import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { LoadingCoverComponent } from './loading-cover.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingCoverService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('_loading_cover_item',{
      B:()=>setTimeout(()=>this.close())
    })
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(LoadingCoverComponent, {
        panelClass: "_loading_cover",
        backdropClass:"_loading_cover_bg",
      });
      document.body.setAttribute("locked_region", "_loading_cover")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "_loading_cover" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    let node= document.querySelector("#loading_cover")
    node.setAttribute("type","end")
    this._dialog.closeAll();
    setTimeout(()=>{
    },200)
  }
}
