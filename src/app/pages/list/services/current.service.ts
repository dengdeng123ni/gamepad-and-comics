import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';
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
    public router: Router,
    public webDb: NgxIndexedDBService,
    public Data: DataService
  ) {
  }

  async routerReader(comics_id) {
    const _res: any = await Promise.all([this.DbController.getDetail(comics_id), await firstValueFrom(this.webDb.getByID("read_comics", comics_id.toString()))])


    if (_res[1]) {
      this.router.navigate(['/', comics_id, _res[1].chapter_id])
    } else {
      this.router.navigate(['/', comics_id, _res[0].chapters[0].id])
    }
  }


  continue() {

  }

}
