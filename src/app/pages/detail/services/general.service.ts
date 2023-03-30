import { Injectable } from '@angular/core';
import { CurrentDetailService } from './current.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public current: CurrentDetailService) {

  }

  async separatePage({ id, src }: { id: number, src: string }) {
    const comicsId = this.current.comics.id
    const chapterId = this.current.comics.chapter.id;
    const image1Id = id;
    const image1 = await this.createImage(src);
    let canvas1 = document.createElement('canvas');
    canvas1.width = (image1.width / 2);
    canvas1.height = image1.height;
    let context1 = canvas1.getContext('2d');
    context1.rect(0, 0, canvas1.width, canvas1.height);
    context1.drawImage(image1, 0, 0, image1.width, image1.height, 0, 0, image1.width, image1.height);
    let canvas2 = document.createElement('canvas');
    canvas2.width = (image1.width / 2);
    canvas2.height = image1.height;
    let context2 = canvas2.getContext('2d');
    context2.rect(0, 0, canvas2.width, canvas2.height);
    context2.drawImage(image1, canvas1.width, 0, image1.width, image1.height, 0, 0, image1.width, image1.height);
    let dataURL1 = canvas1.toDataURL("image/png");
    let dataURL2 = canvas2.toDataURL("image/png");
    await this.current.insertPage(comicsId, chapterId, image1Id, dataURL2)
    await this.current.insertPage(comicsId, chapterId, image1Id, dataURL1)
    await this.current.deletePage(comicsId, chapterId, image1Id);
  }
  async mergePage({ id, src, id2, src2 }: { id: number, src: string, id2: number, src2: string }) {
    const comicsId = this.current.comics.id
    const chapterId = this.current.comics.chapter.id;
    const image1Id = id;
    const image2Id = id2;
    const image1 = await this.createImage(src);
    const image2 = await this.createImage(src2);
    let canvas = document.createElement('canvas');
    canvas.width = image1.width + image2.width;
    canvas.height = (image1.height + image2.height) / 2;
    let context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
    context.drawImage(image1, 0, 0, image1.width, canvas.height);
    context.drawImage(image2, image1.width, 0, image2.width, canvas.height);
    let dataURL = canvas.toDataURL("image/png", 1);
    await this.current.insertPage(comicsId, chapterId, image1Id, dataURL)
    await this.current.deletePage(comicsId, chapterId, image1Id);
    await this.current.deletePage(comicsId, chapterId, image2Id);
  }
  createImage(src): any {
    if (!src) {
      return {
        width: 0,
        height: 0
      }
    }
    return new Promise((r, j) => {
      var img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.src = src;
      img.onload = function () {
        r(img)
        j(img)
      };
    })
  }
  previousChapterId(id: number) {
    const chapters = this.current.comics.chapters;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex - 1];
    if (chapter) {
      return chapter.id
    } else {
      return null
    }
  }
  nextChapterId(id: number) {
    const chapters = this.current.comics.chapters;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex + 1];
    if (chapter) {
      return chapter.id
    } else {
      return null
    }
  }
}
