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
    document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(250 / 353) * window.innerHeight * 2}px`);
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
    KeyboardEvent.registerAreaEvent('page_reader', {

      "c": () => {
        this.GamepadInput.down$.next("X")
      },

    })
    GamepadEvent.registerAreaEventY("page_reader", {
      "LEFT_BUMPER": () => this.zoom(1),
      "RIGHT_BUMPER": () => this.zoom(2),
    })

    GamepadEvent.registerAreaEvent('page_reader', {
      "LEFT": () => {
        this.zoomSize <= 1 ? this.current._pagePrevious() : this.down("DPAD_LEFT");
      },
      "UP": () => {
        this.zoomSize <= 1 ? this.current._pagePrevious() : this.down("DPAD_UP");
      },
      "DOWN": () => {
        this.zoomSize <= 1 ? this.current._pageNext() : this.down("DPAD_DOWN");
      },
      "RIGHT": () => {
        this.zoomSize <= 1 ? this.current._pageNext() : this.down("DPAD_RIGHT");
      },
      "X": () => {
        this.pageToggle();
      },
      "A": () => {
        this.current._pageNext();
      },
      "LEFT_BUMPER": () => this.zoomOut(),
      "RIGHT_BUMPER": () => this.zoomIn(),
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
  }
  isSwitch = false;
  async pageToggle() {
    await this.updata();
    setTimeout(() => {
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
    })
  }
  async init() {
    await this.addNextSlide(this.data.chapter_id, this.data.pages, this.data.page_index);
    await this.next();
    await this.previous();
    setTimeout(async () => {
      await this.next();
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
    const pages = await this.current._getChapter(chapter_id);
    if (index >= pages.length - (nodes.length - 1)) {
      const next_chapter_id = await this.current._getNextChapterId(chapter_id);

      if (next_chapter_id) {
        const res = await this.current._getChapter(next_chapter_id);
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

    if (index >= pages.length - (nodes.length - 1)) {
      const next_chapter_id = await this.current._getPreviousChapterId(chapter_id);

      if (next_chapter_id) {
        const res = await this.current._getChapter(next_chapter_id);
        this.addPreviousSlide(next_chapter_id, res, 0);
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
    if (res?.primary?.width == res?.secondary?.width && !this.is_1) {
      document.documentElement.style.setProperty('--double-page-reader-v2-width', `${(res.primary.width / res.primary.height) * window.innerHeight * 2}px`);
      this.is_1 = true
    }

    if (res.primary.end) current = current + `<img style="opacity: 0;width:50%"  src="${res.primary.src}" />`;
    if (res.secondary.src) current = current + `<img style="width: 50%;height: auto;object-fit: contain;object-position: right;" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.src) current = current + `<img  style="width: ${c ? '50%' : '100%'};height: auto;object-fit: contain;object-position: left;"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    if (res.primary.start) current = current + `<img style="opacity: 0;width:50%"  src="${res.primary.src}" />`;
    if (!!current) {
      this.objNextHtml[`${chapter_id}_${index}`] = current;
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
    if (res.primary.end) current = current + `<img style="opacity: 0;width50%" src="${res.primary.src}" />`;
    if (res.primary.src) current = current + `<img  style="width: ${c ? '50%' : '100%'};height: auto;object-fit: contain;object-position: right;"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`
    if (res.secondary.src) current = current + `<img style="width: 50%;height: auto;object-fit: contain;object-position: left;" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.start) current = current + `<img style="opacity: 0;width50%"  src="${res.primary.src}" />`;
    if (!!current) {
      this.objPreviousHtml[`${chapter_id}_${index}`] = current;
      this.appendSlide(current)
    }
  }
  prependSlide(src: string) {
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
      speed: 0,
      mousewheel: {
        thresholdDelta: 20,
        forceToAxis: false,
        thresholdTime: 500,
      },
      // grabCursor: true,
      // effect: "creative",
      // creativeEffect: {
      //   prev: {
      //     shadow: true,
      //     translate: ["-20%", 0, -1],
      //   },
      //   next: {
      //     translate: ["100%", 0, 0],
      //   },
      // },
    });

    this.oBox = document.querySelector('.mySwiper3')
    this.oDiv = document.querySelector('.swiper-wrapper')
    // this.swiper.stop
    this.swiper.on('slidePrevTransitionEnd', async () => {

      if (!this.ccc) {
        this.ccc = true;

        await this.next()

        this.ccc = false;
        setTimeout(() => {
          this.next()
        }, 0)
      }
    });
    this.swiper.on('slideChange', async () => {
      if (!this.ppp) {
        this.ppp = true;

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
  oBox = null;
  oDiv = null;
  x
  y
  zoomSize = 1;
  DELTA = 0.05 // 每次放大/缩小的倍数
  down(e) {
    let current = this.GamepadController.getHandelState();
    current[e] = true;
    if (current.LEFT_ANALOG_LEFT || current.LEFT_ANALOG_UP || current.LEFT_ANALOG_RIGHT || current.LEFT_ANALOG_DOWN) {
      let angle = this.getAngle(current.LEFT_ANALOG_HORIZONTAL_AXIS, current.LEFT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move("LEFT_UP") : this.move("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move("UP") : this.move("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move("RIGHT_UP") : this.move("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move("RIGHT") : this.move("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move("RIGHT_DOWN") : this.move("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move("DOWN") : this.move("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move("LEFT_DOWN") : this.move("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
    } else if (current.RIGHT_ANALOG_LEFT || current.RIGHT_ANALOG_UP || current.RIGHT_ANALOG_RIGHT || current.RIGHT_ANALOG_DOWN) {
      let angle = this.getAngle(current.RIGHT_ANALOG_HORIZONTAL_AXIS, current.RIGHT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move("LEFT_UP") : this.move("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move("UP") : this.move("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move("RIGHT_UP") : this.move("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move("RIGHT") : this.move("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move("RIGHT_DOWN") : this.move("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move("DOWN") : this.move("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move("LEFT_DOWN") : this.move("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
    } else if (current.DPAD_DOWN || current.DPAD_LEFT || current.DPAD_RIGHT || current.DPAD_UP) {
      if (current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("UP") : this.move("DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("RIGHT") : this.move("LEFT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move("DOWN") : this.move("UP");
      else if (current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("RIGHT_UP") : this.move("LEFT_DOWN");
      else if (current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("LEFT_UP") : this.move("RIGHT_DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move("RIGHT_DOWN") : this.move("LEFT_UP");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move("LEFT_DOWN") : this.move("RIGHT_UP");
    }
  }
  down2(e) {
    let current = this.GamepadController.getHandelState();
    current[e] = true;
    if (current.LEFT_ANALOG_LEFT || current.LEFT_ANALOG_UP || current.LEFT_ANALOG_RIGHT || current.LEFT_ANALOG_DOWN) {
      let angle = this.getAngle(current.LEFT_ANALOG_HORIZONTAL_AXIS, current.LEFT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move_max("LEFT_UP") : this.move_max("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move_max("UP") : this.move_max("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move_max("RIGHT_UP") : this.move_max("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move_max("RIGHT") : this.move_max("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move_max("RIGHT_DOWN") : this.move_max("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move_max("DOWN") : this.move_max("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move_max("LEFT_DOWN") : this.move_max("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
    } else if (current.RIGHT_ANALOG_LEFT || current.RIGHT_ANALOG_UP || current.RIGHT_ANALOG_RIGHT || current.RIGHT_ANALOG_DOWN) {
      let angle = this.getAngle(current.RIGHT_ANALOG_HORIZONTAL_AXIS, current.RIGHT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move_max("LEFT_UP") : this.move_max("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move_max("UP") : this.move_max("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move_max("RIGHT_UP") : this.move_max("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move_max("RIGHT") : this.move_max("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move_max("RIGHT_DOWN") : this.move_max("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move_max("DOWN") : this.move_max("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move_max("LEFT_DOWN") : this.move_max("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
    } else if (current.DPAD_DOWN || current.DPAD_LEFT || current.DPAD_RIGHT || current.DPAD_UP) {
      if (current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("UP") : this.move_max("DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("RIGHT") : this.move_max("LEFT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move_max("DOWN") : this.move_max("UP");
      else if (current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("RIGHT_UP") : this.move_max("LEFT_DOWN");
      else if (current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("LEFT_UP") : this.move_max("RIGHT_DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move_max("RIGHT_DOWN") : this.move_max("LEFT_UP");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move_max("LEFT_DOWN") : this.move_max("RIGHT_UP");
    }
  }
  getAngle = (x, y): number => {
    x = parseFloat(x);
    y = parseFloat(y);
    var a = Math.atan2(y, x);
    var ret = a * 180 / Math.PI; //弧度转角度，方便调试
    if (ret > 360) {
      ret -= 360;
    }
    if (ret < 0) {
      ret += 360;
    }
    return ret;
  }

  // 放大移动图片
  move = (move) => {
    // this.isMouseDown = true;
    let transf = this.getTransform(this.oDiv);
    let multiple = transf.multiple;
    let newTransf = null;
    if (move == "UP") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY - 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "DOWN") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`;
        }, 15 * i)
      }
    }
    if (move == "RIGHT") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 20 * i, transf.transY, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "LEFT") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 20 * i, transf.transY, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "RIGHT_UP") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 20 * i, transf.transY - 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "RIGHT_DOWN") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 20 * i, transf.transY + 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "LEFT_UP") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 20 * i, transf.transY - 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "LEFT_DOWN") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 20 * i, transf.transY + 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    // if (move == "DOWN") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 50, transf.multiple)
    // if (move == "RIGHT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 50, transf.transY, transf.multiple)
    // if (move == "LEFT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 50, transf.transY, transf.multiple)
    // this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
  }
  move_max = (move) => {
    // this.isMouseDown = true;
    let transf = this.getTransform(this.oDiv);
    let multiple = transf.multiple;
    let newTransf = null;
    if (move == "UP") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY - 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "DOWN") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`;
    }
    if (move == "RIGHT") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 200000, transf.transY, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "LEFT") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 200000, transf.transY, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "RIGHT_UP") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 200000, transf.transY - 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "RIGHT_DOWN") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 200000, transf.transY + 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "LEFT_UP") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 200000, transf.transY - 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "LEFT_DOWN") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 200000, transf.transY + 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    // if (move == "DOWN") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 50, transf.multiple)
    // if (move == "RIGHT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 50, transf.transY, transf.multiple)
    // if (move == "LEFT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 50, transf.transY, transf.multiple)
    // this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
  }
  zoomIn = () => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple += this.DELTA;
    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
    this.zoomSize = transf.multiple;
  }
  zoomOut = () => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple -= this.DELTA
    if( transf.multiple<=0.8) transf.multiple=0.8

    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
    this.zoomSize = transf.multiple;
  }
  zoom = (e: number) => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple = e;
    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`;
    this.zoomSize = transf.multiple;
  }
  /**
 * 通过getComputedStyle获取transform矩阵 并用split分割
 * 如 oDiv 的 transform: translate(200, 200);
 * getComputedStyle可以取到"matrix(1, 0, 0, 1, 200, 200)"
 * 当transform属性没有旋转rotate和拉伸skew时
 * metrix的第1, 4, 5, 6个参数为 x方向倍数, y方向倍数, x方向偏移量, y方向偏移量
 * 再分别利用 字符串分割 取到对应参数
 */
  getTransform = DOM => {
    let arr = getComputedStyle(DOM).transform.split(',')
    return {
      transX: isNaN(+arr[arr.length - 2]) ? 0 : +arr[arr.length - 2], // 获取translateX
      transY: isNaN(+arr[arr.length - 1].split(')')[0]) ? 0 : +arr[arr.length - 1].split(')')[0], // 获取translateX
      multiple: +arr[3] // 获取图片缩放比例
    }
  }
  limitBorder = (innerDOM, outerDOM, moveX, moveY, multiple) => {
    let { clientWidth: innerWidth, clientHeight: innerHeight, offsetLeft: innerLeft, offsetTop: innerTop } = innerDOM
    let { clientWidth: outerWidth, clientHeight: outerHeight } = outerDOM
    let transX
    let transY
    // 放大的图片超出box时 图片最多拖动到与边框对齐
    if (innerWidth * multiple > outerWidth || innerHeight * multiple > outerHeight) {
      if (innerWidth * multiple > outerWidth && innerWidth * multiple > outerHeight) {
        transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
      } else if (innerWidth * multiple > outerWidth && !(innerWidth * multiple > outerHeight)) {
        transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
      } else if (!(innerWidth * multiple > outerWidth) && innerWidth * multiple > outerHeight) {
        transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
      }
    }
    // 图片小于box大小时 图片不能拖出边框
    else {
      transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
      transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
    }
    // console.log(transX,transY,multiple);

    return { transX, transY }
  }

}
