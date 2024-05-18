import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingControllerService {

  constructor(
    public webDb: NgxIndexedDBService,
    public router: Router,

  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        let arr = event.url.split("/");
        arr.shift()
        this.add({
          commands: arr
        })
      }
    })
  }


  async add(option: {
    commands: Array<string>
  }) {
    let page = null;
    if (option.commands[0] == "query"||option.commands[0] == "search") page = "list"
    else if (option.commands[0] == "detail") page = "detail"
    else page = "reader"
    await firstValueFrom(this.webDb.update('router', {
      id: new Date().getTime(),
      page,
      ...option
    }))
  }

  async navigate(page) {
    const list:any = await firstValueFrom(this.webDb.getAll('router'))
    const arr=list.filter(x=>x.page==page)
    const obj=arr.at(-1)
    if (obj) {
      this.router.navigate(obj.commands)
    }
  }
}
