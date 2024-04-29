import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { DbEventService, QueryEventService, DbControllerService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { ComicsSelectTypeService } from '../comics-select-type/comics-select-type.service';

@Component({
  selector: 'app-comics-custom-multipy',
  templateUrl: './comics-custom-multipy.component.html',
  styleUrl: './comics-custom-multipy.component.scss'
})
export class ComicsCustomMultipyComponent {

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
    public ComicsSelectType: ComicsSelectTypeService,
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
      this.lists = obj.query.list;
      this.getData();
    })

    QueryEvent.register({
      id: "multipy"
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


  async on($event: any, e: any, index: any) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = position.left - 10;
    const y = position.bottom + 10;
    const ic = await this.ComicsSelectType.getType(e.tag, index, { position: { top: `${y}px`, left: `${x}px` } }) as any
    this.lists[index].index = ic;
    this.getData();
    this.data.list = await this.DbController.getList({ ...this.option, ...this.obj }, { origin: this.origin });
  }

  getData() {
    const lists = JSON.parse(JSON.stringify(this.lists))
    let list = lists.map(x => {
      x.tag = x.tag[x.index]
      return x
    })
    this.option = {
      menu_id: this.menu_id,
      list
    };
  }
}
