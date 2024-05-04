import { Component } from '@angular/core';
import { AppDataService, HistoryService, QueryEventService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  list=[];
  origin='';
  constructor(public data:DataService,
    public history:HistoryService,
    public AppData:AppDataService,
    public route: ActivatedRoute,
    public QueryEvent:QueryEventService
    ) {

      let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get("id")));
      id$.subscribe(x=>{
        origin=x;
      })
      QueryEvent.register({
        id:"history"
      },{
        Add:async (obj)=>{
          return (await this.history.getAll() as any).filter(x=>x.origin==origin).slice((obj.page_num - 1) * obj.page_size, (obj.page_num) *obj.page_size);
        },
        Init:async (obj)=>{
          return (await this.history.getAll() as any).filter(x=>x.origin==origin).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
        }
      })
  }

  async init() {
  }

  async change() {

  }
  async addList(){

  }
  ngAfterViewInit() {
  }

}
