import { Component, NgZone } from '@angular/core';
import { Observable, Subject, throttleTime } from 'rxjs';
import { CurrentDetailService } from '../../services/current.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent {
  images = [];
  img = "";
  top = "";
  left = "";

  isClose = false;
  enter$ = new Subject<{ $event: PointerEvent, data: any }>();
  afterInit$ = null;

  constructor(
    public current: CurrentDetailService,
    private zone: NgZone,
  ) {
    this.init();
    this.afterInit$ = this.current.afterInit().subscribe(comics => {
      this.init();
    })
    this.enter$.pipe(throttleTime(50)).subscribe(x => {
      const { $event, data } = x;
      const image = data.src
      this.img = image;
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const width = (img.width / img.height) * 180;
        const node = $event.target as any;
        const position = node.getBoundingClientRect();
        this.left = `${position.left - (width / 2) + 4}px`;
        if ((position.left - (width / 2) + 4) < 0) this.left = `${0}px`;
        this.top = `${position.top - 180}px`;
      }
    })
  }
  async init() {
    try {
      if (!this.current.comics) return
      // this.img = this.current.comics.chapters[0].images[0].src;
      const index = this.current.comics.chapters.findIndex(x => x.id == this.current.comics.chapter.id);
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
          if (this.isClose) return
          if (!x.thumbnail) {

            // this.images[i].src = (await this.cache.getBlobImageHtml(x.src));
            let x = await this.createThumbnailImage(this.images[i].src)
            this.images[i].thumbnail = x;
            const cache = await caches.open('image');
            const imageSrc = `${window.location.origin}/chapter_thumbnail/${this.current.comics.chapters[index].id}`;
            const request = new Request(imageSrc);
            const data = new Blob([JSON.stringify(this.images.map(x => ({ id: x.id, thumbnail: x.thumbnail })))], { type: 'application/json' })
            const response = new Response(data)
            cache.put(request, response);
          }

        }
      } else {
        this.images = this.current.comics.chapters[index].images;
        for (let i = 0; i < this.images.length; i++) {
          const x = this.images[i];
          if (this.isClose) return
          if (!x.thumbnail) {
            // this.images[i].src = (await this.cache.getBlobImageHtml(x.src));
            let x = await this.createThumbnailImage(this.images[i].src)
            this.images[i].thumbnail = x;
            const cache = await caches.open('image');
            const imageSrc = `${window.location.origin}/chapter_thumbnail/${this.current.comics.chapters[index].id}`;
            const request = new Request(imageSrc);
            const data = new Blob([JSON.stringify(this.images.map(x => ({ id: x.id, thumbnail: x.thumbnail })))], { type: 'application/json' })
            const response = new Response(data)
            cache.put(request, response);
          }

        }
      }
    } catch (error) {

    }
  }
  on(e, index: number) {
    const chapter = this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id)
    this.current.onThumbnailItemClick$.next({
      event$: e, data: {
        ...chapter,
        index: index
      }
    })
  }

  createThumbnailImage(href) {
    return new Promise((r, j) => {
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
        r(dataURL)
        j(dataURL)
      }
    })
  }
  async enter($event, data) {
    this.enter$.next({ $event, data })
  }
  leave($event) {
    this.left = `1000%`;
    this.top = `1000%`;
    this.img = null;
  }
  ngOnDestroy() {
    this.isClose = true;
    this.afterInit$.unsubscribe();
    this.enter$.unsubscribe();
  }
  one(e){

  }
}
