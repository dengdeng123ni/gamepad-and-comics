import { Injectable } from '@angular/core';
import { DbControllerService } from '../public-api';
import { ImageToEventService } from './image-to-event.service';

@Injectable({
  providedIn: 'root'
})
export class ImageToControllerService {
  _data = {};
  caches = null;
  constructor(
    public DbController: DbControllerService,
    public ImageToEvent: ImageToEventService
  ) {
    this.init();

  }

  async comicsTo(comics_id, to_id) {
    const detail = await this.DbController.getDetail(comics_id)
    for (let index = 0; index < detail.chapters.length; index++) {
      const x = detail.chapters[index];
      await this.chapterTo(x.id, to_id)
    }
  }


  async chapterTo(chapter_id, to_id) {
    const pages = await this.DbController.getPages(chapter_id)
    for (let index = 0; index < pages.length; index++) {
      const x = pages[index];
      const blob = await this.pageTo(x.src, to_id);
      const response = new Response(blob);
      const request = new Request(`${x.src}?to_id=${to_id}`);
      await this.caches.put(request, response);
    }
  }
  async init() {
    this.caches = await caches.open('image');
  }

  async pageTo(url, to_id) {
    const res = await caches.match(`${url}?to_id=${to_id}`);
    if (res) {
     return await res.blob()
    }else{
      const blob = await this.DbController.getImage(url);
      return await this.ImageToEvent._data[to_id].event(blob)
    }
  }

}

