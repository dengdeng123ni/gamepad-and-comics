import { Component, HostListener } from '@angular/core';
import { GamepadControllerService, GamepadEventService, GamepadInputService, ImageService, KeyboardEventService, PagesItem } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ZoomService } from '../../services/zoom.service';
// import Swiper from 'swiper';
declare const Swiper: any;
@Component({
  selector: 'app-double-page-reader-v2',
  templateUrl: './double-page-reader-v2.component.html',
  styleUrls: ['./double-page-reader-v2.component.scss']
})
export class DoublePageReaderV2Component {
  swiper = null;
  @HostListener('window:resize', ['$event'])
  resize = (event: KeyboardEvent) => {
    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 353) * window.innerHeight * 2}px`);
  }
  change$;
  event$;
  is_destroy = false;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public image: ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public GamepadInput: GamepadInputService,
    public KeyboardEvent: KeyboardEventService,
    public zoom: ZoomService

  ) {

    KeyboardEvent.registerAreaEvent('page_reader', {

      "c": () => {
        this.GamepadInput.down$.next("X")
      },

    })
    GamepadEvent.registerAreaEventY("page_reader", {
      "LEFT_BUMPER": () => this.zoom.zoom(1),
      "RIGHT_BUMPER": () => this.zoom.zoom(2),
    })

    GamepadEvent.registerAreaEvent('page_reader', {
      "LEFT": () => {
        this.zoom.zoomSize <= 1 ? this.current._pageNext() : this.zoom.down("DPAD_RIGHT");
      },
      "UP": () => {
        this.zoom.zoomSize <= 1 ? this.current._pagePrevious() : this.zoom.down("DPAD_UP");
      },
      "DOWN": () => {
        this.zoom.zoomSize <= 1 ? this.current._pageNext() : this.zoom.down("DPAD_DOWN");
      },
      "RIGHT": () => {
        this.zoom.zoomSize <= 1 ? this.current._pagePrevious() : this.zoom.down("DPAD_LEFT");
      },
      "X": () => {
        this.pageToggle();
      },
      "A": () => {
        this.current._pageNext();
      },
      "LEFT_BUMPER": () => this.zoom.zoomOut(),
      "RIGHT_BUMPER": () => this.zoom.zoomIn(),
      LEFT_TRIGGER: () => {
        current._chapterPrevious();
      },
      RIGHT_TRIGGER: () => {
        current._chapterNext();
      },

    })

    // GamepadEvent.registerAreaEventY('double_page_reader', {
    //   "UP": () => {
    //     current._pagePrevious();
    //     // this.zoom.zoomSize <= 1 ? this.previous() : this.zoom.down("DPAD_UP");
    //   },
    //   "DOWN": () => {
    //     current._pageNext();
    //     // this.zoom.zoomSize <= 1 ? this.next() : this.zoom.down("DPAD_DOWN");
    //   },
    //   "LEFT": () => {
    //     current._pagePrevious();
    //     // this.zoom.zoomSize <= 1 ? this.previous() : this.zoom.down("DPAD_LEFT");
    //   },
    //   "RIGHT": () => {
    //     current._pageNext();
    //     // this.zoom.zoomSize <= 1 ? this.next() : this.zoom.down("DPAD_RIGHT");
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

    // })


    this.change$ = this.current.change().subscribe(x => {

      if (x.trigger == 'double_page_reader_v2') return
      if (x.type == "changePage") {
        this.change(x.chapter_id, x.pages, x.page_index)

      } else if (x.type == "changeChapter") {
        this.change(x.chapter_id, x.pages, x.page_index)
        this.current._loadPages(x.chapter_id)
      } else if (x.type == "nextPage") {
        this.swiper.slidePrev();
      } else if (x.type == "previousPage") {
        this.swiper.slideNext();
      }
    })
    this.event$ = this.current.event().subscribe(x => {

    })

    this.event$ = this.current.event().subscribe(x => {
      if (x.key == "double_page_reader_FirstPageToggle") {
        this.firstPageToggle();
      } else if (x.key == "double_page_reader_togglePage") {
        this.pageToggle();
      }
    })

    this.init();

    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 353) * window.innerHeight * 2}px`);
  }
  firstPageToggle() {
    this.is_first_page_cover = !this.is_first_page_cover;
    if (this.data.page_index == 0) {
      this.pageToggle();
      this.pageToggle();
    } else {

    }
  }

  ngOnDestroy() {
    this.change$.unsubscribe();
    this.event$.unsubscribe();
    this.is_destroy = true;
  }
  isSwitch = false;
  async pageToggle() {
    const nodes = this.swiper.slides[this.swiper.activeIndex].querySelectorAll("[current_page]");

    let indexs = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      indexs.push(parseInt(node.getAttribute("index")))
    }
    const index = indexs.sort((a, b) => b - a)[0] - 1;

    if (index == 0) {
      this.current._pageChange(index);
    } else {
      if (index >= (this.data.pages.length - 2)) {
        this.current._pageChange(index - (3 - nodes.length));
      } else {
        this.current._pageChange(this.isSwitch ? index - 1 : index + 1);
      }
    }
    this.isSwitch = !this.isSwitch;
  }
  async init() {
    await this.addNextSlide(this.data.chapter_id, this.data.pages, this.data.page_index);
    await this.next();
    await this.previous();
    setTimeout(async () => {
      await this.next();
      this.current._loadPages(this.data.chapter_id)
    })
  }

  async change(chapter_id, pages, page_index) {
    this.objPreviousHtml = {};
    this.objNextHtml = {};
    this.swiper.removeAllSlides();
    await this.addNextSlide(chapter_id, pages, page_index);
    setTimeout(async () => {
      await this.next();
      await this.previous();

    })
  }
  async updata() {
    if (!this.swiper.slides[this.swiper.activeIndex]) return
    if (this.swiper.slides[this.swiper.activeIndex]) {
      const nodes = this.swiper.slides[this.swiper.activeIndex].querySelectorAll("[current_page]");
      let indexs = [];
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        indexs.push(parseInt(node.getAttribute("index")))
      }
      const index = indexs.sort((a, b) => b - a)[0] - 1;
      const chapter_id = nodes[0].getAttribute("chapter_id");
      this.current._change('changePage', {
        chapter_id: chapter_id,
        page_index: index,
        trigger: 'double_page_reader_v2'
      });
    } else {
      if (this.is_destroy) return
      setTimeout(() => {
        this.updata();
      }, 50)
    }

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
    const pages = await this.current._getChapter(chapter_id);
    if (index > 5 && (index + 3) >= pages.length) {
      setTimeout(async () => {
        const list = await this.current._getNextChapterId(chapter_id);
        this.current._loadPages(chapter_id)
        this.isWideImage(list[0], list[1]);
        setTimeout(() => {
          this.isWideImage(list[2], list[3]);
        })
      }, 300)
    }
    if (index >= pages.length) {
      const next_chapter_id = await this.current._getNextChapterId(chapter_id);

      if (next_chapter_id) {
        const res = await this.current._getChapter(next_chapter_id);
        this.isSwitch = false;
        this.addNextSlide(next_chapter_id, res, 0);
        return
      } else {
        return
      }
    } else {
      this.addNextSlide(chapter_id, pages, index)
      return
    }
  }
  async previous() {
    const nodes = this.swiper.slides[this.swiper.slides.length - 1].querySelectorAll("[current_page]");
    let indexs = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      indexs.push(parseInt(node.getAttribute("index")))
    }
    const index = indexs.sort((a, b) => a - b)[0] - 1;
    const chapter_id = nodes[0].getAttribute("chapter_id");
    const pages = await this.current._getChapter(chapter_id);

    if (index <= -1) {
      const next_chapter_id = await this.current._getPreviousChapterId(chapter_id);

      if (next_chapter_id) {
        const res = await this.current._getChapter(next_chapter_id);

        this.addPreviousSlide(next_chapter_id, res, res.length - 1);
        return
      } else {
        return
      }
    } else {
      this.addPreviousSlide(chapter_id, pages, index)
      return
    }
  }
  objNextHtml = {};
  objPreviousHtml = {};
  isPageFirst = false;
  is_first_page_cover = true;

  is_1 = false;
  async addNextSlide(chapter_id, list, index: number) {
    if (index < 0) index = 0;

    if (this.objNextHtml[`${chapter_id}_${index}`]) return
    else this.objNextHtml[`${chapter_id}_${index}`] = true;
    const getNextPages = async (list: Array<PagesItem>, index: number) => {
      const total = list.length;
      let page = {
        primary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false },
        secondary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false }
      }

      const obj = await this.isWideImage(list[index], list[index + 1]);

      setTimeout(() => {
        this.isWideImage(list[index + 2], list[index + 3]);
      }, 2000)

      if (obj.secondary && !obj.secondary.src) obj.secondary = undefined;
      if (index == 0 && !this.isSwitch && is_first_page_cover == true) {
        obj.secondary = undefined;
      } else if (index == 0 && this.isSwitch && is_first_page_cover == false) {
        obj.secondary = undefined;
      }
      // if (index == 0) this.isSwitch=!this.isSwitch;

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
    const is_first_page_cover = await this.current._getChapter_IsFirstPageCover(chapter_id);

    const res = await getNextPages(list, index);
    let current = "";
    const c = res.primary.end || res.primary.start || res.secondary.src;
    if (res?.primary?.width == res?.secondary?.width && !this.is_1) {
      document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(res.primary.width / res.primary.height) * window.innerHeight * 2}px`);
      this.is_1 = true
    }

    if (res.primary.end) current = current + `<img type="none" style="opacity: 0;width:50%"  src="${res.primary.src}" />`;
    if (res.secondary.src) current = current + `<img style="width: 50%;height: auto;object-fit: contain;object-position: right;" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.src) current = current + `<img  style="width: ${c ? '50%' : '100%'};height: auto;object-fit: contain;object-position: left;"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    if (res.primary.start) current = current + `<img type="none" style="opacity: 0;width:50%"  src="${res.primary.src}" />`;
    if (!!current) {
      this.objNextHtml[`${chapter_id}_${index}`] = `${chapter_id}_${index}`;
      this.prependSlide(current)

    }
  }
  async addPreviousSlide(chapter_id, list, index: number) {

    if (this.objPreviousHtml[`${chapter_id}_${index}`]) return
    else this.objPreviousHtml[`${chapter_id}_${index}`] = true;
    const getPreviousPages = async (list: Array<PagesItem>, index: number) => {
      const total = list.length;
      let page = {
        primary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false },
        secondary: { src: "", id: null, index: null, width: 0, height: 0, end: false, start: false }
      }
      const obj = await this.isWideImage(list[index], list[index - 1]);
      if (obj.secondary && !obj.secondary.src) obj.secondary = undefined;
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
    const c = res.primary.end || res.primary.start || res.secondary.src;
    if (res.primary.end) current = current + `<img type="none" style="opacity: 0;width50%" src="${res.primary.src}" />`;
    if (res.primary.src) current = current + `<img  style="width: ${c ? '50%' : '100%'};height: auto;object-fit: contain;object-position: right;"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`
    if (res.secondary.src) current = current + `<img style="width: 50%;height: auto;object-fit: contain;object-position: left;" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.start) current = current + `<img type="none" style="opacity: 0;width50%"  src="${res.primary.src}" />`;
    if (!!current) {
      this.objPreviousHtml[`${chapter_id}_${index}`] = `${chapter_id}_${index}`;
      this.appendSlide(current)
    }
  }
  prependSlide(src: string) {
    // if(this.swiper.slides.length>5) this.swiper.removeSlide((this.swiper.slides.length-1));
    if (
      !!src
    ) {
      this.swiper.prependSlide
        (`
     <div class="swiper-slide" style="display: flex;">
     ${src}
     </div>
    `)
    }
  }
  appendSlide(src: string) {
    // if(this.swiper.slides.length>5) this.swiper.removeSlide(0);
    if (!!src) {
      this.swiper.appendSlide
        (`
     <div class="swiper-slide" style="display: flex;">
     ${src}
     </div>
    `)
    }
  }

  loadImage = async (url: string) => {
    return new Promise<any>((resolve, reject) => {
      if (url) {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = url;
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  }



  isWideImage = async (primary: any, secondary: any) => {
    if (primary) primary.src = await this.current._getImage(primary.src)
    if (secondary) secondary.src = await this.current._getImage(secondary.src)
    const [imgPrimary, imgSecondary] = await Promise.all([this.loadImage(primary?.src), this.loadImage(secondary?.src)]);
    if (primary&&imgPrimary.width == 0 && imgPrimary.height == 0) primary.src = "error"
    if (secondary&&imgSecondary.width == 0 && imgSecondary.height == 0) secondary.src = "error"

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
    this.zoom.init();
    this.swiper = new Swiper(".mySwiper3", {
      speed: 300,
      mousewheel: {
        thresholdDelta: 50,
        forceToAxis: false,
        thresholdTime: 1000,
      },
      grabCursor: true,
      effect: "creative",
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      },
    });



    this.swiper.on('slidePrevTransitionEnd', async () => {

      if (!this.ccc) {
        this.ccc = true;

        await this.next()

        this.ccc = false;
        setTimeout(async () => {
          await this.next()
        }, 100)
      }
    });
    this.swiper.on('slideChange', async () => {
      if (!this.ppp) {
        this.ppp = true;
        this.zoom.zoom(1)
        await this.updata()

        this.ppp = false;
      }
    })


    this.swiper.on('slideNextTransitionEnd', async () => {
      if (!this.ccc) {
        this.ccc = true;

        await this.previous()

        this.ccc = false;
        setTimeout(() => {
          this.previous()
        }, 0)
      }
    });

  }

  ccc = false;
  bbb = false;
  ppp = false;


  //


}
