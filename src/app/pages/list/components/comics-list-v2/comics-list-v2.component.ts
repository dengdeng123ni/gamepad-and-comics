import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { throttleTime, Subject } from 'rxjs';
import { ContextMenuEventService } from 'src/app/library/public-api';
import { WebFileService } from 'src/app/library/web-file/web-file.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { DownloadOptionService } from '../download-option/download-option.service';
declare const window: any;
declare const Swiper: any;
@Component({
  selector: 'app-comics-list-v2',
  templateUrl: './comics-list-v2.component.html',
  styleUrls: ['./comics-list-v2.component.scss']
})
export class ComicsListV2Component {
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
    public DownloadOption: DownloadOptionService
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
        this.DownloadOption.open(list);


        // WebFile.downloadComics(e.value)
        // ,{type:'PDF'}
      },
      menu: [
        { name: "下载", id: "thumbnail" },
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
        this.router.navigate(['/detail', data.id]);
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


  change$=null;
  lists=[];
  ngAfterViewInit() {

    var swiper = new Swiper(".mySwiper", {
      pagination: {
        el: ".swiper-pagination",
      },
    });
    window.comics_query_option.page_size = 32;
    window.comics_query_option.page_num = 1;

    this.change$ = this.current.change().subscribe((x: any) => {

      const count=16;
      const o = Math.ceil(this.data.list.length / count);
      for (let i = 0; i < o; i++) {
        const e = this.data.list.slice(i * count, (i + 1) * count);
        this.lists.push(e)
      }

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
