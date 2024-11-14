import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  key = "_gh_menu";
  opened = true;
  mode = 'side';
  position: "start" | "end" = 'start';
  current_menu_id=null;
  current_menu_pid=null;
  mode_1=1;


  constructor(public data: DataService,
    public webDb: NgxIndexedDBService,
  ) {


  }

  async init() {

    await this.get();
  }

  open() {
    if (!this.opened) this.opened = true;
  }
  isToggle() {
    this.opened = !this.opened;
  }
  close() {
    if (this.opened) this.opened = false;
  }

  async post() {
    return await firstValueFrom(this.webDb.update("data", {
      id: this.key,
      opened: this.opened,
      mode: this.mode,
      mode_1:this.mode_1,
      current_menu_id:this.current_menu_id,
      current_menu_pid:this.current_menu_pid
    }))
  }

  async get() {
    const res: any = await firstValueFrom(this.webDb.getByKey("data", this.key))
    if (res) {
      this.opened = res.opened;
      this.mode = res.mode;
      this.position = res.position;
      this.mode_1=res.mode_1??1;
      if(!this.current_menu_id)  this.current_menu_id=res.current_menu_id;
      if(!this.current_menu_pid)  this.current_menu_pid=res.current_menu_pid;

    }
  }
}
