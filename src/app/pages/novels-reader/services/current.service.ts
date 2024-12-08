import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { AppDataService, ChaptersItem, DbNovelsControllerService, HistoryService, ImageService, IndexdbControllerService, MessageFetchService } from 'src/app/library/public-api';
import { Subject, firstValueFrom } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
interface PagesItem{
  content:string
}
@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  private _chapters: any = {};
  private _chapters_IsFirstPageCover: any = {};

  public source;


  reader_modes = ['double_page_reader', 'up_down_page_reader', 'left_right_page_reader', 'one_page_reader']
  constructor(
    public DbNovelsController: DbNovelsControllerService,
    public data: DataService,
    public webDb: IndexdbControllerService,
    public image: ImageService,
    public _http: MessageFetchService,
    public history: HistoryService,
    private _snackBar: MatSnackBar,
    public App: AppDataService,
  ) {

  }


  public on$ = new Subject<MouseEvent>();

  public delete$ = new Subject();

  public change$ = new Subject<{
    type: string,
    pages: Array<PagesItem>,
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

    const _res = await Promise.all([this.DbNovelsController.getPages(chapter_id, { source: source }), this.DbNovelsController.getDetail(comic_id, { source: source })  ])

    if (_res[0] && _res[1]) {

    }
    const list = _res[0];
    const res = _res[1];
    this.data.pages = list;
    this.data.chapters = res.chapters;
    delete res.chapters;
    this.data.details = res;
    this.init$.next(this.data)
    this.data.is_init_free = true;
  }


  async _setWebDbComicsConfig(id: string) {
    await this.webDb.update("comics_config", { 'comics_id': id.toString(), ...this.data.comics_config })
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
    const c = await this.DbNovelsController.getPages(id, { source: this.source })
    // setTimeout(() => {
    //   this.DbNovelsController.loadPages(id, { source: this.source })
    // }, 1000)
    return c
  }


  async _chapterNext(): Promise<boolean> {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      const index = await this._getChapterIndex(id);
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
      return true
    } else {
      await this.pageStatu$.next("chapter_first")
      return false
    }
  }



  async _chapterChange(chapter_id: string) {
    const pages = await this._setChapter(chapter_id);
    let page_index = await this._getChapterIndex(chapter_id);
    if (pages.length - 2 < page_index) page_index = 0;
    this._change('changeChapter', { chapter_id })
  }
  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await this.webDb.getByKey("last_read_chapter_page", id.toString())
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
    return await this.webDb.getByKey("chapter_first_page_cover", chapter_id.toString())
  }
  async _setChapterFirstPageCover(chapter_id: string, is_first_page_cover: boolean) {
    await this.webDb.update("chapter_first_page_cover", { 'chapter_id': chapter_id.toString(), "is_first_page_cover": is_first_page_cover })
  }
  async _delChapterFirstPageCover(chapter_id: string) {
    await this.webDb.deleteByKey("chapter_first_page_cover", chapter_id.toString())
  }
  async _setChapterIndex(id: string, index: number) {
    await this.webDb.update("last_read_chapter_page", { 'chapter_id': id.toString(), "page_index": index })
  }
  async _getChapterRead(comics_id: string) {
    const res: any = await this.webDb.getByKey("read_comics_chapter", comics_id.toString())
    if (res) {
      return res.chapters
    } else {
      return this.data.chapters.map(x => ({ id: x.id, read: 0 }))
    }
  }
  async _getComicsRead(comics_id: string) {
    const res: any = await this.webDb.getByKey("read_comics_chapter", comics_id.toString())
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
    await this.webDb.update("read_comics_chapter", { 'comics_id': this.data.comics_id.toString(), chapters: chapters })
    await this.webDb.update("last_read_comics", { 'comics_id': this.data.comics_id.toString(), chapter_id: this.data.chapters[index].id })
  }
  async _unlock(chapter_id) {
    const bool = await this.DbNovelsController.Unlock(chapter_id)
    if (bool) {
      this._snackBar.open('解锁成功,以重新获取数据', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
      await this.DbNovelsController.delWebDbPages(chapter_id)
      const pages = await this.DbNovelsController.getPages(chapter_id)
      for (let index = 0; index < pages.length; index++) {
        await this.DbNovelsController.delWebDbImage(pages[index].src)
      }
    } else {
      this._snackBar.open('解锁失败,需要到对应网站查看', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
    }
    return bool

  }

  async _change(type: string, option: {
    chapter_id: string,
    trigger?: string
  }) {



    if (!option.chapter_id) return
    const chapter = this.data.chapters.find(x => x.id == option.chapter_id);

    const pages = await this._getChapter(option.chapter_id)


    this.data.pages = pages;
    this.data.chapter_id = option.chapter_id;

    if (type == "changePage") {

    } else if (type == "changeChapter") {
      history.replaceState(null, "", `comics/${this.source}/${this.data.comics_id}/${this.data.chapter_id}`);
    }
    this._updateChapterRead(this.data.chapter_id);
    const types = ['nextChapter', 'previousChapter', 'changeChapter'];
    this.change$.next({ ...option, pages, type, chapter })
  }

  close() {
    this._setWebDbComicsConfig(this.data.comics_id);
    this.data.is_init_free = false;
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id)
    if (this.data.chapters.length > 1) this.history.update_progress(this.data.comics_id, `${this.data.is_offprint ? Math.ceil((this.data.page_index / this.data.pages.length) * 100) : Math.ceil((index / this.data.chapters.length) * 100)}%`)
    else {
      const length = document.querySelectorAll(".swiper-slide-active img").length ?? 1;

      this.history.update_progress(this.data.comics_id, `${Math.ceil(((this.data.page_index + length) / this.data.pages.length) * 100)}%`)
    }
  }



}
