import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { DbEventService, QueryEventService, DbControllerService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { ComicsSelectTypeService } from '../comics-select-type/comics-select-type.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

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

  uid=null;
  is_init_free=false;
  constructor(
    public route: ActivatedRoute,
    public DbEvent: DbEventService,
    public QueryEvent: QueryEventService,
    public ComicsSelectType: ComicsSelectTypeService,
    public data: DataService,
    public DbController: DbControllerService,
    public webDb: NgxIndexedDBService
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      const id = params.get('id')
      const sid = params.get('sid')
      this.menu_id = sid;
      this.origin = id;
      this.uid = `multipy_${id}_${sid}`;
      const obj = this.DbEvent.Configs[id].menu.find(x => x.id == sid);
      this.lists = obj.query.list;
      const indexs=await this.getIndex(this.uid);
      if(indexs&&indexs.length){
        if(this.lists.length==indexs.length){
          indexs.forEach((x,i)=>{
            if((this.lists[i].tag.length-1)>x) this.lists[i].index=x;
          })
        }
      }
      this.is_init_free=true;
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
    this.postIndex(lists.map(x=>x.index))
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
      return null
    }
  }

  ngOnDestroy() {
    this.data.list =[];
    this.is_init_free=false;
  }
}
