import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService, RoutingControllerService } from 'src/app/library/public-api';
import { Subject, firstValueFrom } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  constructor(
    public DbController: DbControllerService,
    public RoutingController:RoutingControllerService,
    public router: Router,
    public webDb: NgxIndexedDBService,
    public data: DataService
  ) {
  }
  public updateMenu$ = new Subject<string>();

  public updateMenu() {
    return this.updateMenu$
  }
  async routerReader(source,comics_id) {
    this.data.currend_read_comics_id=comics_id;
    this.RoutingController.routerReader(source,comics_id)
  }


  async routerDetail(source,comics_id) {
    this.data.currend_read_comics_id=comics_id;
    this.RoutingController.routerDetail(source,comics_id)
  }

  async routerSourceSearch(source,keywords) {

    this.router.navigate(['/search', source, keywords]);
  }

  async _updateMenu(){
     this.updateMenu$.next("update")
  }



  continue() {

  }

}
