import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { ExportSettingsComponent } from './export-settings.component';

@Injectable({
  providedIn: 'root'
})
export class ExportSettingsService {

  opened = false;

  constructor(public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    public GamepadController:GamepadControllerService
    ) {
    this.GamepadEvent.registerAreaEvent("detail_export_settings_page", {
      "B": () => this.close(),
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
    this.GamepadEvent.registerAreaEvent("detail_export_settings", {
      "B": () => this.close(),
      "A":()=>{
        const node = this.GamepadController.getCurrentNode();
        const type = node.getAttribute("type")
        if (type=='chip' || type=='slide') {
          node.querySelector("button").click();
        }else if(type=='radio'){
          node.querySelector("input").click();
        }
         else {
          GamepadController.leftKey();
        }
      }
    })
    this.GamepadEvent.registerAreaEvent("detail_export_settings_file_type", {
      "B": () => this.close(),
    })
    GamepadEvent.registerConfig("export_settings", { region: ["detail_export_settings_page","detail_export_settings","detail_export_settings_file_type"] })
  }
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ExportSettingsComponent,config);
      document.body.setAttribute("locked_region","export_settings")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="export_settings"&&this.opened) document.body.setAttribute("locked_region","all")
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
