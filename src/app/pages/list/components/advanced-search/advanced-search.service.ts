import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService, GamepadControllerService } from 'src/app/library/public-api';
import { AdvancedSearchComponent } from './advanced-search.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    public _sheet: MatBottomSheet,
    public GamepadController: GamepadControllerService
  ) {
    // GamepadEvent.registerAreaEvent('reader_config_item',{
    //   B:()=>setTimeout(()=>this.close())
    // })
    GamepadEvent.registerConfig('advanced_search', {
      region: ['advanced_search_restart', 'advanced_search_input', 'advanced_search_item','advanced_search_slider'],
    });
  }
  open(data) {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(AdvancedSearchComponent, {
          autoFocus: false,
          panelClass: "_advanced_search",
          data:data
        });
        document.body.setAttribute("locked_region", "advanced_search")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "advanced_search" && this.opened) document.body.setAttribute("locked_region", document.body.getAttribute("router"))
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  close() {
    this._sheet.dismiss();
  }
}
