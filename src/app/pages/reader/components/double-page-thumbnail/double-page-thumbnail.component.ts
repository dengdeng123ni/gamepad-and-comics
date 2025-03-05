import { Component, ElementRef, Inject, NgZone, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoublePageThumbnailService } from './double-page-thumbnail.service';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { ContextMenuEventService, I18nService, IndexdbControllerService, TouchmoveEventService, UtilsService, WorkerService } from 'src/app/library/public-api';


interface DialogData {
  string;
  page_index?: number
}
// const KEY='double_page_thumbnail';
@Component({
  selector: 'app-double-page-thumbnail',
  templateUrl: './double-page-thumbnail.component.html',
  styleUrls: ['./double-page-thumbnail.component.scss']
})
export class DoublePageThumbnailComponent {
  KEY = 'double_page_thumbnail';

  double_pages = [];
  chapter_id = "";
  chapter_title = "";



  is_multiple = false;

  is_first_page_cover = false;


  cover = "";

  is_loading_free = false;

  opened = true;
  is_head_show = false;

  is_init_free = false;

  chapter_double_pages = [] as any;



  @ViewChildren('itemRef') itemElements!: QueryList<ElementRef>;


  constructor(
    public utils: UtilsService,
    private zone: NgZone,
    public data: DataService,
    public current: CurrentService,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData,
    public doublePageThumbnail: DoublePageThumbnailService,
    public webDb: IndexdbControllerService,
    public I18n: I18nService,
    public ContextMenuEvent: ContextMenuEventService,
    public Worker: WorkerService,
    public TouchmoveEvent: TouchmoveEventService
  ) {
    this.getData(data.chapter_id);
    this.get()
    this.registerInit()
    this.data.chapters.forEach(x => {
      x.selected = undefined;
    })
    TouchmoveEvent.register('double_page_thumbnail', {
      LEFT: () => {
        this.doublePageThumbnail.close();
      },
      RIGHT: () => {
        this.doublePageThumbnail.close();
      },
    })
  }
  async registerInit() {
    const 页之前插入 = await this.I18n.getTranslatedText('页之前插入')
    const 页之后插入 = await this.I18n.getTranslatedText('页之后插入')
    if (this.data.is_cache) {
      this.ContextMenuEvent.register('double_page_thumbnail_item', {
        send: ($event, data) => {
          let index_arr = [];
          $event.querySelectorAll(".index").forEach(node => {
            index_arr.push(parseInt(node.textContent))
          })
          index_arr.sort();
          const delete_index = data.findIndex(x => x.id == "delete");
          data[delete_index].submenu = index_arr.map(x => ({ name: x, id: `delete`, data: x }));

          const insertPage_index = data.findIndex(x => x.id == "insertPage");
          data[insertPage_index].submenu = [];
          index_arr.forEach(x => {
            data[insertPage_index].submenu.push({ name: `${x}${页之前插入}`, id: `insertPageBefore`, data: x })
            data[insertPage_index].submenu.push({ name: `${x}${页之后插入}`, id: `insertPageAfter`, data: x })
          });

          const insertPage_index2 = data.findIndex(x => x.id == "insertWhitePage");
          data[insertPage_index2].submenu = [];
          index_arr.forEach(x => {
            data[insertPage_index2].submenu.push({ name: `${x}${页之前插入}`, id: `insertWhitePageBefore`, data: x })
            data[insertPage_index2].submenu.push({ name: `${x}${页之后插入}`, id: `insertWhitePageAfter`, data: x })
          });
          const index = data.findIndex(x => x.id == "separate_page")
          if (index > -1) {
            data.splice(index, 1)
          }
          const index2 = data.findIndex(x => x.id == "merge_page")
          if (index2 > -1) {
            data.splice(index2, 1)
          }
          if (index_arr.length == 1) {
            const obj = { name: "分页", "id": "separate_page" };
            data.splice(1, 0, obj)
          } else {
            const obj = { name: "合页", "id": "merge_page" };
            data.splice(1, 0, obj)
          }
          return data
        },
        on: async e => {
          const node = document.querySelector(`[content_menu_value=${e.value}]`);
          const chapter_id = node.getAttribute("chapter_id");
          const index = node.getAttribute("index");
          let double_pages = []
          if (this.is_multiple) {
            double_pages = this.chapter_double_pages.find(x => x.chapter_id == chapter_id).data;
          } else {
            double_pages = this.double_pages;
          }
          if (e.id == "delete") {
            this.current._delPage(chapter_id, e.data - 1).then(() => {
              this.init2(chapter_id)
            })
          }
          else if (e.id == "merge_page") {
            this.current._mergePage(chapter_id, double_pages[parseInt(index)].images[1].index - 1, double_pages[parseInt(index)].images[0].index - 1).then(() => {
              this.init2(chapter_id)
            })
          } else if (e.id == "separate_page") {
            this.current._separatePage(chapter_id, double_pages[parseInt(index)].images[0].index - 1).then(() => {
              this.init2(chapter_id)
            })

          } else if (e.id == "insertWhitePageBefore") {
            this.current._insertWhitePage(chapter_id, e.data - 1).then(() => {
              this.init2(chapter_id)
            })
          } else if (e.id == "insertWhitePageAfter") {
            this.current._insertWhitePage(chapter_id, e.data).then(() => {
              this.init2(chapter_id)
            })
          } else if (e.id == "insertPageBefore") {
            this.current._insertPage(chapter_id, e.data - 1).then(() => {
              this.init2(chapter_id)
            })
          } else if (e.id == "insertPageAfter") {
            this.current._insertPage(chapter_id, e.data).then(() => {
              this.init2(chapter_id)
            })
          } else {
            e.click(double_pages[parseInt(index)].images)
          }
        },
        menu: [
          {
            name: "插入", "id": "insertPage"
          },
          {
            name: "插入空白页", "id": "insertWhitePage"
          },
          { name: "删除", id: "delete" },
        ]
      })
    } else {
      this.ContextMenuEvent.register('double_page_thumbnail_item', {
        on: async e => {

          const node = document.querySelector(e.value);
          const chapter_id = node.getAttribute("chapter_id");
          const index = node.getAttribute("index");

          e.click(this.double_pages[parseInt(index)].images)
        }
      })
    }
  }
  getTargetNode = (node: HTMLElement): HTMLElement => {
    if (node.getAttribute("region")) {
      return node
    } else {
      return this.getTargetNode(node.parentNode as HTMLElement)
    }
  }
  async post() {
    return await this.webDb.update("data", {
      id: this.KEY,
      opened: this.opened,
      is_head_show: this.is_head_show
    })
  }

