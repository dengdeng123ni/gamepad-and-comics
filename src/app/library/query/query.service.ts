import { Injectable } from '@angular/core';
import { QueryComponent } from './query.component';
import { GamepadEventService } from '../gamepad/gamepad-event.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DbEventService, DbControllerService, AppDataService, HistoryService, MessageEventService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService,
    public DbEvent: DbEventService,
    public DbController: DbControllerService,
    public AppData: AppDataService,
    public router: Router,
    public history: HistoryService,
    public MessageEvent:MessageEventService
  ) {

    GamepadEvent.registerAreaEvent('query_mode1_item',{
      B:()=>setTimeout(()=>this.close())
    })
    MessageEvent.other_register('specify_link',e=>{
      this.getComicsId(e.url)
    })
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(QueryComponent, {
        panelClass: "_query_mode1"
      });
      document.body.setAttribute("locked_region", "query_mode1")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "query_mode1" && this.opened) document.body.setAttribute("locked_region", "reader")
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
  async getComicsId(value) {
    const url = new URL(value);
    if (url.protocol.substring(0, 4) == "http") {
      let proxy_hostnames = [];
      const obj = proxy_hostnames.find(x => x.host_name == url.hostname)
      if (!obj) return false
      const arr = url.pathname.split("/")
      const id = arr.at(-1).replace(/[^\d]/g, " ")
      const bool = await this.DbController.getDetail(id, { origin: obj.name })
      if (bool) {
        this.AppData.setOrigin(obj.name)
        // if(this.DbEvent.Configs[obj.name].is_offprint){
        //   this.router.navigate(['/reader', id.toString().trim()]);
        //   this.history.update({ id: id, title: bool.title, cover: bool.cover })
        // }else{
        //   this.router.navigate(['/detail', id.toString().trim()]);
        // }

        return true
      }
    }
    return false
  }
}
