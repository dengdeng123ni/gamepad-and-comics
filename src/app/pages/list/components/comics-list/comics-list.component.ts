import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, map, throttleTime } from 'rxjs';
import { ContextMenuEventService, QueryControllerService,WebFileService } from 'src/app/library/public-api';
declare const window: any;
interface Item {
  id: string | number,
  cover: string,
  title: string,
  subTitle: string,
  index?: number,
  selected?: boolean,
  tags?: Array<string>
}
@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})

export class ComicsListComponent {
  @Input() key: string = '';
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
  @ViewChild('list') ListNode: ElementRef;
  _ctrl = false;
  page_num = 1;
  page_size = 20;
  is_destroy=false;
  constructor(
    public data: DataService,
    public current: CurrentService,
    public ContextMenuEvent: ContextMenuEventService,
    public router: Router,
    public WebFile: WebFileService,
    private zone: NgZone,
    public QueryController: QueryControllerService,
    public route: ActivatedRoute,
  ) {

    ContextMenuEvent.register('comics_item', {
      on: async (e: any) => {
        const index = this.data.list.findIndex(x => x.id.toString() == e.value.toString());
        if (this.data.list.filter(x => x.selected).length == 0) {
          this.data.list[index].selected = !this.data.list[index].selected;
        }
        const list = this.data.list.filter(x => x.selected)
        e.click(list)
      }
    })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {

      if (this.key) this.init();
    })
  }
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("id") == 'comics_list') {
      this.data.list.forEach(x => x.selected = false)
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
      const data = this.data.list[index]
      if (this.data.is_edit || this._ctrl) {
        this.data.list[index].selected = !this.data.list[index].selected;
      } else {
        localStorage.setItem('list_url', window.location.href)
        const nodec: any = $event.target
        if (nodec.getAttribute("router_reader")) {
          // this.current.routerReader(data.id)
        } else {
          this.router.navigate(['/detail', data.id]);
        }
      }

    }
  }

  selectedAll() {
    const bool = this.data.list.filter(x => x.selected == true).length == this.data.list.length;
    if (bool) {
      this.data.list.forEach(x => x.selected = false)
    } else {
      this.data.list.forEach(x => x.selected = true)
    }
  }



  ngAfterViewInit() {
    this.ListNode.nativeElement.addEventListener('scroll', (e: any) => {
      this.scroll$.next(e)
    }, true)
    this.scroll$.pipe(throttleTime(300)).subscribe(e => {
      this.handleScroll(e);
    })
    this.page_size = 20;
    this.init();
  }
  async init() {

    this.zone.run(async () => {

      this.data.list = [];
      this.data.list = await this.QueryController.init(this.key, { page_num: this.page_num, page_size: this.page_size });
      this.overflow();
    })

  }
  async overflow() {
    this.zone.run(() => {

      setTimeout(async () => {
        const node = this.ListNode.nativeElement.querySelector(`[index='${this.data.list.length - 1}']`)
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
    if (this.data.list.length) {
      this.add_pages();
    } else {
      setTimeout(() => {
        this.getData()
      }, 10)
    }
  }
  async handleScroll(e: any) {
    const node: any = document.querySelector("app-comics-list");
    let scrollHeight = Math.max(node.scrollHeight, node.scrollHeight);
    let scrollTop = e.target.scrollTop;
    let clientHeight = node.innerHeight || Math.min(node.clientHeight, node.clientHeight);
    if (clientHeight + scrollTop + 50 >= scrollHeight) {
      await this.add_pages();
    }
  }
  ngOnDestroy() {
    this.is_destroy=true;
    this.scroll$.unsubscribe();
  }
  async add_pages() {
    if(this.is_destroy) return
    this.page_num++;
    const list = await this.QueryController.add(this.key, { page_num: this.page_num, page_size: this.page_size })
    if (list.length == 0) {
      this.page_num--;
      return
    }
    this.data.list = [...this.data.list, ...list]
  }
}
