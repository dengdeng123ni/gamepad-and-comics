
import { Component, HostListener } from '@angular/core';
import { ImageService, PagesItem } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { GamepadControllerService } from 'src/app/library/gamepad/gamepad-controller.service';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
// import Swiper from 'swiper';
declare const Swiper: any;

@Component({
  selector: 'app-one-page-reader',
  templateUrl: './one-page-reader.component.html',
  styleUrls: ['./one-page-reader.component.scss']
})
export class OnePageReaderComponent {
  swiper = null;
  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event: KeyboardEvent) => {
  }
  @HostListener('window:resize', ['$event'])
  resize = (event: KeyboardEvent) => {
    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 353) * window.innerHeight }px`);
  }
  change$;
  event$;

  constructor(
    public current: CurrentService,
    public data: DataService,
    public image: ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService
  ) {


    // GamepadEvent.registerAreaEventY('double_page_reader', {
    //   "UP": () => {
    //     current._pagePrevious();
    //     // this.zoomSize <= 1 ? this.previous() : this.down("DPAD_UP");
    //   },
    //   "DOWN": () => {
    //     current._pageNext();
    //     // this.zoomSize <= 1 ? this.next() : this.down("DPAD_DOWN");
    //   },
    //   "LEFT": () => {
    //     current._pagePrevious();
    //     // this.zoomSize <= 1 ? this.previous() : this.down("DPAD_LEFT");
    //   },
    //   "RIGHT": () => {
    //     current._pageNext();
    //     // this.zoomSize <= 1 ? this.next() : this.down("DPAD_RIGHT");
    //   },
    //   X: () => {
    //     this.pageToggle();
    //   },
    //   A: () => {
    //     current._pageNext();
    //   },
    //   B: () => {
    //     window.history.back();
    //   },
    //   // "LEFT_BUMPER": () => this.zoomOut(),
    //   // "RIGHT_BUMPER": () => this.zoomIn(),
    //   // RIGHT_ANALOG_PRESS: () => {
    //   //   this.ReaderNavbarBar.isToggle();
    //   // },
    //   LEFT_TRIGGER: () => {
    //     current._chapterNext();
    //   },
    //   RIGHT_TRIGGER: () => {
    //     current._chapterPrevious();
    //   }
    // })


    this.change$ = this.current.change().subscribe(x => {
      if(x.trigger=='double_page_reader_v2') return
      if (x.type == "changePage") {
        this.change(x.chapter_id, x.pages, x.page_index)
      } else if (x.type == "changeChapter") {
        this.change(x.chapter_id, x.pages, x.page_index)
      } else if (x.type == "nextPage") {
        this.swiper.slidePrev();
      } else if (x.type == "previousPage") {
        this.swiper.slideNext();
      }
    })
    this.event$ = this.current.event().subscribe(x => {

    })


    this.init();

    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 353) * window.innerHeight }px`);
  }

  ngOnDestroy() {
    this.change$.unsubscribe();
    this.event$.unsubscribe();
  }
  isSwitch=false;
  pageToggle() {
    if (this.data.page_index == 0) {
      this.current._pageChange(this.data.page_index);
    } else {
      if (this.data.page_index == this.data.pages.length - 1) {
        this.current._pageChange(this.isSwitch ? this.data.page_index - 1 : this.data.page_index - 1);
        // this.isSwitch = !this.isSwitch;
      } else {
        this.current._pageChange(this.isSwitch ? this.data.page_index - 1 : this.data.page_index + 1);
      }
    }
    this.isSwitch = !this.isSwitch;
  }
  async init() {
    await this.addNextSlide(this.data.chapter_id, this.data.pages, this.data.page_index);
    setTimeout(async () => {
      await this.next();
      await this.previous();
    })
  }

  async change(chapter_id, pages, page_index) {
    this.swiper.removeAllSlides();
    await this.addNextSlide(chapter_id, pages, page_index);
    setTimeout(async () => {
      await this.next();
      await this.previous();
    })
  }
  async updata() {
    const nodes = this.swiper.slides[this.swiper.activeIndex].querySelectorAll("[current_page]");
    let indexs = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      indexs.push(parseInt(node.getAttribute("index")))
    }
    const index = indexs.sort((a, b) => b - a)[0] - 1;
    const chapter_id = nodes[0].getAttribute("chapter_id");
    const list = await this.current._getChapter(chapter_id);
    this.current._change('changePage', {
      chapter_id: chapter_id,
      page_index: index,
      trigger: 'double_page_reader_v2'
    });
  }

  async next() {
    const nodes = this.swiper.slides[0].querySelectorAll("[current_page]");
    let indexs = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      indexs.push(parseInt(node.getAttribute("index")))
    }
    const index = indexs.sort((a, b) => b - a)[0] + 1;
    const chapter_id = nodes[0].getAttribute("chapter_id");
    if (chapter_id == this.data.chapter_id) {
      if (index == this.data.pages.length) {
        const list = await this.current._getNextChapter();
        const id = await this.current._getNextChapterId();
        this.addNextSlide(id, list, 0);
        return
      } else {
        this.addNextSlide(this.data.chapter_id, this.data.pages, index)
      }

    } else {
      this.data.pages = await this.current._getNextChapter();
      this.data.chapter_id = await this.current._getNextChapterId();
      this.addNextSlide(this.data.chapter_id, this.data.pages, index)
    }
  }
  async previous() {
    const nodes = this.swiper.slides[this.swiper.slides.length-1].querySelectorAll("[current_page]");
    let indexs = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      indexs.push(parseInt(node.getAttribute("index")))
    }
    const index = indexs.sort((a, b) => a - b)[0] - 1;
    const chapter_id = nodes[0].getAttribute("chapter_id");
    if (chapter_id == this.data.chapter_id) {
      if (index < 0) {
        const list = await this.current._getPreviousChapter();
        const id = await this.current._getPreviousChapterId();
        this.addPreviousSlide(id, list, list.length - 1);
        return
      } else {
        this.addPreviousSlide(this.data.chapter_id, this.data.pages, index)
      }
    } else {
      this.data.pages = await this.current._getPreviousChapter();
      this.data.chapter_id = await this.current._getPreviousChapterId();
      this.addPreviousSlide(this.data.chapter_id, this.data.pages, index)
    }
  }
  objNextHtml = {};
  objPreviousHtml = {};
  async addNextSlide(chapter_id, list, index: number) {
    const getNextPages = async (list: Array<PagesItem>, index: number) => {
      const total = list.length;
      let page = {
        primary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false },
        secondary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false }
      }
      const obj = await this.isWideImage(list[index], list[index + 1]);
     obj.secondary = undefined;
      if (index == 0) obj.secondary = undefined;

      if (index >= (total - 1) && !obj.secondary) {
        if (obj.primary.width < obj.primary.height) page.primary.end = true;
      }
      if (obj.secondary) page.secondary = { ...page.secondary, ...obj.secondary };
      if (obj.primary) page.primary = { ...page.primary, ...obj.primary };
      if (index == 0 && !obj.secondary) {
        if (obj.primary.width < obj.primary.height) page.primary.start = true;
      }
      return page
    }
    const res = await getNextPages(list, index);
    let current = "";
    // if (res.primary.end) current = current + `<img style="opacity: 0;"  src="${res.primary.src}" />`;
    if (res.secondary.src) current = current + `<img current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.src) current = current + `<img  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    // if (res.primary.start) current = current + `<img style="opacity: 0;"  src="${res.primary.src}" />`;
    this.objNextHtml[`${chapter_id}_${index}`] = current;
    this.prependSlide(current)
  }
  async addPreviousSlide(chapter_id, list, index: number) {
    const getPreviousPages = async (list: Array<PagesItem>, index: number) => {
      const total = list.length;
      let page = {
        primary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false },
        secondary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false }
      }
      const obj = await this.isWideImage(list[index], list[index - 1]);
       obj.secondary = undefined;
      if (index == 0) obj.secondary = undefined;

      if (index >= (total - 1) && !obj.secondary) {
        if (obj.primary.width < obj.primary.height) page.primary.end = true;
      }
      if (obj.secondary) page.secondary = { ...page.secondary, ...obj.secondary };
      if (obj.primary) page.primary = { ...page.primary, ...obj.primary };
      if (index == 0 && !obj.secondary) {
        if (obj.primary.width < obj.primary.height) page.primary.start = true;
      }
      return page
    }
    const res = await getPreviousPages(list, index);
    let current = "";
    // if (res.primary.end) current = current + `<img style="opacity: 0;"  src="${res.primary.src}" />`;
    if (res.primary.src) current = current + `<img  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    if (res.secondary.src) current = current + `<img current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    // if (res.primary.start) current = current + `<img style="opacity: 0;"  src="${res.primary.src}" />`;
    this.objPreviousHtml[`${chapter_id}_${index}`] = current;
    this.appendSlide(current)
  }
  prependSlide(src: string) {
    this.swiper.prependSlide
      (`
     <div class="swiper-slide" style="display: flex;">
     ${src}
     </div>
    `)
  }
  appendSlide(src: string) {
    this.swiper.appendSlide
      (`
     <div class="swiper-slide" style="display: flex;">
     ${src}
     </div>
    `)
  }
  async getNextFirst() {
    const res = {
      next: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }

    const list = await this.current._getNextChapter();


    if (list) {
      const index = 0;
      const images = list;
      const obj = await this.isWideImage(images[index], images[index + 1]);
      const total = images.length;
      const id = await this.current._getNextChapterId()
      const is_first_page_cover = await this.current._getChapter_IsFirstPageCover(id!);
      if (is_first_page_cover == true && index == 0) {
        obj.secondary.image = "";
      }
      if (obj.primary.width > obj.primary.height || obj.secondary.width > obj.secondary.height) {
        obj.secondary.image = "";
      }
      if (index >= (total - 1) && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.next.primary.end = true;
      }
      if (obj.secondary.image) res.next.secondary.image = obj.secondary.image;
      if (obj.primary.image) res.next.primary.image = obj.primary.image;
      if (index == 0 && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.next.primary.start = true;
      }
    }
    return res.next
  }
  async loadingNextFirstPage() {
    const list = await this.current._getNextChapter();
    if (list) {
      const index = 0;
      const images = list;
      const obj = await this.isWideImage(images[index], images[index + 1]);
    }
  }
  async getPreviousLast() {
    const res = {
      previous: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }
    const list = await this.current._getPreviousChapter();

    if (list) {
      const images = list;
      const total = images.length;
      const index = images.length;
      const obj = await this.isWideImage(images[index - 1], images[index]);
      if (index >= (total - 1) && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.previous.primary.end = true;
      }
      if (obj.secondary.image) res.previous.secondary.image = obj.secondary.image;
      if (obj.primary.image) res.previous.primary.image = obj.primary.image;
      if (index == 0 && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.previous.primary.start = true;
      }
    }
    return res.previous
  }

  loadImage = async (url: string) => {
    url = await this.image.getImageBase64(url)
    return new Promise<any>((resolve, reject) => {
      if (url) {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject({ width: 0, height: 0 });
        img.src = url;
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  }

  isWideImage = async (primary: any, secondary: any) => {
    if (primary) primary.src = await this.image.getImageBase64(primary.src)
    if (secondary) secondary.src = await this.image.getImageBase64(secondary.src)

    const [imgPrimary, imgSecondary] = await Promise.all([this.loadImage(primary?.src), this.loadImage(secondary?.src)]);

    if (imgPrimary.width > imgPrimary.height || imgSecondary.width > imgSecondary.height) {
      return {
        'primary': { ...primary, width: imgPrimary.width, height: imgPrimary.height },
        'secondary': undefined
      };
    } else {
      return {
        'primary': { ...primary, width: imgPrimary.width, height: imgPrimary.height },
        'secondary': { ...secondary, width: imgSecondary.width, height: imgSecondary.height }
      };
    }
  }

  ngAfterViewInit() {
    this.swiper = new Swiper(".mySwiper4", {
      mousewheel: {
        thresholdDelta: 20,
        forceToAxis: false,
        thresholdTime: 500,
      },
      grabCursor: true,
    });
    // this.swiper.stop
    this.swiper.on('slidePrevTransitionEnd', () => {

      if (!this.ccc) {
        this.ccc = true;

        setTimeout(() => {
          this.next()
          this.ccc = false;
        }, 500)
      }
    });
    // this.swiper.on('slideChange', () => {
    //   if (!this.ppp) {
    //     this.ppp = true;

    //     setTimeout(() => {
    //       this.updata()
    //       this.ppp = false;
    //     }, 500)
    //   }
    // })

    this.swiper.on('slideNextTransitionEnd', () => {
      if (!this.bbb) {
        this.bbb = true;

        setTimeout(() => {
          this.previous()
          this.bbb = false;
        }, 500)
      }
    });

  }

  ccc = false;
  bbb = false;
  ppp = false;
}
