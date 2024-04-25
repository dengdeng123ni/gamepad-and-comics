import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
import { Subject, throttleTime } from 'rxjs';
import { ContextMenuEventService } from 'src/app/library/public-api';
import { WebFileService } from 'src/app/library/web-file/web-file.service';
import { DownloadOptionService } from '../download-option/download-option.service';
import { LocalCachService } from '../menu/local-cach.service';
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
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "a" || this._ctrl) {
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
  _ctrl = false;
  constructor(public data: DataService,
    public current: CurrentService,
    public ContextMenuEvent: ContextMenuEventService,
    public router: Router,
    public WebFile: WebFileService,
    public DownloadOption: DownloadOptionService,
    public LocalCach: LocalCachService
  ) {

    ContextMenuEvent.register('comics_item', {
      open: () => {
        // this.close()
      },
      close: (e: any) => {

      },
      on: async (e: { value: string; id: string; }) => {
        const index = this.data.list.findIndex(x => x.id.toString() == e.value.toString());
        if (this.data.list.filter(x => x.selected).length == 0) {
          this.data.list[index].selected = !this.data.list[index].selected;
        }
        const list = this.data.list.filter(x => x.selected)

        this.LocalCach.save(list[0].id);


        // WebFile.downloadComics(e.value)
        // ,{type:'PDF'}
      },
      menu: [
        {
          name: "下载", id: "thumbnail", click: () => {

          }
        },
        {
          name: "缓存", id: "thumbnail", click: () => {

          }
        },
        // { name: "delete", id: "delete" },
      ]
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
        const nodec: any = $event.target
        if (nodec.getAttribute("router_reader")) {
          this.current.routerReader(data.id)
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
    const node: any = document.querySelector("#comics_list");
    node!.addEventListener('scroll', (e: any) => {
      this.scroll$.next(e)
    }, true)
    this.scroll$.pipe(throttleTime(300)).subscribe(e => {
      this.handleScroll(e);
    })
    const i_w = 172.8;
    const i_h = 276.8;
    let w2 = ((node.clientWidth - 32) / i_w);
    let h2 = (node.clientHeight / i_h);
    if (h2 < 1) h2 = 1;
    else h2 = h2 + 1;
    window.comics_query_option.page_size = Math.trunc(h2) * Math.trunc(w2);
    window.comics_query_option.page_num = 1;
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
    this.scroll$.unsubscribe();
  }
  async add_pages() {
    window.comics_query_option.page_num++;
    const list = await this.current.getList()
    if (list.length == 0) {
      window.comics_query_option.page_num--;
      return
    }
    this.data.list = [...this.data.list, ...list]
  }
}
