import { Component, HostListener, ViewChild } from '@angular/core';
import { async, forkJoin, Observable } from 'rxjs';
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
  Manipulation,
  SwiperOptions,
  Swiper
} from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ImageService, PagesItem } from 'src/app/library/public-api';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { GamepadControllerService } from 'src/app/library/gamepad/gamepad-controller.service';
SwiperCore.use([Manipulation, Navigation, Pagination, Mousewheel, Keyboard, Autoplay]);
@Component({
  selector: 'app-double-page-reader',
  templateUrl: './double-page-reader.component.html',
  styleUrls: ['./double-page-reader.component.scss']
})


export class DoublePageReaderComponent {
  @ViewChild('swiper', { static: false }) swiper!: SwiperComponent;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == "ArrowRight") this.current._pageNext();
    if (event.key == "ArrowLeft") this.current._pagePrevious();
    if (event.key == "c") this.pageToggle();
    if (event.key == "v") this.firstPageToggle();
    if (event.code == "Space") {
      this.swiper.swiperRef.slideNext()
      return false
    }
    return true
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event: KeyboardEvent) => {
  }
  list: Array<PagesItem> = [];

  index = 0;

  steps = 1;

  isSwitch = false;

  isPageFirst = true;
  isFirst = false;
  is_first_page_cover = false;

  change$;
  event$;

  is_init = false;


  constructor(
    public current: CurrentService,
    public data: DataService,
    public image: ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService
  ) {
    GamepadEvent.registerAreaEventY("double_page_reader", {
      "LEFT_BUMPER": () => this.zoom(1),
      "RIGHT_BUMPER": () => this.zoom(2),
      RIGHT: () => this.imageRotation()
    })
    GamepadEvent.registerAreaEvent('double_page_reader', {
      "UP": () => {
        this.zoomSize <= 1 ? current._pagePrevious() : this.down("DPAD_UP");
      },
      "DOWN": () => {

        this.zoomSize <= 1 ? current._pageNext() : this.down("DPAD_DOWN");
      },
      "LEFT": () => {

        this.zoomSize <= 1 ? current._pagePrevious() : this.down("DPAD_LEFT");
      },
      "RIGHT": () => {
        this.zoomSize <= 1 ? current._pageNext() : this.down("DPAD_RIGHT");
      },
      X: () => {
        this.pageToggle();
      },
      A: () => {
        current._pageNext();
      },
      B: () => {
        window.history.back();
      },
      "LEFT_BUMPER": () => this.zoomOut(),
      "RIGHT_BUMPER": () => this.zoomIn(),
      // RIGHT_ANALOG_PRESS: () => {
      //   this.ReaderNavbarBar.isToggle();
      // },
      LEFT_TRIGGER: () => {
        current._chapterNext();
      },
      RIGHT_TRIGGER: () => {
        current._chapterPrevious();
      }
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


    this.list = this.data.pages as any;
    this.init2();

    this.change$ = this.current.change().subscribe(x => {
      this.zoom(1);
      if (x.type == "changePage") {
        this.execute(x.page_index);
      } else if (x.type == "changeChapter") {
        this.list = x.pages;
        this.isPageFirst = true;
        this.isSwitch = false;
        this.execute(x.page_index);
      } else if (x.type == "nextPage") {
        this.next()
      } else if (x.type == "previousPage") {
        this.previous()
      }
    })
    this.event$ = this.current.event().subscribe(x => {
      if (x.key == "double_page_reader_FirstPageToggle") {
        this.firstPageToggle();
      } else if (x.key == "double_page_reader_togglePage") {
        this.pageToggle();
      }
    })


  }
  async init2() {
    if (Number.isNaN(this.data.page_index)) this.data.page_index = 0;
    this.index = this.data.page_index;
    await this.change(this.data.page_index)
    let cc = document.querySelector("#double_page_reader") as any
    cc.style.opacity = 1;


  }
  runs = [];
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  async execute(page_index) {
    if (Number.isNaN(page_index)) page_index = 0;
    if (this.runs.length == 0) {
      this.runs.push(page_index)
      this.index = page_index;
      const start = this.runs.length
      await this.change(page_index);
      await this.sleep(100)
      const end = this.runs.length
      if (start != end) {
        const index = this.runs.at(-1);
        this.runs = [];
        this.execute(index)
      } else {
        this.runs = [];
      }
    } else {
      this.runs.push(page_index)
      this.index = page_index;
    }

  }

  imageRotation() {
    const node: any = document.querySelector(".swiper-slide-active")
    const rotate = node.getAttribute("rotate");
    const nodes: any = document.querySelectorAll(".swiper-slide-active img")
    if (nodes.length == 1) {
      const scale = (nodes[0].height / nodes[0].width)
      if (rotate == "90") {
        node.style = `transform: rotate(180deg) scale(1);`;
        node.setAttribute("rotate", "180")
      } else if (rotate == "180") {
        node.style = `transform: rotate(270deg) scale(${scale});`;
        node.setAttribute("rotate", "270")
      }
      else if (rotate == "270") {
        node.style = "";
        node.setAttribute("rotate", "")
      } else {
        node.style = `transform: rotate(90deg) scale(${scale});`;
        node.setAttribute("rotate", "90")
      }
    } else if (nodes.length == 2) {
      const scale = ((nodes[0].height + nodes[1].height) / 2 / (nodes[0].width + nodes[1].width))
      if (rotate == "90") {
        node.style = `transform: rotate(180deg) scale(1);`;
        node.setAttribute("rotate", "180")
      } else if (rotate == "180") {
        node.style = `transform: rotate(270deg) scale(${scale});`;
        node.setAttribute("rotate", "270")
      }
      else if (rotate == "270") {
        node.style = "";
        node.setAttribute("rotate", "")
      } else {
        node.style = `transform: rotate(90deg) scale(${scale});`;
        node.setAttribute("rotate", "90")
      }
    }

  }

  ngOnDestroy() {
    this.change$.unsubscribe();
    this.event$.unsubscribe();
  }

  firstPageToggle() {
    this.is_first_page_cover = !this.is_first_page_cover;
    if (this.index == 0) {
      this.pageToggle();
      this.pageToggle();
    } else {

    }
  }

  pageToggle() {
    if (this.index == 0) {
      this.current._pageChange(this.index);
    } else {
      if (this.index == this.list.length - 1) {
        this.current._pageChange(this.isSwitch ? this.index - 1 : this.index - 1);
        // this.isSwitch = !this.isSwitch;
      } else {
        this.current._pageChange(this.isSwitch ? this.index - 1 : this.index + 1);
      }
    }
    this.isSwitch = !this.isSwitch;
  }


  slidePrevTransitionEnd(swiper: Array<Swiper>) {


  }
  slideNextTransitionEnd(swiper: Array<Swiper>) {
    if (this.isMobile) {
      this.data.comics_config.is_page_direction ? this.next() : this.previous();
    } else {
      if (!this.isWaitNext) {
        this.isWaitNext = true;
        setTimeout(() => {
          this.data.comics_config.is_page_direction ? this.next() : this.previous();
          this.isWaitNext = false;
        }, 400)
      }
    }
  }
  isWaitPrevious = false;
  isWaitNext = false;
  isMobile = false;

  swiperConfig: SwiperOptions = {
    mousewheel: {
      thresholdDelta: 50,
      forceToAxis: false,
      thresholdTime: 1000,
    },
    keyboard: true,
    direction: "vertical",
    scrollbar: { draggable: true },
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
  };


  interleaveOffset = 0.5; //视差比值

  // var swiperOptions = {
  //   loop: true,
  //   speed: 1000,
  //   grabCursor: true,
  //   watchSlidesProgress: true,
  //   mousewheelControl: true,
  //
  //   navigation: {
  // 	nextEl: ".swiper-button-next",
  // 	prevEl: ".swiper-button-prev"
  //   },

  // };

  // var swiper = new Swiper(".swiper-container", swiperOptions);


  slideChange($event: Array<Swiper>) {

  }
  async next() {
    const nodes = document.querySelectorAll(`[currentimage]`);

    const index = this.index + nodes.length;

    if (index >= this.list.length) {
      this.list = await this.current._setNextChapter();
      this.isPageFirst = true;
      this.isSwitch = false;
      this.current._pageChange(0)
      return
    }
    this.current._pageChange(index);
  }
  async previous() {
    let list = this.list;
    let index = this.index;

    if (index >= 2) {
      let a = await this.loadImage(list[index - 1].src);
      let c = await this.loadImage(list[index - 2].src);
      if (a.width < a.height && c.width < c.height) {
        this.steps = 2;
      } else {
        this.steps = 1;
        this.isFirst = true;
      }
    } else {
      this.steps = 1;
    }
    if ((index - 1) < 0) {
      this.list = await this.current._setPreviousChapter();
      this.isPageFirst = true;
      this.isSwitch = false;
      this.current._pageChange(this.list.length - 1)
      return
    }


    index = index - this.steps;
    this.current._pageChange(index);
  }
  async change(index: number) {
    if (this.isPageFirst && index == 0) this.is_first_page_cover = await this.current._getChapter_IsFirstPageCover(this.data.chapter_id);
    const res: any = await this.getCurrentImages(this.list, index);
    if (!res.previous.primary.image.src && !res.previous.secondary.image.src) res.previous = await this.getPreviousLast();
    if (!res.next.primary.image.src && !res.next.secondary.image.src) res.next = await this.getNextFirst();


    this.steps = res.steps;
    let previous = "";
    let next = "";
    let current = "";

    if (this.data.comics_config.is_page_order) {
      // 普通模式
      if (res.previous.primary.start) previous = previous + `<img style="opacity: 0;" src="${res.previous.primary.image.src}" />`;
      if (res.previous.secondary.image.src) previous = previous + `<img previousimage id="${res.previous.secondary.image.id}" src="${res.previous.secondary.image.src}" />`;
      if (res.previous.primary.image.src) previous = previous + `<img previousimage id="${res.previous.primary.image.id}" src="${res.previous.primary.image.src}" />`;
      if (res.previous.primary.end) previous = previous + `<img style="opacity: 0;" src="${res.previous.primary.image.src}" />`;

      if (res.current.primary.start) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;
      if (res.current.primary.image.src) current = current + `<img  currentimage id="${res.current.primary.image.id}" src="${res.current.primary.image.src}" />`;
      if (res.current.secondary.image.src) current = current + `<img currentimage id="${res.current.secondary.image.id}" src="${res.current.secondary.image.src}" />`;
      if (res.current.primary.end) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;

      if (res.next.primary.start) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
      if (res.next.primary.image.src) next = next + `<img nextimage id="${res.next.primary.image.id}" src="${res.next.primary.image.src}" />`;
      if (res.next.secondary.image.src) next = next + `<img nextimage id="${res.next.secondary.image.id}" src="${res.next.secondary.image.src}" />`;
      if (res.next.primary.end) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
    } else {
      // 日漫模式
      if (res.previous.primary.end) previous = previous + `<img style="opacity: 0;" src="${res.previous.primary.image.src}" />`;
      if (res.previous.primary.image.src) previous = previous + `<img previousimage id="${res.previous.primary.image.id}" src="${res.previous.primary.image.src}" />`;
      if (res.previous.secondary.image.src) previous = previous + `<img previousimage id="${res.previous.secondary.image.id}" src="${res.previous.secondary.image.src}" />`;
      if (res.previous.primary.start) previous = previous + `<img style="opacity: 0;"  src="${res.previous.primary.image.src}" />`;

      if (res.current.primary.end) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;
      if (res.current.secondary.image.src) current = current + `<img currentimage id="${res.current.secondary.image.id}" src="${res.current.secondary.image.src}" />`;
      if (res.current.primary.image.src) current = current + `<img  currentimage id="${res.current.primary.image.id}" src="${res.current.primary.image.src}" />`;
      if (res.current.primary.start) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;

      if (res.next.primary.end) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
      if (res.next.secondary.image.src) next = next + `<img nextimage id="${res.next.secondary.image.id}" src="${res.next.secondary.image.src}" />`;
      if (res.next.primary.image.src) next = next + `<img nextimage id="${res.next.primary.image.id}" src="${res.next.primary.image.src}" />`;
      if (res.next.primary.start) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
    }

    this.swiper.swiperRef.removeAllSlides();
    if (this.data.comics_config.is_page_direction) {
      if (!!previous) this.appendSlide(previous)
      if (!!current) this.appendSlide(current)
      if (!!next) this.appendSlide(next)
      if (!!previous) this.swiper.swiperRef.slideTo(1, 0, false);
    } else {
      if (!!next) this.appendSlide(next)
      if (!!current) this.appendSlide(current)
      if (!!previous) this.appendSlide(previous)
      if (!!previous) this.swiper.swiperRef.slideTo(1, 0, false);
    }
  }
  appendSlide(src: string) {
    this.swiper.swiperRef.appendSlide
      (`
     <div class="swiper-slide">
      <div style="width: 100%;height:100%;"  ></div>
       ${src}
      <div style="width: 100%;height:100%;"  ></div>
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

    try {
      const [imgPrimary, imgSecondary] = await Promise.all([this.loadImage(primary?.src), this.loadImage(secondary?.src)]);
      if (imgPrimary.width > imgPrimary.height || imgSecondary.width > imgSecondary.height) {

        return {
          'primary': { image: primary ?? "", width: imgPrimary.width, height: imgPrimary.height },
          'secondary': { image: { src: "", id: null }, width: imgSecondary.width, height: imgSecondary.height }
        };
      } else {
        return {
          'primary': { image: primary ?? "", width: imgPrimary.width, height: imgPrimary.height },
          'secondary': { image: secondary ?? "", width: imgSecondary.width, height: imgSecondary.height }
        };
      }
    } catch (e) {
      return {
        'primary': { image: primary ?? "", width: 0, height: 0 },
        'secondary': { image: secondary ?? "", width: 0, height: 0 }
      };
    }
  }

  async getCurrentImages(list: Array<PagesItem>, index: number) {
    const total = list.length;

    const res = {
      steps: 0,
      previous: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
      current: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
      next: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }
    const obj = await this.isWideImage(list[index], list[index + 1]);
    let steps = 0;
    if (obj.primary.width > obj.primary.height || obj.secondary.width > obj.secondary.height) {
      steps = 1;
      obj.secondary.image = "";
    } else {
      steps = 2;
    }

    if (this.isFirst) {
      this.isFirst = false;
      obj.secondary.image = "";
      steps = 1;
    }

    if (this.isPageFirst) {
      this.isPageFirst = false;
      if (this.is_first_page_cover == true && index == 0) {
        obj.secondary.image = "";
        steps = 1;
      }
    } else {
      if (index == 0 && !this.isSwitch && this.is_first_page_cover == true) {
        obj.secondary.image = "";
        steps = 1;
      }
      if (index == 0 && this.isSwitch && this.is_first_page_cover == false) {
        obj.secondary.image = ""
        steps = 1;
      }
    }

    const [objPrevious, objNext] = await Promise.all([
      this.isWideImage(list[index - 1], list[index - 2]),
      this.isWideImage(list[index + steps], list[index + steps + 1])
    ]);
    setTimeout(() => {
      if (list[index + steps + 2]) this.loadImage(list[index + steps + 2]?.src)
      if (list[index + steps + 3]) this.loadImage(list[index + steps + 3]?.src)
      if (index >= list.length - 3) this.loadingNextFirstPage();
    }, 100)
    if (index >= (total - 1) && !obj.secondary.image) {
      if (obj.primary.width < obj.primary.height) res.current.primary.end = true;
    }
    if (obj.secondary.image) res.current.secondary.image = obj.secondary.image;
    if (obj.primary.image) res.current.primary.image = obj.primary.image;
    if (index == 0 && !obj.secondary.image) {
      if (obj.primary.width < obj.primary.height) res.current.primary.start = true;
    }

    if (objPrevious.primary.image) res.previous.primary.image = objPrevious.primary.image;
    if (objPrevious.secondary.image) res.previous.secondary.image = objPrevious.secondary.image;
    if (((index - 1) == 0 || (index - 2) == 0) && !objPrevious.secondary.image) {
      if (objPrevious.primary.width < objPrevious.primary.height) res.previous.primary.start = true;
    }

    if (((index + 1) >= (total - 1) || (index + 2) >= (total - 1)) && !objNext.secondary.image) {
      if (objNext.primary.width < objNext.primary.height) res.next.primary.end = true;
    }
    if (objNext.secondary.image) res.next.secondary.image = objNext.secondary.image;
    if (objNext.primary.image) res.next.primary.image = objNext.primary.image;
    res.steps = steps;

    return res
  }




  // ------------------------------------------------------------------------------------------
  ngAfterViewInit() {
    setTimeout(() => {
      this.init();
    })
  }
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
  init = () => {
    this.oBox = document.querySelector('#double_page_reader')
    this.oDiv = document.querySelector('.warp')
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
  // 放大
  zoomIn = () => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple += this.DELTA;
    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
    this.zoomSize = transf.multiple;
  }
  // 缩小
  zoomOut = () => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple -= this.DELTA
    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
    this.zoomSize = transf.multiple;

  }
  // 指定缩放
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

  /**
   * 获取边框限制的transform的x, y偏移量
   * innerDOM: 内盒子DOM
   * outerDOM: 边框盒子DOM
   * moveX: 盒子的x移动距离
   * moveY: 盒子的y移动距离
   */
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

    return { transX, transY }
  }

}
