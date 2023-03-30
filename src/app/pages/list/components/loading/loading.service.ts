import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { LoadingComponent } from './loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    public _dialog:MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent("locked_region",{
      UP:()=>{},
      RIGHT:()=>{},
      DOWN:()=>{},
      LEFT:()=>{},
      LEFT_ANALOG_PRESS:()=>{},
      RIGHT_ANALOG_PRESS:()=>{},
      A:()=>{},
      B:()=>{},
      X:()=>{},
      Y:()=>{},
      LEFT_TRIGGER:()=>{},
      LEFT_BUMPER:()=>{},
      RIGHT_TRIGGER:()=>{},
      RIGHT_BUMPER:()=>{},
      SELECT:()=>{},
      START:()=>{},
      SPECIAL:()=>{},
    })
    GamepadEvent.registerAreaEventY("locked_region",{
      UP:()=>{},
      RIGHT:()=>{},
      DOWN:()=>{},
      LEFT:()=>{},
      LEFT_ANALOG_PRESS:()=>{},
      RIGHT_ANALOG_PRESS:()=>{},
      A:()=>{},
      B:()=>{},
      X:()=>{},
      Y:()=>{},
      LEFT_TRIGGER:()=>{},
      LEFT_BUMPER:()=>{},
      RIGHT_TRIGGER:()=>{},
      RIGHT_BUMPER:()=>{},
      SELECT:()=>{},
      START:()=>{},
      SPECIAL:()=>{},
    })
  }

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
        if(document.body.getAttribute("locked_region")=="[region=loading]") document.body.setAttribute("locked_region","all")
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
