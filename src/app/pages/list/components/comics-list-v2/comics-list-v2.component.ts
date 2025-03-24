import { Component, ElementRef, HostListener, Input, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd, NavigationStart } from '@angular/router';
import { map, throttleTime, Subject } from 'rxjs';
import { AppDataService, ContextMenuEventService, DbComicsControllerService, DbComicsEventService, HistoryService, IndexdbControllerService, KeyboardEventService, ListMenuControllerService, ListMenuEventService, LocalCachService, PromptService, WebFileService } from 'src/app/library/public-api';

import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

import { ComicsListV2Service } from './comics-list-v2.service';
import { ComicsSelectTypeService } from '../comics-select-type/comics-select-type.service';
import { DownloadOptionService } from '../download-option/download-option.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';
import { AdvancedSearchService } from '../advanced-search/advanced-search.service';
import { FavoritesPageService } from '../favorites-page/favorites-page.service';
import { ComicsListConfigService } from '../comics-list-config/comics-list-config.service';

@Component({
  selector: 'app-comics-list-v2',
  templateUrl: './comics-list-v2.component.html',
  styleUrl: './comics-list-v2.component.scss'
})
export class ComicsListV2Component {
  key: string = '';

  is_all = false;
  selected_length = 0;

  @ViewChild('listbox') ListNode: ElementRef;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = true;
    if (event.key == "Control") this._ctrl = true;

