import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { DbControllerService, DbEventService, QueryEventService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-comics-custom-choice',
  templateUrl: './comics-custom-choice.component.html',
  styleUrl: './comics-custom-choice.component.scss'
})
export class ComicsCustomChoiceComponent {

  type = '';
  default_index = 0;
  list = [];
  lists = [];
  name = null;

  menu_id = null;

  option = {};
  origin = '';
  obj = {};

  uid = null;

  is_init_free = false;
  constructor(
    public route: ActivatedRoute,
    public DbEvent: DbEventService,
    public QueryEvent: QueryEventService,
    public data: DataService,
    public DbController: DbControllerService,
    public webDb: NgxIndexedDBService,
    private router: Router,
    private zone: NgZone,
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      this.is_init_free = false;
      const id = params.get('id')
      const sid = params.get('sid')
      this.menu_id = sid;
      this.origin = id;
      const obj = this.DbEvent.Configs[id].menu.find(x => x.id == sid);
      this.uid = `choice_${id}_${sid}`;

      this.list = obj.query.list;
      this.name = obj.query.name;

      this.default_index = await this.getIndex(this.uid);
      if ((this.list.length - 1) < this.default_index) this.default_index = 0;
      const e = this.list[this.default_index];
      this.option = {
        menu_id: this.menu_id,
        ...e,
      }
      setTimeout(()=>{
        QueryEvent.register({
          id: "choice",
          uid:this.uid,
          page_size:obj.query.page_size
        }, {
          Add: async (obj) => {
            const list = await this.DbController.getList({ ...this.option, ...obj }, { origin: this.origin });
            return list
          },
          Init: async (obj) => {
            this.obj = obj;
            const list = await this.DbController.getList({ ...this.option, ...obj }, { origin: this.origin });
            return list
          }
        })
        this.is_init_free = true;
      })

    })

  }

  async on(index) {
    this.default_index = index;
    this.postIndex(index)
    const e = this.list[index];
    this.option = {
      menu_id: this.menu_id,
      ...e,
    }
    this.data.list = await this.DbController.getList({ ...this.option, ...this.obj }, { origin: this.origin });
  }
  utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  async postIndex(index) {
    return await firstValueFrom(this.webDb.update("data", {
      id: this.uid,
      index: index
    }))
  }

  async getIndex(id) {
    const res: any = await firstValueFrom(this.webDb.getByKey("data", id))
    if (res) {
      return res.index
    } else {
      return 0
    }
  }
  ngOnDestroy() {
    this.is_init_free = false;


  }
}
