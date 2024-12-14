import { Injectable } from '@angular/core';
import { DbControllerService, HistoryService, IndexdbControllerService, PagesItem } from 'src/app/library/public-api';
import { DataService } from './data.service';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  private _chapters: any = {};
  private _chapters_IsFirstPageCover: any = {};
  public init$ = new Subject<any>();
  public source;
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: IndexdbControllerService,
    public router: Router,
    public history: HistoryService
  ) { }
  public init() {
    return this.init$
  }
  async _init(source, comic_id: string) {
    this.source=source;
    this.data.is_init_free = false;
    this.data.comics_id = comic_id;
    const _res = await Promise.all([this.DbController.getDetail(comic_id, { source: source }), this._getWebDbComicsConfig(comic_id)])
    const res = _res[0];
    this.data.comics_config = _res[1];
    if (this.data.is_local_record) {
      this.data.chapters = res.chapters;
      const chapters = await this._getChapterRead(this.data.comics_id);
      const index = await this._getComicsRead(this.data.comics_id);
      for (let index = 0; index < this.data.chapters.length; index++) {
        if (chapters[index]) this.data.chapters[index].read = chapters[index].read;
        else this.data.chapters[index].read = 0;
      }
      this.data.chapter_id = this.data.chapters[index].id;
    } else {
      this.data.chapters = res.chapters;
      this.data.chapter_id = this.data.details.chapter_id;
    }
    delete res.chapters;
    if (this.data.chapters.length && this.data.chapters[0]) {
      if (this.data.chapters[0].cover) this.data.chapter_config.is_cover_exist = true;
    }

    this.data.details = res;
    this.data.is_init_free = true;
    this.init$.next(this.data)
    this.history.update({
      id: comic_id,
      title: this.data.details.title,
      cover: this.data.details.cover,
      href:this.data.details.href
    })
  }


  async close() {
    this.data.is_init_free = false;
  }

  async _getWebDbComicsConfig(id: string) {

    const res: any = await this.webDb.getByKey("comics_config", id.toString())
    if (res) {
      return { ...this.data.comics_config, ...res }
    } else {
      return this.data.comics_config
    }
  }

  async _delChapter(comic_id:any,chapter_id: string) {
    let detail = await this.DbController.getDetail(comic_id, { source: this.source })
    detail.chapters = detail.chapters.filter(x => x.id.toString() !== chapter_id.toString());
    await this.DbController.putWebDbDetail(comic_id, detail);
  }
  async _getChapter(id: string): Promise<Array<PagesItem>> {
    // let list = [];
    // if (this._chapters[id]) {
    //   list = this._chapters[id]
    // } else {
    //   list = ;
    //   this._chapters[id] = list;
    // }
    const c = await this.DbController.getPages(id, { source: this.source })
    setTimeout(() => {
      this.DbController.loadPages(id, { source: this.source })
    }, 1000)
    return c
  }







  async _delPage(chapter_id: string, page_index: number) {
    let pages = await this.DbController.getPages(chapter_id, { source: this.source })
    pages.splice(page_index, 1)
    await this.DbController.putWebDbPages(chapter_id, pages)
  }
  async _addPage(chapter_id: string, page_index: number, blob: Blob) {
    let pages = await this.DbController.getPages(chapter_id, { source: this.source })
    let c = `http://localhost:7700/chapter/insert_page/${page_index}_${new Date().getTime()}`
    await this.DbController.addImage(c, blob)
    pages.splice(page_index, 0, {
      id: `${page_index}_${new Date().getTime()}`,
      src: c,
      width: 0,
      height: 0
    })
    await this.DbController.putWebDbPages(chapter_id, pages)
  }
  async _insertWhitePage(chapter_id: string, page_index: number) {
    let pages = await this.DbController.getPages(chapter_id, { source: this.source })
    const blob = await this.DbController.getImage(pages[page_index].src, { source: this.source });
    const blob2 = await this.getImageBase64(blob);
    await this._addPage(chapter_id, page_index, blob2)
  }
  async _insertPage(chapter_id: string, page_index: number) {
    const blob2 = await this._getFileImage();
    if (blob2) {
      await this._addPage(chapter_id, page_index, blob2)
    }

  }
  async _getFileImage() {
    const pickerOpts = {
      types: [
        {
          description: "Images",
          accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };

    // 打开文件选择器
    const [fileHandle] = await (window as any).showOpenFilePicker(pickerOpts);
    // 获取文件内容
    const fileData = await fileHandle.getFile();
    return fileData
  }
  async _separatePage(chapter_id: string, page_index: number) {
    let pages = await this.DbController.getPages(chapter_id, { source: this.source })
    const blob = await this.DbController.getImage(pages[page_index].src, { source: this.source });
    const image1 = await createImageBitmap(blob);
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
    let c1 = `http://localhost:7700/chapter/insert_page/${page_index}_1_${new Date().getTime()}`
    let c2 = `http://localhost:7700/chapter/insert_page/${page_index}_2_${new Date().getTime()}`
    await this.DbController.addImage(c1, this.base64ToBlob(dataURL1))
    await this.DbController.addImage(c2, this.base64ToBlob(dataURL2))
    pages.splice(page_index, 0, {
      id: `${page_index}_1_${new Date().getTime()}`,
      src: c2,
      width: 0,
      height: 0
    })
    pages.splice(page_index + 1, 0, {
      id: `${page_index}_2_${new Date().getTime()}`,
      src: c1,
      width: 0,
      height: 0
    })
    pages.splice(page_index + 2, 1)
    await this.DbController.putWebDbPages(chapter_id, pages)
  }

  async _mergePage(chapter_id: string, page_index1: number, page_index2: number) {
    let pages = await this.DbController.getPages(chapter_id, { source: this.source })
    const blob1 = await this.DbController.getImage(pages[page_index1].src, { source: this.source });
    const blob2 = await this.DbController.getImage(pages[page_index2].src, { source: this.source });
    const blob = await this.mergePage([blob1, blob2].reverse());
    let c = `http://localhost:7700/chapter/insert_page/${page_index1}_${page_index2}_${new Date().getTime()}`
    await this.DbController.addImage(c, blob)
    pages.splice(page_index1, 0, {
      id: `${page_index1}_${page_index2}_${new Date().getTime()}`,
      src: c,
      width: 0,
      height: 0
    })
    pages.splice(page_index1 + 1, 1)
    pages.splice(page_index2, 1)
    await this.DbController.putWebDbPages(chapter_id, pages)
  }

  base64ToBlob = (data) => {
    var parts = data.split(';base64,'),
      contentType = parts[0].split(':')[1],
      raw = window.atob(parts[1]),
      length = raw.length,
      arr = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
      arr[i] = raw.charCodeAt(i);
    }
    var blob1 = new Blob([arr], { type: contentType });
    return blob1
  };
  getImageBase64 = async (blob) => {
    const image1 = await createImageBitmap(blob);
    let canvas = document.createElement('canvas');
    canvas.width = image1.width;
    canvas.height = image1.height;
    let context = canvas.getContext('2d');
    context.drawImage(image1, 0, 0, image1.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    let dataURL = canvas.toDataURL("image/png", 0.1);
    return this.base64ToBlob(dataURL)
  }

  async mergePage(blobs) {
    const image1 = await createImageBitmap(blobs[0]);
    const image2 = await createImageBitmap(blobs[1]);
    let canvas = document.createElement('canvas');
    canvas.width = image1.width + image2.width;
    canvas.height = (image1.height + image2.height) / 2;
    let context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
    context.drawImage(image1, 0, 0, (image1.width / image1.height) * canvas.height, canvas.height);
    context.drawImage(image2, (image1.width / image1.height) * canvas.height, 0, (image2.width / image2.height) * canvas.height, canvas.height);
    let dataURL = canvas.toDataURL("image/png", 1);
    return this.base64ToBlob(dataURL)
  }



  async _getChapterFirstPageCover(chapter_id: string) {
    return await this.webDb.getByKey("chapter_first_page_cover", chapter_id.toString())
  }
  async _setChapterFirstPageCover(chapter_id: string, is_first_page_cover: boolean) {
    await this.webDb.update("chapter_first_page_cover", { 'chapter_id': chapter_id.toString(), "is_first_page_cover": is_first_page_cover })
  }
  async _delChapterFirstPageCover(chapter_id: string) {
    await this.webDb.deleteByKey("chapter_first_page_cover", chapter_id.toString())
  }

  async _updateChapterRead(chapter_id: string) {
    const index = this.data.chapters.findIndex(x => x.id.toString() == chapter_id.toString())
    if (index <= -1) return
    this.data.chapters[index].read = 1;
    const chapters = this.data.chapters.map(x => ({ id: x.id, read: x.read }))
    await this.webDb.update("read_comics_chapter", { 'comics_id': this.data.comics_id.toString(), chapters: chapters })
    await this.webDb.update("last_read_comics", { 'comics_id': this.data.comics_id.toString(), chapter_id: this.data.chapters[index].id })
  }

  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await this.webDb.getByKey("last_read_chapter_page", id.toString())
    if (res) {
      return res.page_index
    } else {
      return 0
    }
  }
  async _chapterPageChange(chapter_id: string, page_index: number) {
    await this._setChapterIndex(chapter_id, page_index)

    this.routerReader(this.data.comics_id, chapter_id)

  }
  async _getChapterRead(id: string) {
    const res: any = await this.webDb.getByKey("read_comics_chapter", id.toString())
    if (res) {
      return res.chapters
    } else {
      return this.data.chapters.map(x => ({ id: x.id, read: 0 }))
    }
  }
  async _getComicsRead(comics_id: string) {
    const res: any = await this.webDb.getByKey("read_novels", comics_id.toString())
    if (res) {
      return res.index
    } else {
      return 0
    }
  }
  async _getImageHW(id) {
    const res: any = await this.webDb.getByKey("imageHW", id)

    if (res) {
      return {
        width: res.width,
        height: res.height
      }
    } else {
      return null
    }
  }
  async _setImageHW(id, option: {
    width: number,
    height: number
  }) {
    await this.webDb.update("imageHW", { 'id': id, ...option })
  }

  async _setChapterIndex(id: string, index: number) {
    await this.webDb.update("last_read_chapter_page", { 'chapter_id': id.toString(), "page_index": index })
  }
  async _getChapter_IsFirstPageCover(id: string): Promise<boolean> {
    if (this._chapters_IsFirstPageCover[id]) {
      return this._chapters_IsFirstPageCover[id]
    } else {
      const pages = await this._getChapter(id)
      const is_first_page_cover = await this._getIsFirstPageCover(pages);
      this._chapters_IsFirstPageCover[id] = is_first_page_cover;
      return is_first_page_cover
    }
  }
  async _getIsFirstPageCover(pages: Array<PagesItem>): Promise<boolean> {
    try {
      const getImagePixel = async (url: string) => {
        const loadImage = async (url: string) => {
          return await createImageBitmap(await fetch(url).then((r) => r.blob()))
        }
        const img = await loadImage(url);
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let context: any = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);
        const left = context.getImageData(0, 0, 1, canvas.height).data;
        const right = context.getImageData(canvas.width - 1, 0, 1, canvas.height).data;
        let is_left_white = true;
        let is_right_white = true;
        for (let index = 0; index < left.length; index++) {
          if (left[index] <= 200) {
            is_left_white = false;
            continue;
          }
        }
        for (let index = 0; index < right.length; index++) {
          if (right[index] <= 200) {
            is_right_white = false;
            continue;
          }
        }
        return {
          left,
          right,
          x0: left.slice(0, 3),
          x1: right.slice(0, 3),
          y0: left.slice(left.length - 3, left.length),
          y1: right.slice(right.length - 3, right.length),
          is_left_white,
          is_right_white,
          width: img.width,
          height: img.height
        }
      }
      let bool = true
      const image1 = await getImagePixel(pages[0].src);
      if (image1.is_right_white && !image1.is_left_white) {
        bool = true;
      } else {
        const image2 = await getImagePixel(pages[1].src);
        if (this.deltaE(image1.x0, image2.x1) < 5 && this.deltaE(image1.y0, image2.y1) < 5) {
          bool = false
        } else {
          if (!image1.is_left_white && !image1.is_right_white) {
            bool = false;
          } else {
            bool = true;
          }
        }
      }
      return bool
    } catch (error) {
      return true
    }
  }
  async _getIsLastPageCover(pages: Array<PagesItem>): Promise<boolean> {
    try {
      const getImagePixel = async (url: string) => {
        const loadImage = async (url: string) => {
          return await createImageBitmap(await fetch(url).then((r) => r.blob()))
        }
        const img = await loadImage(url);
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let context: any = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);
        const left = context.getImageData(0, 0, 1, canvas.height).data;
        const right = context.getImageData(canvas.width - 1, 0, 1, canvas.height).data;
        let is_left_white = true;
        let is_right_white = true;
        for (let index = 0; index < left.length; index++) {
          if (left[index] <= 200) {
            is_left_white = false;
            continue;
          }
        }
        for (let index = 0; index < right.length; index++) {
          if (right[index] <= 200) {
            is_right_white = false;
            continue;
          }
        }
        return {
          left,
          right,
          x0: left.slice(0, 3),
          x1: right.slice(0, 3),
          y0: left.slice(left.length - 3, left.length),
          y1: left.slice(right.length - 3, right.length),
          is_left_white,
          is_right_white,
          width: img.width,
          height: img.height
        }
      }
      let bool = true
      const image1 = await getImagePixel(pages[0].src);
      if (image1.is_right_white && !image1.is_left_white) {
        bool = true;
      } else {
        const image2 = await getImagePixel(pages[1].src);
        if (this.deltaE(image1.x1, image2.x0) < 5 && this.deltaE(image1.y1, image2.y0) < 5) {
          bool = true
        } else {
          bool = false;
        }
      }
      return bool
    } catch (error) {
      return true
    }
  }
  deltaE(rgbA: number[], rgbB: number[]) {
    let labA = this.rgb2lab(rgbA);
    let labB = this.rgb2lab(rgbB);
    let deltaL = labA[0] - labB[0];
    let deltaA = labA[1] - labB[1];
    let deltaB = labA[2] - labB[2];
    let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    let deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    let sc = 1.0 + 0.045 * c1;
    let sh = 1.0 + 0.015 * c1;
    let deltaLKlsl = deltaL / (1.0);
    let deltaCkcsc = deltaC / (sc);
    let deltaHkhsh = deltaH / (sh);
    let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }
  rgb2lab(rgb: number[]) {
    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
    y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
    z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
  }

  async routerReader(comics_id,chapter_id) {
    this.router.navigate(['/novels',this.source, comics_id, chapter_id])
  }
}
