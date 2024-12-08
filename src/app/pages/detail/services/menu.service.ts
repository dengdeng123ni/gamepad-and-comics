import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { IndexdbControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  key = "_gh_menu_detail";
  opened = true;
  mode = 'side';
  position: "start" | "end" = 'start';

  constructor(
    public webDb: IndexdbControllerService,

  ) {

    this.init();
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
      mode: this.mode
    }))
  }

  async get() {
    const res: any = await firstValueFrom(this.webDb.getByKey("data", this.key))
    if (res) {
      this.opened = res.opened;
      this.mode = res.mode;
      this.position = res.position;
    }
  }
}