  async get() {
    const res: any = await this.webDb.getByKey("data", this.KEY)
    if (res) {
      this.opened = res.opened;
      this.is_head_show = res.is_head_show;
    }
    this.is_init_free = true;
  }
  async getData(chapter_id: string) {
    const pages = await this.current._getChapter(chapter_id);
    const page_index = await this.current._getChapterIndex(chapter_id)
    const chapter_index = this.data.chapters.findIndex(x => x.id == chapter_id);
    const double_list = await this.getDoublePages(chapter_id, pages, page_index)
    this.is_first_page_cover = await this.current._getChapter_IsFirstPageCover(chapter_id)
    this.chapter_id = chapter_id;
    this.chapter_title = this.data.chapters[chapter_index].title;
    this.double_pages = double_list;
  }

  async getMultipleData(chapter_id: string) {
    const pages = await this.current._getChapter(chapter_id);
    const page_index = await this.current._getChapterIndex(chapter_id)
    const chapter_index = this.data.chapters.findIndex(x => x.id == chapter_id);
    const double_list = await this.getDoublePages(chapter_id, pages, page_index)
    return {
      chapter_id: chapter_id,
      data: double_list
    }
  }

  async change2() {
    const ids = this.data.chapters.filter(x => x.selected);
    this.chapter_double_pages = this.chapter_double_pages.filter(c => ids.find(x => x.id == c.chapter_id))
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index].id;
      const obj = this.chapter_double_pages.find(x => x.chapter_id == id)
      if (obj) {

      } else {

        this.getMultipleData(id).then(x => {
          const index = this.chapter_double_pages.findIndex(c => c.chapter_id == x.chapter_id)
          this.chapter_double_pages[index].data = x.data;
        })
        const is_first_page_cover = await this.current._getChapter_IsFirstPageCover(id)
        this.chapter_double_pages.push({
          chapter_id: id,
          chapter_title: ids[index].title,
          is_first_page_cover: is_first_page_cover
        })
      }

    }
  }

  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }

  async init2(chapter_id: string) {
    if (this.is_multiple) {
      this.getMultipleData(chapter_id).then(x => {
        const index = this.chapter_double_pages.findIndex(c => c.chapter_id == x.chapter_id)
        this.chapter_double_pages[index].data = x.data;
      })
    } else {
      this.getData(chapter_id)
    }

  }

  async getDoublePages(chapter_id: string, pages: { id: string; width: number; height: number; src: string; }[], page_index: number) {
    let urls = pages.map(x => x.src) as any;
    if (this.data.is_cache) urls = await this.Worker.workerImageCompression(pages.map(x => x.src), 200, 0.7);
    const list = pages.map((x: any, i: number) => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: urls[i]
    }))
    const is_first_page_cover = await this.current._getChapter_IsFirstPageCover(chapter_id);
    const double_list = await this.utils.Images.getPageDouble(list, { isFirstPageCover: is_first_page_cover, pageOrder: this.data.comics_config.is_page_order });

    double_list.forEach((x: any) => {
      x.images.forEach((c: any) => {
        if (!x.select) x.select = (c.index - 1) == page_index;
      })
      x.chapter_id = chapter_id;
    })
    return double_list
  }
  change$=null;
  ngAfterViewInit() {
    // 监听元素变化（如果列表是动态加载的）
      this.change$= this.itemElements.changes.subscribe(() => {
      this.focusFourthItem();
    });

    // 初始渲染时尝试聚焦
  }

  // 聚焦第4个元素
  focusFourthItem() {
    setTimeout(() => {

      const node = document.querySelector("#double_page_thumbnail button[select=true]");
      if (node) {
        node.scrollIntoView({ behavior: 'instant', block: "center", inline: "center" });
        (node as any).focus();

      }
    }, 100)
  }
  ngOnDestroy() {
    this.change$.unsubscribe();
    this.post();
  }
  async change(chapter_id) {
    await this.current._setChapterFirstPageCover(chapter_id, this.is_first_page_cover)
    await this.getData(chapter_id)

  }

  async change3(chapter_id, bool) {
    await this.current._setChapterFirstPageCover(chapter_id, bool)
    this.getMultipleData(chapter_id).then(x => {
      const index = this.chapter_double_pages.findIndex(c => c.chapter_id == x.chapter_id)
      this.chapter_double_pages[index].data = x.data;
      this.chapter_double_pages[index].is_first_page_cover = bool;
    })

  }
  complete = () => {



  }

  on(data: any) {
    console.log(data);

    if (data.images.length == 1) {
      const index = data.images[0].index;
      this.current._chapterPageChange(this.chapter_id, index - 1);
    } else {
      if (false) {
        const index = data.images[0].index;
        this.current._chapterPageChange(this.chapter_id, index - 1);
      } else {
        const index = data.images[0].index;
        this.current._chapterPageChange(this.chapter_id, index - 2);
      }
    }
  }
  on4(chapter_id, data) {
    if (data.images.length == 1) {
      const index = data.images[0].index;
      this.current._chapterPageChange(chapter_id, index - 1);
    } else {
      if (false) {
        const index = data.images[0].index;
        this.current._chapterPageChange(chapter_id, index - 1);
      } else {
        const index = data.images[0].index;
        this.current._chapterPageChange(chapter_id, index - 2);
      }
    }

  }

  on2($event, e) {
    $event.stopPropagation()
    this.getData(e.id);

  }

  close() {

    this.doublePageThumbnail.close();
  }
  close2() {
    if (!this.is_loading_free) this.doublePageThumbnail.close();
  }


  async previous(chapter_id) {
    const id = await this.current._getPreviousChapterId(chapter_id);
    if (id) this.getData(id);
  }
  async next(chapter_id) {
    const id = await this.current._getNextChapterId(chapter_id);
    if (id) this.getData(id);
  }




}
// 插页 删除 合页 分页
