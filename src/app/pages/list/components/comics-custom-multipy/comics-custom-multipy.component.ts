import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { DbComicsEventService, QueryEventService, DbComicsControllerService, IndexdbControllerService } from 'src/app/library/public-api';
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
  source = '';
  obj = {};

  uid = null;
  is_init_free = false;
  constructor(
    public route: ActivatedRoute,
    public DbComicsEvent: DbComicsEventService,
    public QueryEvent: QueryEventService,
    public ComicsSelectType: ComicsSelectTypeService,
    public data: DataService,
    public DbComicsController: DbComicsControllerService,
    public webDb: IndexdbControllerService
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      const id = params.get('id')
      const sid = params.get('sid')
      this.menu_id = sid;
      this.source = id;
      this.uid = `multipy_${id}_${sid}`;
      const obj = this.DbComicsEvent.Configs[id].menu.find(x => x.id == sid);
      this.lists = obj.query.list;
      QueryEvent.register({
        id: "multipy",
        uid:this.uid,
        page_size: obj.query.page_size
      }, {
        Add: async (obj) => {
          const list = await this.DbComicsController.getList({ ...this.option, ...obj }, { source: this.source });
          return list
        },
        Init: async (obj) => {
          this.obj = obj;
          const list = await this.DbComicsController.getList({ ...this.option, ...obj }, { source: this.source });
          return list
        }
      })
      const indexs = await this.getIndex(this.uid);
      if (indexs && indexs.length) {
        if (this.lists.length == indexs.length) {
          indexs.forEach((x, i) => {
            if ((this.lists[i].tag.length - 1) > x) this.lists[i].index = x;
          })
        }
      }
      this.is_init_free = true;
      this.getData();

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
    this.data.list = await this.DbComicsController.getList({ ...this.option, ...this.obj }, { source: this.source });
  }

  getData() {
    const lists = JSON.parse(JSON.stringify(this.lists))
    this.postIndex(lists.map(x => x.index))
    let list = lists.map(x => {
      x.tag = x.tag[x.index]
      return x
    })
    this.option = {
      menu_id: this.menu_id,
      list
    };
  }


  async postIndex(index) {
    return await this.webDb.update("data", {
      id: this.uid,
      index: index
    })
  }

  async getIndex(id) {
    const res: any = await this.webDb.getByKey("data", id)
    if (res) {
      return res.index
    } else {
      return null
    }
  }

  ngOnDestroy() {
    this.is_init_free = false;
  }
}
