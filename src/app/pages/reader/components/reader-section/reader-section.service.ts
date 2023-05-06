import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { HandleLeftCircleToolbarService } from '../handle-left-circle-toolbar/handle-left-circle-toolbar.service';
import { ReaderSectionComponent } from './reader-section.component';

@Injectable({
  providedIn: 'root'
})
export class ReaderSectionService {

  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    public _sheet:MatBottomSheet,
    public HandleLeftCircleToolbar:HandleLeftCircleToolbarService,

  ) {
    GamepadEvent.registerAreaEvent("reader_section", {
      B: () => {
        this.close();
        document.body.setAttribute("locked_region","reader_navbar_bar")
      },
      LEFT_ANALOG_PRESS: () => {
        this.close();
        document.body.setAttribute("locked_region","reader_navbar_bar")
        this.HandleLeftCircleToolbar.isToggle();
      },
    })

    this.GamepadEvent.registerConfig("reader_section", { region: ["reader_section"] })
  }
  public opened: boolean = false;
  open({ x, y }) {
    if (this.opened == false) {
      const isToolbar = document.body.getAttribute('isfullscreen') == 'false' && document.body.getAttribute('toolbar') == 'default' || document.body.getAttribute('toolbar') == 'fixed';
      const dialogRef = this._dialog.open(ReaderSectionComponent, {
        position: {
          bottom: `${y}px`,
          left: `${x}px`
        },
        delayFocusTrap: false,
        panelClass: "upload_select",
        backdropClass: "upload_select_backdrop",
      });
      document.body.setAttribute("locked_region", "reader_section")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "reader_section" && this.opened) document.body.setAttribute("locked_region", "all")
        this.opened = false;
      });
      this.opened = true;
    }
  }
  // isToggle = () => {
  //   if (this.opened) this.close()
  //   else this.open(0,0);
  // }
  close() {
    this._dialog.closeAll();
  }
  open_bottom_sheet() {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(ReaderSectionComponent,{
          autoFocus:false,
          panelClass: "_reader_section_sheet",
        });
        document.body.setAttribute("locked_region", "reader_section")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "reader_section" && this.opened) document.body.setAttribute("locked_region", "all")
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  close_bottom_sheet() {
    this._sheet.dismiss();
  }
}
