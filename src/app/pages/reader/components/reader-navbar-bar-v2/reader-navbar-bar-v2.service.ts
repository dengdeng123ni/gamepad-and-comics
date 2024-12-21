import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ReaderNavbarBarV2Component } from './reader-navbar-bar-v2.component';

@Injectable({
  providedIn: 'root'
})
export class ReaderNavbarBarV2Service {

   opened = false;
   constructor(
     public _dialog: MatDialog,
     public GamepadEvent:GamepadEventService
   ) {
     GamepadEvent.registerAreaEvent('reader_navbar_bar_v2_item',{
       B:()=>setTimeout(()=>this.close())
     })
     GamepadEvent.registerConfig('reader_navbar_bar_v2', {
       region: ['reader_navbar_bar_v2_item'],
     });
    // setTimeout(()=>{
    //   this.open()
    // })
   }
   open() {
     if (this.opened == false) {
       this.opened = true;

       const dialogRef = this._dialog.open(ReaderNavbarBarV2Component, {
         panelClass: "_reader_navbar_bar_v2",
         hasBackdrop:false
       });
       document.body.setAttribute("locked_region", "reader_navbar_bar_v2")
       dialogRef.afterClosed().subscribe(result => {
         if (document.body.getAttribute("locked_region") == "reader_navbar_bar_v2" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
