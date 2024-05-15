import { Component } from '@angular/core';
import { DbControllerService, DbEventService, QueryEventService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-comics-search',
  templateUrl: './comics-search.component.html',
  styleUrl: './comics-search.component.scss'
})
export class ComicsSearchComponent {
  _keyword = "";
  get keyword() { return this._keyword };
  set keyword(value: string) {
    this._keyword = value;
  }
  async search() {

    this.data.list = await this.DbController.Search({ keyword: this.keyword, ...this.obj }, { origin: this.origin });
  }
  obj = {};
  origin = ''
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public route: ActivatedRoute,
    public QueryEvent: QueryEventService,
    public DbEvent: DbEventService,
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get("id")));

    id$.subscribe(x => {

      this.origin = x;
      const obj = this.DbEvent.Configs[x].menu.find(x => x.id == 'search');

      QueryEvent.register({
        id: "search",
        uid: `${this.origin}_search`,
        page_size:obj.query.page_size
      }, {
        Add: async (obj) => {
          const list = await this.DbController.Search({ keyword: this.keyword, ...obj }, { origin: this.origin });
          return list
        },
        Init: async (obj) => {
          this.obj = obj;
          return []
        }
      })
    })

  }




}
