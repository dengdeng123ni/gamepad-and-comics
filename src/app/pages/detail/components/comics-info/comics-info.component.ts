import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ContextMenuEventService, ImageService, RoutingControllerService } from 'src/app/library/public-api';
interface Info {
  cover: string,
  title: string,
  author?: string,
  intro?: string
}
@Component({
  selector: 'app-comics-info',
  templateUrl: './comics-info.component.html',
  styleUrls: ['./comics-info.component.scss']
})
export class ComicsInfoComponent {
  info = null;
  tags = [];
  @ViewChild('node_continue') node_continue!: ElementRef;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public ContextMenuEvent: ContextMenuEventService,
    public image: ImageService,
    public RoutingController: RoutingControllerService,
  ) {
    ContextMenuEvent.register('chapters_text', {
      on: async (e: any) => {
        e.click(e.value)
      },
      menu: [
        {
          id: "open_href",
          name: "打开链接",
          click: e => {
            console.log(e);
            if (e) window.open(e, '_blank')
            // console.log(e.srcElement.getAttribute('href'));

          }
        }
      ]
    })
    this.info = this.data.details;
    // console.log(this.info.tags);
    this.init();
  }
  async init() {
    const { width, height } = await this.getCoverImageHW(this.info.cover)
    this.info.width = width;
    this.info.height = height;
  }

  on(e) {
    if (e.router) {
      this.router.navigate(['/query', 'advanced_search', 'ehentai', e.router[0]], {
        queryParams: {
          _gh_condition: window.btoa(encodeURIComponent(JSON.stringify(e.router[1]))),
        }
      });
    } else {
      if (e.href) window.open(e.href, '_blank')
    }



  }
  back() {
    this.RoutingController.navigate('list')
    // let url = localStorage.getItem('list_url');
    // if (!url) url = window.location.origin
    // const urlObj = new URL(url);
    // let arr = [...urlObj.pathname.split("/")];
    // arr.shift()
    // this.router.navigate(['/', ...arr])
  }
  continue() {
    this.current.routerReader(this.data.comics_id, this.data.chapter_id)
  }
  ngAfterViewInit() {
    // this.node_continue.nativeElement.focus();
  }

  async getCoverImageHW(src) {
    const utf8_to_b64 = (str: string) => {
      return window.btoa(encodeURIComponent(str));
    }
    const id = utf8_to_b64(src);
    const res = await this.current._getImageHW(id)

    if (res) {
      return { width: res.width, height: res.height }
    } else {
      const url = await this.image.getImageToLocalUrl(src);
      const loadImage = async (url: string) => {
        return await await createImageBitmap(await fetch(url).then((r) => r.blob()))
      }
      const img = await loadImage(url.changingThisBreaksApplicationSecurity);
      this.current._setImageHW(id, { width: img.width, height: img.height })
      return { width: img.width, height: img.height }
    }

  }


}