    return true
  }
  // selectedAll
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {

    if (event.key == "Meta") this._ctrl = false;
    if (event.key == "Control") this._ctrl = false;
    return true
  }

  @HostListener('window:click', ['$event'])
  windowClick(event: PointerEvent) {

    if (this.data.is_edit || this._ctrl) {

    } else {
      this.list.forEach(x => x.selected = false)
    }


    return true
  }
  _ctrl = false;
  page_num = 1;
  page_size = 20;
  list = [];


  query = {
    id: "",
    default_index: 0,
    double_choice_index:[0,0],
    list: [],
    name: ""
  }
  query_option = {};
  source = '';
  menu_id = '';

  id = null;
  type = null;

  url = ""

  is_destroy = false;

  params = {
    gh_data: "",
    _gh_condition: ""
  }
  is_phone = false;
  constructor(
    public data: DataService,
    public current: CurrentService,
    public ContextMenuEvent: ContextMenuEventService,
    public router: Router,
    public WebFile: WebFileService,
    private zone: NgZone,
    public route: ActivatedRoute,
    public DbComicsController: DbComicsControllerService,
    public webDb: IndexdbControllerService,
    public DbComicsEvent: DbComicsEventService,
    public ComicsListV2: ComicsListV2Service,
    public KeyboardEvent: KeyboardEventService,
    public ComicsSelectType: ComicsSelectTypeService,
    public history: HistoryService,
    private _snackBar: MatSnackBar,
    public DownloadOption: DownloadOptionService,
    public ListMenuController: ListMenuControllerService,
     public ListMenuEvent: ListMenuEventService,
    public App: AppDataService,
    public platform: Platform,
    public prompt: PromptService,
    public AdvancedSearch: AdvancedSearchService,
    public FavoritesPage: FavoritesPageService,
    public ComicsListConfig:ComicsListConfigService,
    public LocalCach: LocalCachService,

  ) {
    this.is_phone = (window.innerWidth < 480 && (platform.ANDROID || platform.IOS))

    KeyboardEvent.registerGlobalEventY({
      "a": () => {
        this.all()
      }
    })
    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {

      }

    })

    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      this.params = this.getAllParams(window.location.href) as any
      if (this.params?.gh_data == "reset") {
        const url = new URL(window.location.href);
        url.searchParams.delete('gh_data');
        window.history.pushState({}, '', url);

      }else if(this.params?._gh_condition){
        const url = new URL(window.location.href);
        url.searchParams.delete('_gh_condition');
        window.history.pushState({}, '', url);
      } else {
        if (this.id) {
          console.log(123);

          await this.put()
        }
      }
      // 新的阅读器 参考
      // 动态菜单功能
      // 偷懒
      //
      const type = params.get('id')
      let source = params.get('sid')
      const sid = params.get('pid')
      if (!source) source = type;

      if(type=="custom"){

        this.id = `${type}_${source}_${sid}`;
        this.key = this.id;
        const arr=this.ListMenuEvent.Content[source]
        const obj=arr.find(x=>x.id==sid)
        this.type=obj.query.type;
        if (obj.query.conditions) {
          this.query.list = obj.query.conditions;
          if(obj.query.updateConditions) this.query.list = await obj.query.updateConditions();

        }
        if (obj.query.name) this.query.name = obj.query.name;
        else this.query.name = ''


        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (json) => {
            const res= await obj.getList({ ...this.query_option, ...json })
            return res
          },
          Init: async (json) => {
            const res= await obj.getList({ ...this.query_option, ...json })
            return res
          },
          Click: async(json)=>{
            return await obj.query.click(json)

          }
        })
        this.source = null;
        this.App.setsource(null)
      }else{
        this.source = source;
        this.type = type;
        this.App.setsource(source)
      }

      if (type == "history") {
        this.id = `${type}_${source}`;
        this.key = this.id;

        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (obj) => {
            return (await this.history.getAll() as any).sort((a, b) => b.last_read_date - a.last_read_date).filter(x => x.source == source).slice((obj.page_num - 1) * obj.page_size, (obj.page_num) * obj.page_size);
          },
          Init: async (obj) => {
            return (await this.history.getAll() as any).sort((a, b) => b.last_read_date - a.last_read_date).filter(x => x.source == source).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
          }
        })

      } else if (type == "local_cache") {
        this.id = `local_cache`;
        this.key = this.id;
        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (obj) => {
            const res = await this.webDb.getAll("local_comics")
            const list = res.map((x: any) => {
              x = x.data
              return { id: x.id, cover: x.cover, title: x.title, creation_time: x.creation_time, subTitle: `${x.chapters[0].title}` }
            }).sort((a, b) => b.creation_time - a.creation_time).slice((obj.page_num - 1) * obj.page_size, obj.page_size * obj.page_num);
            return list
          },
          Init: async (obj) => {
            const res = await this.webDb.getAll("local_comics")
            const list = res.map((x: any) => {
              x = x.data


              return { id: x.id, cover: x.cover, title: x.title, creation_time: x.creation_time, subTitle: `${x.chapters[0].title}` }
            }).sort((a, b) => b.creation_time - a.creation_time).slice((obj.page_num - 1) * obj.page_size, obj.page_size * obj.page_num);


            return list
          }
        })
      }
      else if (type == "temporary_data") {
        this.id = `temporary_data`;
        this.key = this.id;
        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (obj) => {
            const res = await this.webDb.getAll("temporary_details")

            const list = res.map((x: any) => {
              x = x.data
              return { id: x.id, cover: x.cover, title: x.title, creation_time: x.creation_time, subTitle: `${x.chapters[0]?.title}` }
            }).sort((a, b) => b.creation_time - a.creation_time).slice((obj.page_num - 1) * obj.page_size, obj.page_size * obj.page_num);
            return list
          },
          Init: async (obj) => {
            const res = await this.webDb.getAll("temporary_details")

            const list = res.map((x: any) => {
              x = x.data
              return { id: x.id, cover: x.cover, title: x.title, creation_time: x.creation_time, subTitle: `${x.chapters[0]?.title}` }
            }).sort((a, b) => b.creation_time - a.creation_time).slice((obj.page_num - 1) * obj.page_size, obj.page_size * obj.page_num);


            return list
          }
        })
      } else if (type == "url_to_list") {
        this.menu_id = sid;
        this.source = source;
        this.id = `${type}_${source}_${sid}`;
        this.key = this.id;
        this.App.setsource(this.source);
        const obj: any = await this.webDb.getByKey('url_to_list', this.menu_id)
        this.url = `${obj.name}`
        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async () => {
            return []
          },
          Init: async () => {
            return await this.DbComicsController.UrlToList(decodeURIComponent(window.atob(sid)), {
              source: this.source
            })
          }
        })
      } else if (type == "query_fixed") {
        this.menu_id = sid;
        this.source = source;
        this.id = `${type}_${source}_${sid}`;
        this.key = this.id;
        this.App.setsource(this.source);
        const obj: any = await this.webDb.getByKey('query_fixed', this.menu_id)

        this.url = `${obj.name}`
        this.query_option = obj.data;

        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (obj) => {
            const list = await this.DbComicsController.getList({ ...this.query_option, ...obj }, { source: this.source });
            return list
          },
          Init: async (obj) => {
            const list = await this.DbComicsController.getList({ ...this.query_option, ...obj }, { source: this.source });
            return list
          }
        })


      } else if (type == "favorites") {
        this.menu_id = sid;
        this.source = source;
        this.id = `${type}_${source}_${sid}`;
        this.key = this.id;
        this.App.setsource(this.source);
        const obj: any = await this.webDb.getByKey('favorites_menu', this.menu_id)

        this.url = `${obj.name}`

        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (obj) => {
            const res = (await this.webDb.getAll('favorites_comics') as any)
            res.forEach(x => {
              x.sid = x.id;
              x.id = x.comics_id;

            })
            return res
              .sort((a, b) => b.add_favorites_date - a.add_favorites_date)
              .filter(x => x.source == source && this.menu_id == x.favorites_id).slice((obj.page_num - 1) * obj.page_size, (obj.page_num) * obj.page_size);
          },
          Init: async (obj) => {
            const res = (await this.webDb.getAll('favorites_comics') as any)
            res.forEach(x => {
              x.sid = x.id;
              x.id = x.comics_id;
            })
            return res
              .sort((a, b) => b.add_favorites_date - a.add_favorites_date)
              .filter(x => x.source == source && this.menu_id == x.favorites_id).slice((obj.page_num - 1) * obj.page_size, (obj.page_num) * obj.page_size);
          }
        })


      } else if (type == "temporary_file") {
        this.id = `${sid}`;
        this.key = this.id;
        ComicsListV2.register({
          id: this.id,
          type: type,
          page_size: 20
        }, {
          Add: async (obj) => {
            const list = await this.DbComicsController.getList({ temporary_file_id: this.id, ...obj }, { source: 'temporary_file', is_cache: false });
            return list
          },
          Init: async (obj) => {
            const list = await this.DbComicsController.getList({ temporary_file_id: this.id, ...obj }, { source: 'temporary_file', is_cache: false });
            return list
          }
        })
      } else if (sid) {
        if(type!="custom") {
          this.menu_id = sid;
          this.source = source;
          const obj = this.DbComicsEvent.Configs[source].menu.find(x => x.id == sid);
          this.id = `${type}_${source}_${sid}`;
          if (obj.query.conditions) {
            this.query.list = obj.query.conditions;
            if(obj.query.updateConditions) this.query.list = await obj.query.updateConditions();
          }
          if (obj.query.name) this.query.name = obj.query.name;
          else this.query.name = ''
          this.key = this.id;
          this.App.setsource(this.source);
          const e: any = this.query.list[this.query.default_index];
          this.query_option = {
            menu_id: this.menu_id,
            ...e,
          }
          ComicsListV2.register({
            id: this.id,
            type: type,
            page_size: obj.query.page_size
          }, {
            Add: async (obj) => {

              const list = await this.DbComicsController.getList({ ...this.query_option, ...obj }, { source: this.source });


              return list
            },
            Init: async (obj) => {
              const list = await this.DbComicsController.getList({ ...this.query_option, ...obj }, { source: this.source });
              return list
            }
          })
          if (this.params._gh_condition) {
            const c = JSON.parse(decodeURIComponent(window.atob(this.params._gh_condition)));
            this.query.list.forEach(x => {
              if (c[x.id]) x.value = c[x.id]
            })


          }
        }

      }


      const data: any = await this.get(this.id);

      if(this.ListNode&&this.ListNode.nativeElement) this.ListNode.nativeElement.style = "opacity: 0;"
      setTimeout(() => {
        if(this.ListNode&&this.ListNode.nativeElement)  this.ListNode.nativeElement.style = ""
      }, 800)
      if (this.params._gh_condition) {
        let obj = {};
        for (let index = 0; index < this.query.list.length; index++) {
          const c = this.query.list[index]
          if (c.value) obj[c.id] = c.value
        }
        this.on_135(obj)
      } else if (data && this.params.gh_data != "reset") {
        data.list.forEach(x => {
          x.selected = false;
        })


        this.page_num = data.page_num;
        if (this.type == "multipy") {
          // this.query.list = data.query.list;
          this.getDatac123123();
          this.list = data.list;
        } else if (this.type == "choice") {
          this.query.default_index = data.query.default_index;
          this.list = data.list;
        }else if (this.type == "double_choice") {
          this.double_choice_query();
          this.list = data.list;
          this.query.double_choice_index = data.query.double_choice_index;
        } else if (this.type == "advanced_search") {
          let obj = {};
         if(type=="custom")   this.query.list=data.query.list;
          for (let index = 0; index < this.query.list.length; index++) {
            const c = this.query.list[index]
            if (c.value) obj[c.id] = c.value
          }
          this.query_option = {
            menu_id: this.menu_id,
            ...obj
          }
          this.list = data.list;

        } else if (this.type == "history") {

          this.list = data.list;

        } else if (this.type == "local_cache") {

          this.list = await this.ComicsListV2.Events[this.id].Init({ page_num: 1, page_size: 1000 });
        } else if (this.type == "temporary_data") {

          this.list = await this.ComicsListV2.Events[this.id].Init({ page_num: 1, page_size: 1000 });
        } else if (this.type == "temporary_file") {

          this.list = await this.ComicsListV2.Events[this.id].Init({ page_num: 1, page_size: 1000 });
        } else {
          this.list = data.list;
        }
        if (this.list.length == 0) {
          this.page_num = 0;
        }
        // this.ListNode.nativeElement.scrollTop = data.scrollTop;

        function isTablet() {
          const userAgent = navigator.userAgent.toLowerCase();
            /ipad|tablet|android(?!.*mobile)/.test(userAgent);
        }
        this.zone.run(() => {
          setTimeout(() => {
            this.ListNode.nativeElement.scrollTop = data.scrollTop;
            if(this.ListNode&&this.ListNode.nativeElement)   this.ListNode.nativeElement.style = ""
            this.overflow()
          })
        })

        // this.ListNode.nativeElement.scrollTop = data.scrollTop;

      } else {


        if(this.ListNode&&this.ListNode.nativeElement)  this.ListNode.nativeElement.style = ""
        if (this.type == "multipy") {
          this.query.list.forEach(x=>{
            x.tag.forEach((x,i)=>{
              x.index=i
            })
          })
          this.getDatac123123();
          this.init();
        } else if (this.type == "choice") {
          this.init();
        }else if(this.type=="double_choice"){
          this.double_choice_query();
          this.init();
        } else {
          this.init();
        }

      }

    })

    ContextMenuEvent.register('comics_item', {
      send: ($event, menu) => {
        let data = []
        const href = $event.getAttribute('href')
        if (href) {
          data.push({
            id: "href",
            name: "打开链接",
            click: list => {
              for (let index = 0; index < list.length; index++) {
                const x = list[index];
                if (x) window.open(x.href, '_blank')
              }
            }
          })
          data.push({
            id: "add_favorites",
            name: "加入收藏",
            click: list => {
              this.FavoritesPage.open(list)
            }
          })
        }
        let arr = [...data, ...menu,];
        if (this.type == "favorites") {
          arr.push(
            {
              id: "delete",
              name: "删除",
              click: list => {
                for (let index = 0; index < list.length; index++) {
                  let node = document.querySelector(`[_id='${list[index].id}']`)
                  if (node) node.remove();
                  this.webDb.deleteByKey('favorites_comics', list[index].sid)
                }
              }
            }
          )
        } else if (this.type == "history") {
          // arr.push(
          //   {
          //     id:"delete",
          //     name:"删除",
          //     click:list=>{
          //        for (let index = 0; index < list.length; index++) {
          //         let node = document.querySelector(`[_id='${list[index].id}']`)
          //         if (node) node.remove();
          //         this.webDb.deleteByKey('history',list[index].id)
          //        }
          //     }
          //   }
          // )
        }
        return arr
      },
      on: async (e: any) => {
        if (e.value) {
          const index = this.list.findIndex(x => x.id.toString() == e.value.toString());
          if (this.list.filter(x => x.selected).length == 0) {
            this.list[index].selected = !this.list[index].selected;
          }
        }
        const list = this.getSelectedData();
        e.click(list)
      }
    })

    ContextMenuEvent.register('comics_list', {
      on: async (e: any) => {
        e.click(this.list)
      },
      menu: [
        {
          id: "edit",
          name: "编辑",
          click: e => {
            this.data.is_edit = !this.data.is_edit;
          }
        },
        {
          id: "edit",
          name: "点击后跳转",
          click: e => {
           this.ComicsListConfig.open();
          }
        }
      ]
    })

  }

  on_8474() {
    this.AdvancedSearch.open({
      list: this.query.list,
      query_fixed: this.query_fixed,
      change: this.on_135
    })
  }
  getAllParams(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const allParams = Object.fromEntries((params as any).entries());
    return allParams
  }
  on_135 = async (e) => {
    this.query_option = {
      menu_id: this.menu_id,
      ...e
    }
    this.page_num = 1;
    this.ListNode.nativeElement.scrollTop = 0;
    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num });
  }
  query_fixed = async (e) => {
    const name = await this.prompt.fire("请输入新名称", "");

    if (name === null) {

    } else if (name === "") {
      const generateRandomName = (length = 4) => {
        const chars = '1234567890';
        let name = '';
        for (let i = 0; i < length; i++) {
          name += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return name;
      }
      const name = generateRandomName()
      const obj = {
        id: new Date().getTime().toString(),
        name: name,
        source: this.source,
        data: {
          menu_id: this.menu_id,
          page_num: 1,
          ...e
        }
      }
      await this.webDb.update('query_fixed', obj)

      setTimeout(() => {
        window._gh_menu_update()
      })


    } else {
      if (name != "") {
        const obj = {
          id: new Date().getTime().toString(),
          name: name,
          source: this.source,
          data: {
            menu_id: this.menu_id,
            page_num: 1,
            ...e
          }
        }
        await this.webDb.update('query_fixed', obj)

        setTimeout(() => {
          window._gh_menu_update()
        })
      }
    }
  }

  initc(type, source, menu_id) {
    if (type == "choice") {

    }
  }
  closeEdit() {
    this.data.is_edit = false;
    this.list.forEach(x => {
      x.selected = false
    })
  }
  getSelectedData() {
    const list = this.list.filter(x => x.selected)
    return list
  }
  download() {
    const list = this.getSelectedData();
    this.DownloadOption.open(list)
  }

  async resetReadingProgress(comics_id) {
    const detail = await this.DbComicsController.getDetail(comics_id)
    for (let index = 0; index < detail.chapters.length; index++) {
      const x = detail.chapters[index];
      this.webDb.update("last_read_chapter_page", { 'chapter_id': x.id.toString(), "page_index": 0 })
      if (index == 0) this.webDb.update("last_read_comics", { 'comics_id': comics_id.toString(), chapter_id: detail.chapters[index].id })
    }
  }

  async delCache(comics_id) {
    await this.webDb.deleteByKey('history', comics_id.toString())
    await this.webDb.deleteByKey('local_comics', comics_id)
    await this.webDb.deleteByKey('local_comics', comics_id.toString())
    this.DbComicsController.delComicsAllImages(comics_id)
  }

  async all() {
    const c = this.list.filter(x => x.selected == true).length

    if (c == this.list.length) {
      this.list.forEach(x => {
        x.selected = false
      })
    } else {
      this.list.forEach(x => {
        x.selected = true
      })
    }
    this.getIsAll();
  }

  async getIsAll() {
    const c = this.list.filter(x => x.selected == true).length
    this.selected_length = c;

    if (c == this.list.length) {
      this.is_all = true;
    } else {
      this.is_all = false;
    }


  }
  async on_list($event: MouseEvent) {

    const node = $event.target as HTMLElement;
    if (node.getAttribute("id") == 'comics_list') {
      this.list.forEach(x => x.selected = false)
    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "comics_item") {
          return node
        } else {
          return getTargetNode(node.parentNode as HTMLElement)
        }
      }

      const target_node = getTargetNode(node);
      const index = parseInt(target_node.getAttribute("index") as string);
      const data = this.list[index]
      if (this.data.is_edit || this._ctrl) {
        this.list[index].selected = !this.list[index].selected;
      } else {
        if(this.ComicsListV2.Events[this.key].Click){
          this.data.currend_read_comics_id=data.id;
          await this.ComicsListV2.Events[this.key].Click({
            PointerEvent:$event,
            data:data
          })
          return
        }
        const nodec: any = $event.target;
        if (this.data.config.click_type == 1) {
          this.current.routerDetail(this.source, data.id)
        } else if (this.data.config.click_type == 2) {

          this.current.routerReader(this.source, data.id)
        }
        else if (this.data.config.click_type == 3) {
          if (nodec.getAttribute("router_reader")) {
            this.current.routerReader(this.source, data.id)
          } else {
            this.current.routerDetail(this.source, data.id)
          }
        }
        else if (this.data.config.click_type == 2) {
          if (nodec.getAttribute("router_reader")) {

            this.current.routerDetail(this.source, data.id)
          } else {
            this.current.routerReader(this.source, data.id)
          }
        } else {
          this.current.routerDetail(this.source, data.id)
        }

      }

    }
    this.getIsAll();
  }

  async on(index) {
    this.query.default_index = index;
    const e = this.query.list[index];
    this.query_option = {
      menu_id: this.menu_id,
      ...e,
    }
    this.page_num = 1;
    this.ListNode.nativeElement.scrollTop = 0;

    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num });
  }

  async double_choice_on(index){

    let option= this.query.list[this.query.double_choice_index[0]].options[this.query.double_choice_index[1]]

    this.query.double_choice_index[0]=index;

    if(this.query.list[this.query.double_choice_index[0]].options){
      const index=this.query.list[this.query.double_choice_index[0]].options.findIndex((x,i)=>x.label==option.label);
      if(index>-1){
        this.query.double_choice_index[1]=index
      }else{
        this.query.double_choice_index[1]=0
      }
    }

    let obj= this.query.list[this.query.double_choice_index[0]]
    obj.option=obj.options[this.query.double_choice_index[1]]
    obj= JSON.parse(JSON.stringify(obj))
    delete obj.options
    this.query_option = {
      menu_id: this.menu_id,
      ...obj,
    }
    this.page_num = 1;
    this.ListNode.nativeElement.scrollTop = 0;
    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num });
  }

  async double_choice_on2(index){
    this.query.double_choice_index[1]=index;
    let obj= this.query.list[this.query.double_choice_index[0]]
    obj.option=obj.options[this.query.double_choice_index[1]]
    obj= JSON.parse(JSON.stringify(obj))
    delete obj.options
    this.query_option = {
      menu_id: this.menu_id,
      ...obj,
    }
    this.page_num = 1;
    this.ListNode.nativeElement.scrollTop = 0;
    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num });
  }
  async double_choice_query(){
    let obj= this.query.list[this.query.double_choice_index[0]]
    obj.option=obj.options[this.query.double_choice_index[1]]
    obj= JSON.parse(JSON.stringify(obj))
    delete obj.options
    this.query_option = {
      menu_id: this.menu_id,
      ...obj,
    }
  }

  async on2($event: any, e: any, index: any) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = position.left - 10;
    const y = position.bottom + 10;

    const ic = await this.ComicsSelectType.getType(e.tag, index, { position: { top: `${y}px`, left: `${x}px` } }) as any
    if(ic>-1){
      this.query.list[index].index = ic;

      this.getDatac123123();
      this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num });
    }

  }

  getDatac123123() {
    const lists = JSON.parse(JSON.stringify(this.query.list))

    let list = lists.map(x => {
      x.tag = x.tag[x.index]
      return x
    })
    this.query_option = {
      menu_id: this.menu_id
    };
    this.page_num=1;
    list.forEach(x=>{
      this.query_option[x.key]=x.tag;
    })


  }

  async put() {
    // if(this.type=="history") return null
    let obj = {
      id: this.id,
      query: this.query,
      list: this.list,
      page_num: this.page_num,
      scrollTop: this.ListNode.nativeElement.scrollTop
    }
    console.log(obj);

    this.ComicsListV2._data[this.id] = obj

  }

  async get(id) {
    const res = this.ComicsListV2._data[id];
    if (res) {
      return res
    } else {
      return null
    }
  }


  ngAfterViewInit() {
    this.ListNode.nativeElement.addEventListener('scroll', (e: any) => {
      this.scroll$.next(e)
    }, true)
    this.scroll$.subscribe(e => {
      this.handleScroll(e);
    })



  }



  async init() {
    this.page_num = 1;
    if (this.ListNode) this.ListNode.nativeElement.scrollTop = 0;
    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num });
    this.overflow()
  }
  async overflow() {
    await this.add_pages();
    if (this.list.length == 0) {
      await this.add_pages();
      return
    }

    const c = (window.innerHeight * window.innerWidth) / (171 * 262) * 1.5;
    if (this.list.length < c) {


      await this.add_pages();
    }

    const node = this.ListNode.nativeElement.querySelector(`[index='${this.list.length - 1}']`)

    if (node && this.ListNode.nativeElement.clientHeight < node.getBoundingClientRect().y) {

    } else {
      // const length = this.list.length;
      // await this.add_pages();
      // if (this.list.length == length) {

      // } else {
      //   this.overflow();
      // }

    }
  }
  scroll$ = new Subject();
  async handleScroll(e: any) {
    const node: any = this.ListNode.nativeElement;
    let scrollHeight = Math.max(node.scrollHeight, node.scrollHeight);
    let scrollTop = e.target.scrollTop;
    let clientHeight = node.innerHeight || Math.min(node.clientHeight, node.clientHeight);
    if (clientHeight + scrollTop + 300 >= scrollHeight) {
      await this.add_pages();
    }
  }
  ngOnDestroy() {
    this.put();
    this.is_destroy = true;
    this.scroll$.unsubscribe();


  }
  is_end = false;
  async add_pages() {

    if (this.is_destroy) return
    this.page_num++;
    const list = await this.ComicsListV2.add(this.key, { page_num: this.page_num, page_size: this.page_size })
    if (list.length == 0) {
      this.page_num--;
      return
    }

    this.list = [...this.list, ...list].filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.id === item.id
      ))
    );


  }
}
