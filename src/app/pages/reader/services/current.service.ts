import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ChaptersItem, DbControllerService, HistoryService, ImageService, MessageFetchService, PagesItem } from 'src/app/library/public-api';
import { Subject, firstValueFrom } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UnlockService } from './unlock.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  private _chapters: any = {};
  private _chapters_IsFirstPageCover: any = {};

  public source;


  reader_modes = ['double_page_reader', 'up_down_page_reader', 'left_right_page_reader', 'one_page_reader']
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: NgxIndexedDBService,
    public image: ImageService,
    public _http: MessageFetchService,
    public history: HistoryService,
    public unlock: UnlockService,
    private _snackBar: MatSnackBar,
  ) {
    this.reader_mode_change$.subscribe(x => {
      if (this.reader_modes.includes(x)) this.data.comics_config.reader_mode = x;
      else this.data.comics_config.reader_mode = "double_page_reader";
      // if (this.data.comics_config.reader_mode == "double_page_reader") this.data.comics_config.is_double_page = true;
      // else this.data.comics_config.is_double_page = false;
    })
    this.change$.subscribe(e => {
      const index = this.data.chapters.findIndex(x => x.id == e.chapter_id)
      if (index == 0) {
        if (e.page_index == 0) this.pageStatu$.next("page_first")
      }
      if (index == this.data.chapters.length - 1) {
        if (e.page_index == e.pages.length - 2) this.pageStatu$.next("page_last")
      }

      if (e.type == "changeChapter") {
        this.pageStatu$.next("chapter")
      }
      if (e.type == "changePage") {
        this.pageStatu$.next("page")
      }
    })
  }


  public on$ = new Subject<MouseEvent>();

  public delete$ = new Subject();

  public change$ = new Subject<{
    type: string,
    pages: Array<PagesItem>,
    page_index: number,
    chapter: ChaptersItem,
    chapter_id?: string,
    trigger?: string
  }>();
  // ['page_last','page','page_first','chapter_first','chapter_last']
  // ['page_last','page','page_first','chapter_first','chapter_last']
  public pageStatu$ = new Subject<string>();
  public init$ = new Subject<any>();






  public readerNavbarBar$ = new Subject();
  public switch$ = new Subject<any>();
  public reader_mode_change$ = new Subject<any>();


  public event$ = new Subject<{ key: string, value: any }>();

  // 切换阅读模式
  public readerModeChange() {
    return this.reader_mode_change$
  }
  // 打开关闭上下工具栏
  public readerNavbarBar() {
    return this.readerNavbarBar$
  }

  public delete() {
    return this.delete$
  }
  public init() {
    return this.init$
  }

  public change() {
    return this.change$
  }

  public event() {
    return this.event$
  }

  async _init(source: string, comic_id: string, chapter_id: string) {
    this.source = source;

    this.data.is_init_free = false;
    this.data.chapter_id = chapter_id;
    this.data.comics_id = comic_id;

    const _res = await Promise.all([this.DbController.getPages(chapter_id, { source: source }), this.DbController.getDetail(comic_id, { source: source }), this._getChapterIndex(chapter_id), this._getWebDbComicsConfig(comic_id)])

    if (_res[0] && _res[1]) {

    }
    const list = _res[0];
    const res = _res[1];
    if (Number.isNaN(_res[2]) || _res[2] < 0) this.data.page_index = 0;
    this.data.page_index = _res[2];
    this.data.comics_config = _res[3];
    this.data.pages = list;
    if (this.data.page_index >= this.data.pages.length) this.data.page_index = 0;
    if (this.data.is_local_record) {
      this.data.chapters = res.chapters;
      const chapters = await this._getChapterRead(this.data.comics_id);
      for (let index = 0; index < this.data.chapters.length; index++) {
        if (chapters[index]) this.data.chapters[index].read = chapters[index].read;
        else this.data.chapters[index].read = 0;
      }
    } else {
      this.data.chapters = res.chapters;
    }
    delete res.chapters;
    this.data.details = res;
    this.init$.next(this.data)
    this.data.is_init_free = true;
    this.history.update({
      id: comic_id,
      title: this.data.details.title,
      cover: this.data.details.cover
    })
    setTimeout(() => {
      this._updateChapterRead(this.data.chapter_id)

    }, 1000)
  }

  async _getWebDbComicsConfig(id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("comics_config", id.toString()))
    if (res) {
      return { ...this.data.comics_config, ...res }
    } else {
      return this.data.comics_config
    }
  }

  async _setWebDbComicsConfig(id: string) {
    await firstValueFrom(this.webDb.update("comics_config", { 'comics_id': id.toString(), ...this.data.comics_config }))
  }

  async _setNextChapter(): Promise<any> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      return await this._setChapter(id);
    } else {
      this.pageStatu$.next('chapter_first');
    }
  }

  async _setPreviousChapter(): Promise<any> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      return await this._setChapter(id);
    } else {
      this.pageStatu$.next('chapter_last');
    }
  }

  async _setChapter(id: string) {
    this.data.chapter_id = id;
    let list = await this._getChapter(id);
    this.data.pages = list;
    return list
  }

  async _getNextChapter(): Promise<any> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter(id);
    }
  }
  async _getNextChapterId(id?): Promise<string | null> {
    if (!id) id = this.data.chapter_id;
    const index = this.data.chapters.findIndex(x => x.id == id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      return obj.id
    } else {
      return null
    }
  }
  async _getPreviousChapterId(id?): Promise<string | null> {
    if (!id) id = this.data.chapter_id;
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      return obj.id
    } else {
      return null
    }
  }

  async _getPreviousChapter(): Promise<any> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter(id);
    }
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


  async _chapterNext(): Promise<boolean> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      const index = await this._getChapterIndex(id);
      await this._chapterPageChange(id, index);
      return true
    } else {
      await this.pageStatu$.next("chapter_last")
      return false
    }
  }

  async _chapterPrevious(): Promise<boolean> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      const index = await this._getChapterIndex(id);
      await this._chapterPageChange(id, index);
      return true
    } else {
      await this.pageStatu$.next("chapter_first")
      return false
    }
  }

  async _pageNext() {
    this._change("nextPage", { page_index: this.data.page_index, chapter_id: this.data.chapter_id })
  }

  async _pagePrevious() {
    this._change("previousPage", { page_index: this.data.page_index, chapter_id: this.data.chapter_id })
  }
  async _delChapter(comic_id: any, chapter_id: string) {
    let detail = await this.DbController.getDetail(chapter_id, { source: this.source })
    detail.chapters = detail.chapters.filetr(x => x.id !== chapter_id);
    await this.DbController.putWebDbDetail(comic_id, detail);
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

  async _chapterPageChange(chapter_id: string, page_index: number) {
    const pages = await this._setChapter(chapter_id);
    this._change('changeChapter', { chapter_id, page_index })
  }
  async _chapterChange(chapter_id: string) {
    const pages = await this._setChapter(chapter_id);
    let page_index = await this._getChapterIndex(chapter_id);
    if (pages.length - 2 < page_index) page_index = 0;
    this._change('changeChapter', { chapter_id, page_index })
  }
  async _pageChange(page_index: number) {
    this._change('changePage', { chapter_id: this.data.chapter_id, page_index })
  }

  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await firstValueFrom(this.webDb.getByID("last_read_chapter_page", id.toString()))
    if (res) {
      return res.page_index
    } else {
      return 0
    }
  }
  async _getChapter_IsFirstPageCover(id: string): Promise<boolean> {
    const res: any = await this._getChapterFirstPageCover(id);
    if (res) {
      return res.is_first_page_cover
    } else {
      return true
    }
  }
  async _getChapterFirstPageCover(chapter_id: string) {
    return await firstValueFrom(this.webDb.getByID("chapter_first_page_cover", chapter_id.toString()))
  }
  async _setChapterFirstPageCover(chapter_id: string, is_first_page_cover: boolean) {
    await firstValueFrom(this.webDb.update("chapter_first_page_cover", { 'chapter_id': chapter_id.toString(), "is_first_page_cover": is_first_page_cover }))
  }
  async _delChapterFirstPageCover(chapter_id: string) {
    await firstValueFrom(this.webDb.deleteByKey("chapter_first_page_cover", chapter_id.toString()))
  }
  async _setChapterIndex(id: string, index: number) {
    await firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': id.toString(), "page_index": index }))
  }
  async _getChapterRead(comics_id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("read_comics_chapter", comics_id.toString()))
    if (res) {
      return res.chapters
    } else {
      return this.data.chapters.map(x => ({ id: x.id, read: 0 }))
    }
  }
  async _getComicsRead(comics_id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("read_comics_chapter", comics_id.toString()))
    if (res) {
      return res
    } else {
      return { 'comics_id': this.data.comics_id.toString(), chapter_id: this.data.chapters[0].id, chapter_title: this.data.chapters[0].title, chapters_length: this.data.chapters.length }
    }
  }
  async _updateChapterRead(chapter_id: string) {
    const index = this.data.chapters.findIndex(x => x.id.toString() == chapter_id.toString())
    if (index <= -1) return
    this.data.chapters[index].read = 1;
    const chapters = this.data.chapters.map(x => ({ id: x.id, read: x.read }))
    await firstValueFrom(this.webDb.update("read_comics_chapter", { 'comics_id': this.data.comics_id.toString(), chapters: chapters }))
    await firstValueFrom(this.webDb.update("last_read_comics", { 'comics_id': this.data.comics_id.toString(), chapter_id: this.data.chapters[index].id }))
  }
  async _unlock(chapter_id) {
    const bool = await this.DbController.Unlock(chapter_id)
    if (bool) {
      this._snackBar.open('解锁成功,以重新获取数据', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
      await this.DbController.delWebDbPages(chapter_id)
      const pages = await this.DbController.getPages(chapter_id)
      for (let index = 0; index < pages.length; index++) {
        await this.DbController.delWebDbImage(pages[index].src)
      }
    } else {
      this._snackBar.open('解锁失败,需要到对应网站查看', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
    }
    return bool

  }
  async _getIsFirstPageCover(pages: Array<PagesItem>): Promise<boolean> {
    try {
      const getImagePixel = async (url: string) => {
        const loadImage = async (url: string) => {
          return await createImageBitmap(await this.image.getImageBlob(url))
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
          if (!image2.is_right_white && image2.is_left_white) {
            bool = true;
          } else {
            if (!image1.is_left_white && !image1.is_right_white && !image2.is_left_white && !image2.is_right_white) {
              bool = false;
            } else {
              bool = true;
            }
          }
        }
      }
      return bool
    } catch (error) {
      return true
    }
  }
  async _getIsLastPageCover(pages: Array<PagesItem>): Promise<boolean> {
    // return true
    try {
      const getImagePixel = async (url: string) => {
        const loadImage = async (url: string) => {
          return await createImageBitmap(await this.image.getImageBlob(url))
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
  async _change(type: string, option: {
    page_index: number,
    chapter_id: string,
    trigger?: string
  }) {

    if (!option.chapter_id) return
    if (Number.isNaN(option.page_index) || option.page_index < 0) option.page_index = 0;
    const chapter = this.data.chapters.find(x => x.id == option.chapter_id);

    if (chapter.is_locked && option.page_index == 0) this.unlock.open(this.source, option.chapter_id);
    const pages = await this._getChapter(option.chapter_id)
    if(true){
      firstValueFrom(this.webDb.update('read_record',{
        id:new Date().getTime(),
        source:this.source,
        comics_id:this.data.comics_id,
        chapter_id:option.chapter_id,
        page_index:option.page_index
      }))
    }
    if (option.page_index > pages.length) option.page_index = pages.length - 1;

    this.data.page_index = option.page_index;
    this.data.pages = pages;
    this.data.chapter_id = option.chapter_id;

    if (type == "changePage") {
      this._setChapterIndex(this.data.chapter_id.toString(), option.page_index)

    } else if (type == "changeChapter") {
      this._setWebDbComicsConfig(this.data.comics_id);
    }
    this._updateChapterRead(this.data.chapter_id);
    const types = ['initPage', 'closePage', 'changePage', 'nextPage', 'previousPage', 'nextChapter', 'previousChapter', 'changeChapter'];
    this.change$.next({ ...option, pages, type, chapter })
  }

  close() {
    this._setWebDbComicsConfig(this.data.comics_id);
    this.data.is_init_free = false;
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id)
    this.history.update_progress(this.data.comics_id, `${this.data.is_offprint ? Math.ceil((this.data.page_index / this.data.pages.length) * 100) : Math.ceil((index / this.data.chapters.length) * 100)}%`)
  }



}
