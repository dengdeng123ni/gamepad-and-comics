import { Component, ElementRef, HostListener, Input, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd, NavigationStart } from '@angular/router';
import { map, throttleTime, Subject, firstValueFrom } from 'rxjs';
import { AppDataService, ContextMenuEventService, DbControllerService, DbEventService } from 'src/app/library/public-api';
import { WebFileService } from 'src/app/library/web-file/web-file.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ComicsListV2Service } from './comics-list-v2.service';

@Component({
  selector: 'app-comics-list-v2',
  templateUrl: './comics-list-v2.component.html',
  styleUrl: './comics-list-v2.component.scss'
})
export class ComicsListV2Component {
  key: string = '';
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "z" || this._ctrl) {
      this.selectedAll();
      return false
    }
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
  @ViewChild('listbox') ListNode: ElementRef;
  _ctrl = false;
  page_num = 1;
  page_size = 20;
  list = [];


  query = {
    id:"",
    type: "",
    default_index: 0,
    list: [],
    name: ""
  }
  query_option = {};
  origin = '';
  menu_id = '';

  id = null;


  constructor(
    public data: DataService,
    public current: CurrentService,
    public ContextMenuEvent: ContextMenuEventService,
    public router: Router,
    public WebFile: WebFileService,
    private zone: NgZone,
    public route: ActivatedRoute,
    public DbController: DbControllerService,
    public webDb: NgxIndexedDBService,
    public DbEvent: DbEventService,
    public ComicsListV2: ComicsListV2Service,
    public App:AppDataService
  ) {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {

      }

    })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      if(this.id) this.put()
      const type = params.get('id')
      const origin = params.get('sid')
      const sid = params.get('pid')
      this.menu_id = sid;
      this.origin = origin;
      const obj = this.DbEvent.Configs[origin].menu.find(x => x.id == sid);
      this.id = `${type}_${origin}_${sid}`;
      this.query.list = obj.query.list;
      this.query.name = obj.query.name;
      this.key = this.id;
      this.App.setOrigin(this.origin);
      const e:any = this.query.list[this.query.default_index];
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
          const list = await this.DbController.getList({ ...this.query_option, ...obj }, { origin: this.origin });
          return list
        },
        Init: async (obj) => {
          const list = await this.DbController.getList({ ...this.query_option, ...obj }, { origin: this.origin });
          return list
        }
      })

      const data:any= await this.get(this.id);
      if(data){
        this.list=data.list;
        this.query.default_index=data.query.default_index;
        this.zone.run(() => {
          setTimeout(()=>{
            this.ListNode.nativeElement.scrollTop=data.scrollTop;
          })
        })
      }else{
        this.init();
      }
    })
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
        localStorage.setItem('list_url', window.location.href)
        const nodec: any = $event.target
        if (nodec.getAttribute("router_reader")) {
          await this.put()
          this.current.routerReader(data.id)
        } else {
          await this.put()
          this.router.navigate(['/detail', data.id]);
        }
      }

    }
  }

  async on(index) {
    this.query.default_index = index;
    const e = this.query.list[index];
    this.query_option = {
      menu_id: this.menu_id,
      ...e,
    }
    this.page_num=1;
    this.ListNode.nativeElement.scrollTop=0;
    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num});
  }

  async put() {
    let obj={
      id: this.id,
      query: this.query,
      list:this.list,
      page_num:this.page_num,
      scrollTop:this.ListNode.nativeElement.scrollTop
    }
    return await firstValueFrom(this.webDb.update("data", obj))
  }

  async get(id) {
    const res = await firstValueFrom(this.webDb.getByKey("data", id))
    if (res) {
      return res
    } else {
      return null
    }
  }

  selectedAll() {
    const bool = this.list.filter(x => x.selected == true).length == this.list.length;
    if (bool) {
      this.list.forEach(x => x.selected = false)
    } else {
      this.list.forEach(x => x.selected = true)
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

  async init() {
    this.page_num=1;
    this.ListNode.nativeElement.scrollTop=0;
    this.list = await this.ComicsListV2.init(this.key, { page_num: this.page_num});
  }
  async overflow() {
    this.zone.run(() => {

      setTimeout(async () => {
        const node = this.ListNode.nativeElement.querySelector(`[index='${this.list.length - 1}']`)
        if (this.ListNode.nativeElement.clientHeight < node.getBoundingClientRect().y) {

        } else {
          await this.add_pages();
          this.overflow();
        }
      })
    })
  }
  scroll$ = new Subject();
  getData() {
    if (this.list.length) {
      this.add_pages();
    } else {
      setTimeout(() => {
        this.getData()
      }, 10)
    }
  }
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
    this.scroll$.unsubscribe();
  }
  async add_pages() {
    this.page_num++;
    const list = await this.ComicsListV2.add(this.key, { page_num: this.page_num, page_size: this.page_size })
    if (list.length == 0) {
      this.page_num--;
      return
    }
    this.list = [...this.list, ...list]
  }
}
