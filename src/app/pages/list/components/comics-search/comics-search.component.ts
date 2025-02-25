import { Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { AppDataService, ContextMenuEventService, DbComicsControllerService, DbComicsEventService, GamepadEventService, HistoryService, IndexdbControllerService, QueryEventService, WebFileService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, NavigationStart, ParamMap, Router } from '@angular/router';
import { Subject, map, throttleTime } from 'rxjs';

import { CurrentService } from '../../services/current.service';
import { ComicsListV2Service } from '../comics-list-v2/comics-list-v2.service';
import { ComicsSelectTypeService } from '../comics-select-type/comics-select-type.service';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';

@Component({
  selector: 'app-comics-search',
  templateUrl: './comics-search.component.html',
  styleUrl: './comics-search.component.scss'
})
export class ComicsSearchComponent {

  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == "Enter") {
      if (document.querySelector("#input_v1232").getAttribute("select") == "false") {
        if (document.activeElement.tagName == "INPUT") {
          this.search();
          this.WhenInputting.close();
        }
      }


    }
  }

  _keyword = "";
  get keyword() { return this._keyword };
  set keyword(value: string) {
    this._keyword = value;
  }
  async search() {

    this.router.navigate(['/search', this.source, this.utf8_to_b64(this.keyword)]);
  }


  obj = {};
  key: string = '';
  @ViewChild('listbox') ListNode: ElementRef;
  _ctrl = false;
  page_num = 1;
  page_size = 20;
  list = [];


  query = {
    id: "",
    default_index: 0,
    list: [],
    name: ""
  }
  query_option = {};
  source = '';
  menu_id = '';

  id = null;
  type = null;

  value = '';
  is_destroy = false;

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
    public ComicsSelectType: ComicsSelectTypeService,
    public GamepadEvent: GamepadEventService,
    public history: HistoryService,
    public WhenInputting: WhenInputtingService,
    public App: AppDataService
  ) {

    GamepadEvent.registerAreaEvent("input", {
      A: e => {
        if (document.activeElement.tagName == "INPUT") {
          this.search();
          e.querySelector("input").blur();
          this.WhenInputting.close();
        }
        this.WhenInputting.open();
        e.querySelector("input").focus();


      },
      B: e => {
        e.querySelector("input").blur();
        this.WhenInputting.close();
      }
    })

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {

      }

    })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      if (this.id) await this.put()
      const source = params.get('id')
      let value = params.get('sid')
      if (value) value = this.b64_to_utf8(value)
      else value = ''
      this.id = `${source}_${value}`
      this.source = source;
      this.value = value;
      this.keyword = value;
      this.App.setsource(source)
      const obj = this.DbComicsEvent.Configs[source].menu.find(x => x.id == 'search');
      if (obj.query.page_size) this.page_size = obj.query.page_size;


      const data: any = await this.get(this.id);
      if (data) {
        this.page_num = data.page_num;
        this.list = data.list;
        if (this.list.length == 0) {
          this.page_num = 0;
        }

        this.zone.run(() => {
          setTimeout(() => {
            this.ListNode.nativeElement.scrollTop = data.scrollTop;
            this.overflow()
          })

        })

      } else {
        this.init();

      }

    })
  }
  focus() {
    this.WhenInputting.open();
  }
  blur() {
    this.WhenInputting.close();
  }

  private utf8_to_b64 = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  }
  private b64_to_utf8 = (str: string) => {
    return decodeURIComponent(window.atob(str));
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
        const nodec: any = $event.target
        if (nodec.getAttribute("router_reader")) {

          if (this.DbComicsEvent.Configs[this.source].type == "comics") {
            this.current.routerDetail(this.source, data.id)
          } else if (this.DbComicsEvent.Configs[this.source].type == "novels") {
            this.routerNovelsReader(this.source, data.id)
          } else {
            this.current.routerReader(this.source, data.id)
          }
        } else {
          if (this.DbComicsEvent.Configs[this.source].type == "comics") {
            this.current.routerDetail(this.source, data.id)
          } else if (this.DbComicsEvent.Configs[this.source].type == "novels") {
            this.routerNovelsDetail(this.source, data.id)
          } else {
            this.current.routerReader(this.source, data.id)
          }
        }
      }

    }
  }

  async routerNovelsDetail(source, comics_id) {
    this.router.navigate(['/novels_detail', source, comics_id])
  }


  async routerNovelsReader(source, comics_id) {
    const _res: any = await Promise.all([this.DbComicsController.getDetail(comics_id), this.webDb.getByKey("last_read_comics", comics_id.toString())])
    if (_res[1]) {
      this.router.navigate(['/novels', source, comics_id, _res[1].chapter_id])
    } else {
      this.router.navigate(['/novels', source, comics_id, _res[0].chapters[0].id])
    }
  }


  async put() {
    let obj = {
      id: this.id,
      query: this.query,
      list: this.list,
      page_num: this.page_num,
      scrollTop: this.ListNode.nativeElement.scrollTop
    }

    return await this.webDb.update("data", obj)
  }

  async get(id) {
    const res = await this.webDb.getByKey("data", id)
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
    this.scroll$.pipe(throttleTime(300)).subscribe(e => {
      this.handleScroll(e);
    })

  }

  async initFiast(obj) {
    if (this.value == '') return []
    return await this.DbComicsController.Search({ keyword: this.value, ...obj }, { source: this.source });
  }

  async add(obj) {
    if (this.value == '') return []
    return await this.DbComicsController.Search({ keyword: this.value, ...obj }, { source: this.source });
  }

  async init() {
    this.page_num = 1;
    if (this.ListNode) this.ListNode.nativeElement.scrollTop = 0;
    this.list = await this.initFiast({ page_num: this.page_num, page_size: this.page_size });
    this.overflow()
  }
  async overflow() {
    if (this.list.length == 0) {
      await this.add_pages();
      return
    }

    const node = this.ListNode.nativeElement.querySelector(`[index='${this.list.length - 1}']`)

    if (node && this.ListNode.nativeElement.clientHeight < node.getBoundingClientRect().y) {

    } else {
      const length = this.list.length;
      await this.add_pages();
      if (this.list.length == length) {

      } else {
        this.overflow();
      }

    }
  }
  scroll$ = new Subject();

  async handleScroll(e: any) {
    const node: any = this.ListNode.nativeElement;
    let scrollHeight = Math.max(node.scrollHeight, node.scrollHeight);
    let scrollTop = e.target.scrollTop;
    let clientHeight = node.innerHeight || Math.min(node.clientHeight, node.clientHeight);
    if (clientHeight + scrollTop + 50 >= scrollHeight) {
      await this.add_pages();
    }
  }
  ngOnDestroy() {
    this.is_destroy = true;
    this.scroll$.unsubscribe();
  }
  is_end = false;
  async add_pages() {
    if (this.is_destroy) return
    this.page_num++;
    const list = await this.add({ page_num: this.page_num, page_size: this.page_size });

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
