import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenuEventService, GamepadEventService, GamepadControllerService, I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { ZipService } from '../../services/zip.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'bilibili-mode1',
  templateUrl: './bilibili-mode1.component.html',
  styleUrls: ['./bilibili-mode1.component.scss']
})
export class BilibiliMode1Component {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = true;
    if (event.key == "Control") this._ctrl = true;
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = false;
    if (event.key == "Control") this._ctrl = false;
  }
  _ctrl = false;
  selectedList = [];
  edit$ = null;
  list = [];
  constructor(
    public current: CurrentListService,
    public ContextMenuEvent: ContextMenuEventService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public http: HttpClient,
    public zip: ZipService,
    public config: ConfigListService,
    public i18n: I18nService,
    public router: Router,
  ) {

    GamepadEvent.registerAreaEvent("list_toolabr_item", {
      B: () => {
      }
    })
    GamepadEvent.registerAreaEvent("list_mode_item", {
      B: () => {
      }
    })
    ContextMenuEvent.register('item', {
      on: e => {
        let selectedList = [];
        if (this.selectedList.length) {
          selectedList = this.selectedList;
        } else {
          const id = parseInt(e.value);
          selectedList = this.current.list.filter(x => x.id == id);
        }
        if (e.id == "delete") {
          selectedList.forEach(x => this.current.delete(x.id))
        } else if (e.id == "github_pages") {

        }
      },
      menu: [
        // { name: "Github Pages", id: "github_pages" },
        { name: "delete", id: "delete" },
      ]
    })
    this.edit$ = this.current.edit().subscribe(x => {
      if (x) {
        setTimeout(() => {
          GamepadController.setCurrentTargetId('select_all')
        })
      } else {
        this.close();
      }
    })
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.init();
    }, 3000)
  }
  async init() {
    const b: any = await this.getList();
    // console.log(;);

    const json = await b.json();

    this.list=json.data.map(x => ({ id: x.id, cover: {src:x.vcover}, title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` }));

  }
  ngAfterViewInit() {
    const node = document.querySelector("#list");
    if (node) node.scrollTop = this.config.view.scrollTop;
  }

  ngOnDestroy() {
    this.edit$.unsubscribe();
    this.close();
    const node = document.querySelector("#list");
    this.config.view.scrollTop = node.scrollTop;
  }
  ngDoCheck(): void {
    this.selectedList = this.current.list.filter(x => x.selected == true)
  }
  on($event, x) {
    if (this.config.edit) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this.config.edit) return
    if (this._ctrl) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this._ctrl) return
    this.router.navigate(['/bilibili_detail', x.id])
    this.config.view.id = x.id;
  }
  on_keep_watching($event, x) {
    $event.stopPropagation();
    if (this.config.edit) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this.config.edit) return
    if (this._ctrl) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this._ctrl) return
    this.current.continue(x.id);
    this.config.view.id = x.id;
  }
  close() {
    if (this.config.edit) return
    if (this._ctrl) return
    this.current.list.forEach(x => x.selected = false)
  }

  getList() {
    // this.http.post("https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite",{
    //   page_num:1,
    //   page_size:100,
    //   order:1,
    //   wait_free:0
    // }).subscribe(x=>{
    //   console.log(x);

    // })

    return new Promise((r, j) => {


      window.addEventListener("message", function (event) {
        if (event.data.type == "proxy_response") {
          let rsponse = event.data.data;
          const readableStream = new ReadableStream({
            start(controller) {
              for (const data of rsponse.body) {
                controller.enqueue(Uint8Array.from(data));
              }
              controller.close();
            },
          });
          delete rsponse.body;
          const headers = new Headers();
          rsponse.headers.forEach(x => {
            headers.append(x.name, x.value);
          })
          rsponse.headers = headers;
          // readableStream.json()
          r(new Response(readableStream, rsponse))
        }
      }, false);
      window.postMessage({
        type: "website_proxy_request",
        proxy_request_website_url: "https://manga.bilibili.com/",
        proxy_response_website_url: "http://localhost:3200/",
        http: {
          url: "https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite",
          option: {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": JSON.stringify({ page_num: 1, page_size: 100, order: 1, wait_free: 0 }),
            "method": "POST"
          }
        }
      }, '*')
    })

  }
}
// fetch("?device=pc&platform=web", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
//     "content-type": "application/json;charset=UTF-8",
//     "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Microsoft Edge\";v=\"114\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://manga.bilibili.com/account-center/my-favourite",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"\":2,\"\":100,\"\":2,\"\":0}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
// fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web", {
//   "body": "{\"comic_id\":25966}",
//   "method": "POST",
// });
