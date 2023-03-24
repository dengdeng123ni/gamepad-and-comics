import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { ThumbnailBottomService } from './thumbnail-bottom.service';

@Component({
  selector: 'app-thumbnail-bottom',
  templateUrl: './thumbnail-bottom.component.html',
  styleUrls: ['./thumbnail-bottom.component.scss']
})
export class ThumbnailBottomComponent {
  images = [];
  img = "";
  left = `1000%`;
  top = `1000%`;


  chapter_index = -1;
  constructor(
    public current: CurrentReaderService,
    public ThumbnailBottom:ThumbnailBottomService,
    public GamepadController:GamepadControllerService,
    public GamepadEvent:GamepadEventService,
    private zone: NgZone,

  ) {

    ({ index:this.chapter_index } = this.current.comics.chapter);
    // this.current.afterInit$.subscribe(async comics => {
      GamepadEvent.registerHoverEvent("thumbnail_bottom", {
        ENTER: e => {
          const id=parseInt(e.getAttribute("id"))
          const data=this.images.find(x=>x.id==id)
          this.enter(e,data)
        },
        LEAVE: e => {
          const id=parseInt(e.getAttribute("id"))
          this.leave(e);
        }
      })
      GamepadEvent.registerAreaEvent("thumbnail_bottom", {
        "B": () => this.ThumbnailBottom.close(),
        // LEFT_BUMPER:()=>{
        //    this.GamepadController.setCurrentTarget("LEFT")
        // },
        // RIGHT_BUMPER:()=>{
        //   this.GamepadController.setCurrentTarget("RIGHT")
        // },
        // LEFT_TRIGGER:()=>{
        //   this.GamepadController.setCurrentTargetId(`thumbnail_bottom_${0}`)
        // },
        // RIGHT_TRIGGER:()=>{
        //   this.GamepadController.setCurrentTargetId(`thumbnail_bottom_${current.comics.chapter.total-1}`)
        // },
      })

    // })
    this.init();
  }
  async init(){
    this.img = this.current.comics.chapters[0].images[0].src;
    const index = this.current.comics.chapters.findIndex(x=>x.id==this.current.comics.chapter.id);
    const cache = await caches.open('image');
    const response = await cache.match(`${window.location.origin}/chapter_thumbnail/${this.current.comics.chapters[index].id}`)
    if (response) {
      const blob = await response.blob()
      const text = await blob.text()
      const images = JSON.parse(text);
      this.current.comics.chapters[index].images.forEach(x => {
        const obj = images.find(s => s.id == x.id)
        if (obj) (x as any).thumbnail = obj.thumbnail
      })
      this.images = this.current.comics.chapters[index].images;
      for (let i = 0; i < this.images.length; i++) {
        const x = this.images[i];
        if (!x.thumbnail) {
          // this.images[i].src = (await this.cache.getBlobImageHtml(x.src));
          this.createThumbnailImage(this.images[i].src).subscribe(async x => {
            this.images[i].thumbnail = x;
            if (this.images.filter(x => x.thumbnail).length == this.images.length) {
              const cache = await caches.open('image');
              const imageSrc = `${window.location.origin}/chapter_thumbnail/${this.current.comics.chapters[index].id}`;
              const request = new Request(imageSrc);
              const data = new Blob([JSON.stringify(this.images.map(x => ({ id: x.id, thumbnail: x.thumbnail })))], { type: 'application/json' })
              const response = new Response(data)
              cache.put(request, response);
            }
          })
        }

      }
    } else {
      this.images = this.current.comics.chapters[index].images;
      for (let i = 0; i < this.images.length; i++) {
        const x = this.images[i];
        if (!x.thumbnail) {
          // this.images[i].src = (await this.cache.getBlobImageHtml(x.src));
          this.createThumbnailImage(this.images[i].src).subscribe(async x => {
            this.images[i].thumbnail = x;
            if (this.images.filter(x => x.thumbnail).length == this.images.length) {
              const cache = await caches.open('image');
              const imageSrc = `${window.location.origin}/chapter_thumbnail/${this.current.comics.chapters[index].id}`;
              const request = new Request(imageSrc);
              const data = new Blob([JSON.stringify(this.images.map(x => ({ id: x.id, thumbnail: x.thumbnail })))], { type: 'application/json' })
              const response = new Response(data)
              cache.put(request, response);
            }
          })
        }

      }
    }
  }
  on(e, index: number) {
    this.current.pageChange(index)
  }

  createThumbnailImage(href) {
    return new Observable(obs => {
      const image1 = new Image();
      image1.src = href;
      image1.setAttribute("crossOrigin", 'Anonymous')
      image1.onload = () => {
        let canvas = document.createElement('canvas');
        const height = 30;
        const width = (image1.width / (image1.height / height))
        canvas.width = 8;
        canvas.height = height;
        let context = canvas.getContext('2d');
        context.rect(0, 0, width, height);
        context.drawImage(image1, -((width + canvas.width) / 2), 0, width, height,);
        let dataURL = canvas.toDataURL("image/png", 0.8);
        obs.next(dataURL);
        obs.complete();
      }
    })
  }
  async enter(node, data) {
    const image = data.src;
    this.img = image;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const width = (img.width / img.height) * 180;
      const position = node.getBoundingClientRect();
      this.left = `${position.left - (width / 2) + 4}px`;
      if((position.left - (width / 2) + 4)<0) this.left=`${0}px`;
      this.top = `${position.top - 180}px`;
      document.body.appendChild(document.querySelector("#thumbnail_image"))
    }
  }
  leave($event) {
    this.left = `1000%`;
    this.top = `1000%`;
    this.img = null;
  }
  ngOnDestroy(){
    document.querySelector("#thumbnail_image").remove();
  }
}
