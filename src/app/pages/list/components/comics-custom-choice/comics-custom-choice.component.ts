import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { DbControllerService, DbEventService, QueryEventService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';

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
  constructor(
    public route: ActivatedRoute,
    public DbEvent: DbEventService,
    public QueryEvent: QueryEventService,
    public data: DataService,
    public DbController: DbControllerService
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      const id = params.get('id')
      const sid = params.get('sid')
      this.menu_id = sid;
      this.origin = id;
      const obj = this.DbEvent.Configs[id].menu.find(x => x.id == sid);
      this.list = obj.query.list;
      this.name = obj.query.name;
      this.default_index = 0;
      const e = this.list[this.default_index];
      this.option = {
        menu_id: this.menu_id,
        ...e,
      }
    })

    QueryEvent.register({
      id: "choice"
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
  }
  async on(index) {
    this.default_index = index;
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
}
