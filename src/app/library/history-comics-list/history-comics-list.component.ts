import { Component } from '@angular/core';
import { DbControllerService, HistoryService } from 'src/app/library/public-api';
import { HistoryComicsListService } from './history-comics-list.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-comics-list',
  templateUrl: './history-comics-list.component.html',
  styleUrl: './history-comics-list.component.scss'
})
export class HistoryComicsListComponent {
  list=[];

  constructor(public history:HistoryService,
    public DbController:DbControllerService,
    public webDb: NgxIndexedDBService,
    public router: Router,
    public HistoryComicsList:HistoryComicsListService){
   this.init();
  }
  async init(){
     this.list=  (await this.history.getAll()).sort((a:any,b:any)=>a.last_read_date-b.last_read_date).reverse();
     console.log(this.list);

  }
  on_list(e){

  }
  close(){
    this.HistoryComicsList.close();

  }
  on(e){
    this.routerReader(e.origin,e.id)

  }
  async routerReader(origin,comics_id) {
    const _res: any = await Promise.all([this.DbController.getDetail(comics_id), await firstValueFrom(this.webDb.getByID("last_read_comics", comics_id.toString()))])
    if (_res[1]) {
      this.router.navigate(['/comics',origin, comics_id, _res[1].chapter_id])
    } else {
      this.router.navigate(['/comics',origin, comics_id, _res[0].chapters[0].id])
    }
  }
}

