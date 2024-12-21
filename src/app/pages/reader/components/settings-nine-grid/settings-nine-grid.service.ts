import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { SettingsNineGridComponent } from './settings-nine-grid.component';

@Injectable({
  providedIn: 'root'
})
export class SettingsNineGridService {

     opened = false;
     constructor(
       public _dialog: MatDialog,
       public GamepadEvent:GamepadEventService
     ) {
       GamepadEvent.registerAreaEvent('settings_nine_grid_item',{
         B:()=>setTimeout(()=>this.close())
       })
       GamepadEvent.registerConfig('settings_nine_grid', {
         region: ['settings_nine_grid_item'],
       });
      // setTimeout(()=>{
      //   this.open()
      // })
     }
     open() {
       if (this.opened == false) {
         this.opened = true;

         const dialogRef = this._dialog.open(SettingsNineGridComponent, {
           panelClass: "_settings_nine_grid",
         });
         document.body.setAttribute("locked_region", "settings_nine_grid")
         dialogRef.afterClosed().subscribe(result => {
           if (document.body.getAttribute("locked_region") == "settings_nine_grid" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
