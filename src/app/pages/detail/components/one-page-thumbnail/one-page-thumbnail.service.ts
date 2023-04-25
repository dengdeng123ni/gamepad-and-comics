import { Injectable } from '@angular/core';
import { OnePageThumbnailComponent } from './one-page-thumbnail.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class OnePageThumbnailService {

  opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService,
    public GamepadController:GamepadControllerService,

    ) {
      this.GamepadEvent.registerAreaEvent("one_page_thumbnail_toolabr", {
        "B": () => this.close(),
        DOWN:()=>GamepadController.setOtherRegionTarget("DOWN"),
        "A":()=>{
          const node = this.GamepadController.getCurrentNode();
          const type = node.getAttribute("type")
          if (type=='chip' || type=='slide') {
            node.querySelector("button").click();
          }else if(type=='radio'){
            node.querySelector("input").click();
          } else {
            GamepadController.leftKey();
          }
        }

      })
      this.GamepadEvent.registerAreaEvent("one_page_thumbnail_item", {
        "B": () => this.close(),

      })
     }
  open() {
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(OnePageThumbnailComponent, {
        panelClass: "_one_page_thumbnail"
      });
      document.body.setAttribute("locked_region", "[region=one_page_thumbnail_toolabr],[region=one_page_thumbnail_item]")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "[region=one_page_thumbnail_toolabr],[region=one_page_thumbnail_item]" && this.opened) document.body.setAttribute("locked_region", "all")
        this.opened = false;
      });
    }
  }
  isToggle = () => {
    if (this.opened) this.close()
  }
  close() {
    this._dialog.closeAll();
  }
}
