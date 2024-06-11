import { Injectable } from '@angular/core';
import { DbControllerService, HistoryService, PagesItem } from 'src/app/library/public-api';
import { DataService } from './data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  private _chapters: any = {};
  private _chapters_IsFirstPageCover: any = {};
  public init$ = new Subject<any>();

  private origin;
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: NgxIndexedDBService,
    public router: Router,
    public history: HistoryService
  ) { }
  public init() {
    return this.init$
  }
  async _init(origin, comic_id: string) {
    this.origin=origin;
    this.data.is_init_free = false;
    this.data.comics_id = comic_id;
    const _res = await Promise.all([this.DbController.getDetail(comic_id, { origin: origin }), this._getWebDbComicsConfig(comic_id)])
    const res = _res[0];
    this.data.comics_config = _res[1];
    if (this.data.is_local_record) {
      this.data.chapters = res.chapters;
      const chapters = await this._getChapterRead(this.data.comics_id);
      console.log(chapters);

      const comics = await this._getComicsRead(this.data.comics_id);
      for (let index = 0; index < this.data.chapters.length; index++) {
        if (chapters[index]) this.data.chapters[index].read = chapters[index].read;
        else this.data.chapters[index].read = 0;
      }
      this.data.chapter_id = comics.chapter_id;
    } else {
      this.data.chapters = res.chapters;
      this.data.chapter_id = this.data.comics_info.chapter_id;
    }
    delete res.chapters;
    if (this.data.chapters.length && this.data.chapters[0]) {
      if (this.data.chapters[0].cover) this.data.chapter_config.is_cover_exist = true;
    }

    this.data.comics_info = res;
    this.data.is_init_free = true;
    this.init$.next(this.data)
    this.history.update({
      id: comic_id,
      title: this.data.comics_info.title,
      cover: this.data.comics_info.cover
    })
  }


  async close() {
    this.data.is_init_free = false;
  }

  async _getWebDbComicsConfig(id: string) {

    const res: any = await firstValueFrom(this.webDb.getByID("comics_config", id.toString()))
    if (res) {
      return { ...this.data.comics_config, ...res }
    } else {
      return this.data.comics_config
    }
  }

  async _delChapter(comic_id:any,chapter_id: string) {
    // console.log(detail.chapters,comic_id,chapter_id);
    let detail = await this.DbController.getDetail(comic_id, { origin: this.origin })
    console.log(detail,detail.chapters);

    detail.chapters = detail.chapters.filter(x => x.id.toString() !== chapter_id.toString());
    console.log(detail.chapters,comic_id,chapter_id);
    await this.DbController.putWebDbDetail(comic_id, detail);
  }

  async _getChapter(id: string) {
    return await this.DbController.getPages(id, { origin: this.origin });
  }
  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await firstValueFrom(this.webDb.getByID("last_read_chapter_page", id.toString()))
    if (res) {
      return res.page_index
    } else {
      return 0
    }
  }
  async _chapterPageChange(chapter_id: string, page_index: number) {
    await this._setChapterIndex(chapter_id, page_index)

    this.router.navigate(['/', this.data.comics_id, this.data.chapter_id])

  }
  async _getChapterRead(id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("read_comics_chapter", id.toString()))
    if (res) {
      return res.chapters
    } else {
      return this.data.chapters.map(x => ({ id: x.id, read: 0 }))
    }
  }
  async _getComicsRead(comics_id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("last_read_comics", comics_id.toString()))
    if (res) {
      return res
    } else {
      return { 'comics_id': this.data.comics_id.toString(), chapter_id: this.data.chapters[0].id }
    }
  }
  async _getImageHW(id) {
    const res: any = await firstValueFrom(this.webDb.getByID("imageHW", id))

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
    await firstValueFrom(this.webDb.update("imageHW", { 'id': id, ...option }))
  }

  async _setChapterIndex(id: string, index: number) {
    await firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': id.toString(), "page_index": index }))
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
    this.router.navigate(['/comics',this.origin, comics_id, chapter_id])
  }
}
