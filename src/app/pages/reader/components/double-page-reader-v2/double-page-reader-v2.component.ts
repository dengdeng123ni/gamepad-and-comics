import { Component, HostListener } from '@angular/core';
import { GamepadControllerService, GamepadEventService, GamepadInputService, ImageService, KeyboardEventService, PagesItem } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
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
    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 375) * window.innerHeight * 2}px`);
  }
  change$;
  event$;

  constructor(
    public current: CurrentService,
    public data: DataService,
    public image: ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public GamepadInput: GamepadInputService,
    public KeyboardEvent: KeyboardEventService

  ) {
    KeyboardEvent.registerAreaEvent('double_page_reader', {
      "space": () => {
        this.GamepadInput.down$.next("A")
      },
      "ArrowLeft": () => {
        this.GamepadInput.down$.next("LEFT")
      },
      "ArrowRight": () => {
        this.GamepadInput.down$.next("RIGHT")
      },
      "ArrowUp": () => {
        this.GamepadInput.down$.next("UP")
      },
      "ArrowDown": () => {
        this.GamepadInput.down$.next("DOWN")
      },

    })
    GamepadEvent.registerAreaEvent('double_page_reader', {
      "LEFT": () => {
        this.current._pagePrevious();
      },
      "UP": () => {
        this.current._pagePrevious();
      },
      "DOWN": () => {
        this.current._pageNext();
      },
      "RIGHT": () => {
        this.current._pageNext();
      },
      "X": () => {
        this.pageToggle();
      },
      "A": () => {
        this.current._pageNext();
      },
    })

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
      if (x.trigger == 'double_page_reader_v2') return
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

    this.event$ = this.current.event().subscribe(x => {
      if (x.key == "double_page_reader_FirstPageToggle") {
        this.firstPageToggle();
      } else if (x.key == "double_page_reader_togglePage") {
        this.pageToggle();
      }
    })

    this.init();

    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 375) * window.innerHeight * 2}px`);
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
  }
  isSwitch = false;
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
      setTimeout(async () => {
        await this.next();
      })
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
      setTimeout(async () => {
        await this.next();
      })
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
      pages: list,
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
    const nodes = this.swiper.slides[this.swiper.slides.length - 1].querySelectorAll("[current_page]");
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
  isPageFirst = false;
  is_first_page_cover = true;
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
      if (obj.secondary && !obj.secondary.src) obj.secondary = undefined;
      if (this.isPageFirst) {
        this.isPageFirst = false;
        if (this.is_first_page_cover == true && index == 0) {
          obj.secondary = undefined;
        }
      } else {
        if (index == 0 && !this.isSwitch && this.is_first_page_cover == true) {
          obj.secondary = undefined;
        }
        if (index == 0 && this.isSwitch && this.is_first_page_cover == false) {
          obj.secondary = undefined;
        }
      }
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
    const c = res.primary.end || res.primary.start || res.secondary.src;
    if (res.primary.end) current = current + `<img style="opacity: 0;width:50%"  src="${res.primary.src}" />`;
    if (res.secondary.src) current = current + `<img style="width: 50%;height: auto;object-fit: contain;object-position: right;" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.src) current = current + `<img  style="width: ${c ? '50%' : '100%'};height: auto;object-fit: contain;object-position: left;"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    if (res.primary.start) current = current + `<img style="opacity: 0;width:50%"  src="${res.primary.src}" />`;
    this.objNextHtml[`${chapter_id}_${index}`] = current;
    this.prependSlide(current)
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
    if (res.primary.end) current = current + `<img style="opacity: 0;width50%" src="${res.primary.src}" />`;
    if (res.primary.src) current = current + `<img  style="width: ${c ? '50%' : '100%'};height: auto;object-fit: contain;object-position: right;"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`
    if (res.secondary.src) current = current + `<img style="width: 50%;height: auto;object-fit: contain;object-position: left;" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.start) current = current + `<img style="opacity: 0;width50%"  src="${res.primary.src}" />`;

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
    this.swiper = new Swiper(".mySwiper3", {
      mousewheel: {
        thresholdDelta: 20,
        forceToAxis: false,
        thresholdTime: 500,
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
    // this.swiper.stop
    this.swiper.on('slidePrevTransitionEnd', () => {

      if (!this.ccc) {
        this.ccc = true;

        this.next()
        this.ccc = false;
      }
    });
    this.swiper.on('slideChange', () => {
      if (!this.ppp) {
        this.ppp = true;

        this.updata()
        this.ppp = false;
      }
    })

    this.swiper.on('slideNextTransitionEnd', () => {
      if (!this.ccc) {
        this.ccc = true;

        this.previous()
          this.ccc = false;
      }
    });

  }

  ccc = false;
  bbb = false;
  ppp = false;
}
