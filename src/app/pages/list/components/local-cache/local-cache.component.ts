import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { QueryEventService } from 'src/app/library/public-api';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-local-cache',
  templateUrl: './local-cache.component.html',
  styleUrl: './local-cache.component.scss'
})
export class LocalCacheComponent {
  constructor(public data:DataService,
    public webDb: NgxIndexedDBService,
    public QueryEvent:QueryEventService
    ) {

      QueryEvent.register({
        id:"local_cache",
        uid:"local_cache"
      },{
        Add:async (obj)=>{
          const res = await firstValueFrom(this.webDb.getAll("local_comics"))
          const list = res.map((x: any) => {
            return { id: x.id, cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
          }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
          return list
        },
        Init:async (obj)=>{
          const res = await firstValueFrom(this.webDb.getAll("local_comics"))
          const list = res.map((x: any) => {
            return { id: x.id, cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
          }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
          return list
        }
      })
  }
}
