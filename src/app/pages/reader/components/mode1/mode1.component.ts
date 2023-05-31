import { Component, HostListener, ViewChild } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { CurrentReaderService } from '../../services/current.service';
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
  Manipulation,
  SwiperOptions
} from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { ConfigReaderService } from '../../services/config.service';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { ReaderNavbarBarService } from '../reader-navbar-bar/reader-navbar-bar.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { SectionService } from '../section/section.service';
import { SquareThumbnailService } from '../square-thumbnail/square-thumbnail.service';
import { ThumbnailService } from '../thumbnail-list/thumbnail.service';
import { MagnifyOverlayService } from '../magnify-overlay/magnify-overlay.service';
SwiperCore.use([Manipulation, Navigation, Pagination, Mousewheel, Keyboard, Autoplay]);
@Component({
  selector: 'app-mode1',
  templateUrl: './mode1.component.html',
  styleUrls: ['./mode1.component.scss']
})
export class Mode1Component {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (document.body.getAttribute("locked_region") != "reader") return
    if (event.code == "Space") this.next()
    if (event.key == "c") this.current.switch$.next("");
    if (event.code == "ArrowUp") this.previous()
    if (event.code == "ArrowDown") this.next()
    if (event.code == "ArrowRight") this.next()
    if (event.code == "ArrowLeft") this.previous()
    if (event.code == "MetaRight" ||event.code == "MetaLeft") this.magnifyOverlay.open()
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event: KeyboardEvent) => {
    if (document.body.getAttribute("locked_region") != "reader") return
    if (event.code == "MetaRight" ||event.code == "MetaLeft") this.magnifyOverlay.close()
  }
  images = [];
  index = 0;
  total = 0;
  id = "";
  chapters = [];
  steps = 0;

  afterInit$ = null;
  chapter$ = null;
  page$ = null;
  switch$ = null;
  nextPage$ = null;
  previousPage$ = null;

  isSwitch = false;
  isOne = false;
  isPageFirst = true;

  constructor(
    public current: CurrentReaderService,
    public config: ConfigReaderService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public ReaderNavbarBar: ReaderNavbarBarService,
    public section: SectionService,
    public squareThumbnail: SquareThumbnailService,
    public thumbnail: ThumbnailService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public magnifyOverlay:MagnifyOverlayService
  ) {
    GamepadEvent.registerAreaEventY("reader_mode_1", {
      "LEFT_BUMPER": () => this.zoom(1),
      "RIGHT_BUMPER": () => this.zoom(2),
    })
    GamepadEvent.registerAreaEvent('reader_mode_1', {
      "UP": () => {
        this.zoomSize <= 1 ? this.previous() : this.down("DPAD_UP");
      },
      "DOWN": () => {
        this.zoomSize <= 1 ? this.next() : this.down("DPAD_DOWN");
      },
      "LEFT": () => {
        this.zoomSize <= 1 ? this.previous() : this.down("DPAD_LEFT");
      },
      "RIGHT": () => {
        this.zoomSize <= 1 ? this.next() : this.down("DPAD_RIGHT");
      },
      X: () => {
        this.current.switch$.next("");
      },
      A: () => {
        this.current.nextPage$.next(true);
      },
      B: () => {
        window.history.back();
      },
      "LEFT_BUMPER": () => this.zoomOut(),
      "RIGHT_BUMPER": () => this.zoomIn(),
      RIGHT_ANALOG_PRESS: () => {
        this.ReaderNavbarBar.isToggle();
      },
      LEFT_TRIGGER: () => {
        current.previous()
      },
      RIGHT_TRIGGER: () => {
        current.next();
      }
    })
    GamepadEvent.registerAreaEventY('reader_mode_1', {
      "LEFT": () => {
        if (this.zoomSize <= 1) {
          this.thumbnail.isToggle()
        } else {
          this.down2("DPAD_LEFT")
        }
      },
      "UP": () => {
        if (this.zoomSize <= 1) {
          this.squareThumbnail.open()
        } else {
          this.down2("DPAD_UP");
        }

      },
      "DOWN": () => {
        if (this.zoomSize <= 1) {
          this.section.isToggle()
        } else {
          this.down2("DPAD_DOWN");
        }

      },
      "RIGHT": () => {
        if (this.zoomSize <= 1) {
          this.doublePageThumbnail.open({
            id: this.current.comics.chapter.id,
            index: this.current.comics.chapter.index
          })
        } else {
          this.down2("DPAD_RIGHT");
        }

      },
    })
    const { id, index } = this.current.comics.chapter;

    const { chapters } = this.current.comics;
    const chapter = chapters.find(x => x.id == id);
    const images = chapter.images;
    this.images = images;
    this.index = index;
    this.total = images.length;
    this.change(this.index);

    // this.afterInit$ = this.current.afterInit().subscribe(async x => {
    //   const { id, index } = this.current.comics.chapter;
    //   const { chapters } = this.current.comics;
    //   const chapter = chapters.find(x => x.id == id);
    //   const images = chapter.images;
    //   this.images = images;
    //   this.index = index;
    //   this.total = images.length;
    //   this.current.pageChange(this.index);
    // })
    this.chapter$ = this.current.chapter().subscribe(async x => {
      const { id, index } = this.current.comics.chapter;
      const { chapters } = this.current.comics;
      const chapter = chapters.find(x => x.id == id);
      const images = chapter.images;
      this.images = images;
      this.index = index;
      this.total = images.length;
      this.current.pageChange(this.index);
      this.isPageFirst = true;
      this.isSwitch = false;
    })
    this.page$ = this.current.page().subscribe(async (index: number) => {
      this.change(index);
    })
    this.switch$ = this.current.switch().subscribe(() => {
      if (this.index == 0) {
        this.page$.next(this.index);
      } else {
        if (this.index == this.images.length - 1) {
          this.page$.next(this.isSwitch ? this.index - 1 : this.index - 1);
          // this.isSwitch = !this.isSwitch;
        } else {
          this.page$.next(this.isSwitch ? this.index - 1 : this.index + 1);
        }
      }
      this.isSwitch = !this.isSwitch;
    })
    this.nextPage$ = this.current.nextPage().subscribe(() => {
      this.config.mode1.isPageTurnDirection ? this.next() : this.previous();
    })
    this.previousPage$ = this.current.previousPage().subscribe(() => {
      this.config.mode1.isPageTurnDirection ? this.previous() : this.next();
    })
  }
  ngOnDestroy() {
    this.switch$.unsubscribe();
    this.chapter$.unsubscribe();
    // this.afterInit$.unsubscribe();
    this.page$.unsubscribe();
    this.nextPage$.unsubscribe();
    this.previousPage$.unsubscribe();
  }
  appendSlide(src) {
    this.swiper.swiperRef.appendSlide
      (`
     <div class="swiper-slide">
      <div style="width: 100%;height:100%;"  ></div>
       ${src}
      <div style="width: 100%;height:100%;"  ></div>
     </div>
    `)
  }
  slidePrevTransitionEnd(swiper) {
    if (this.isMobile) {
      this.config.mode1.isPageTurnDirection ? this.previous() : this.next();
    } else {
      if (!this.isWaitPrevious) {
        this.isWaitPrevious = true;
        setTimeout(() => {
          this.config.mode1.isPageTurnDirection ? this.previous() : this.next();
          this.isWaitPrevious = false;
        }, 400)
      }
    }

  }
  slideNextTransitionEnd(swiper) {
    if (this.isMobile) {
      this.config.mode1.isPageTurnDirection ? this.next() : this.previous();
    } else {
      if (!this.isWaitNext) {
        this.isWaitNext = true;
        setTimeout(() => {
          this.config.mode1.isPageTurnDirection ? this.next() : this.previous();
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
    },
    direction: this.config.mode1.slidingDirection == "vertical" ? "vertical" : "horizontal",
    scrollbar: { draggable: true },
  };

  slideChange($event) {

  }
  async change(index) {

    if (Number.isNaN(index)) index = 0;
    this.index = index;
    if (this.index < 0) this.index = 0;
    const res = await this.getCurrentImages(this.images, this.index);
    if (!res.previous.primary.image.src && !res.previous.secondary.image.src) res.previous = await this.getPreviousLast();
    if (!res.next.primary.image.src && !res.next.secondary.image.src) res.next = await this.getNextFirst();

    this.steps = res.steps;
    let previous = "";
    let next = "";
    let current = "";

    if (this.current.comics.pageOrder) {
      // 普通模式
      if (res.previous.primary.start) previous = previous + `<img style="opacity: 0;"  src="${res.previous.primary.image.src}" />`;
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

    if (this.config.mode1.isPageTurnDirection) {
      if (previous) this.appendSlide(previous)
      if (current) this.appendSlide(current)
      if (next) this.appendSlide(next)
      if (previous) this.swiper.swiperRef.slideTo(1, 0, false);
    } else {
      if (next) this.appendSlide(next)
      if (current) this.appendSlide(current)
      if (previous) this.appendSlide(previous)
      if (previous) this.swiper.swiperRef.slideTo(1, 0, false);
    }
    this.image(res.current.secondary.image.id)
    // this.image(res.current.primary.image.id)

  }

  image(id) {
    const nodes = document.querySelectorAll(`[currentimage]`);
    if (!nodes.length) return
    const update = (id, startTime, endTime) => {
      this.current.imageReadingTime$.next({ imageId: id, chapterId: chapterId, comicsId: comicsId, startTime: startTime, endTime: endTime })
    }
    let ids = [];
    const chapterId = this.current.comics.chapter.id;
    const comicsId = this.current.comics.id;
    nodes.forEach(x => ids.push(x.getAttribute('id')))
    let endTime = null;
    let startTime = new Date().getTime();
    var observer = new IntersectionObserver(
      function (changes) {
        changes.forEach(function (change: any) {
          var container = change.target;
          if (change.intersectionRatio == 0) {
            observer.unobserve(container);
            endTime = new Date().getTime();
            if (ids.length == 1) {
              ids = ids.map(x => parseInt(x)).sort((a, b) => a - b);
              update(ids[0], startTime, endTime);
            }
            if (ids.length == 2) {
              ids = ids.map(x => parseInt(x)).sort((a, b) => a - b);
              const middleTime = startTime + (Math.trunc((endTime - startTime) / 2))
              update(ids[0], startTime, middleTime);
              update(ids[1], middleTime, endTime);
            }
          }
        });
      }
    );
    const node = document.querySelector(`[currentimage]`);
    observer.observe(node);
  }
  next() {
    const nodes = document.querySelectorAll(`[currentimage]`);
    const index = this.index + nodes.length;
    if (index >= this.total) {
      this.current.nextFirst();
      return
    }
    this.current.pageChange(index);
  }
  async previous() {
    let images = this.images;
    let index = this.index;

    if (index >= 2) {
      let a = await this.loadImage(images[index - 1].src);
      let c = await this.loadImage(images[index - 2].src);
      if (a.width < a.height && c.width < c.height) {
        this.steps = 2;
      } else {
        this.steps = 1;
        this.isOne = true;
      }
    } else {
      this.steps = 1;
    }
    if ((index - 1) < 0) {
      this.current.previousLast();
      return
    }


    index = index - this.steps;
    this.current.pageChange(index);

  }
  // on($event) {
  //   if ($event.clientX < (window.innerWidth / 2)) this.previous()
  //   else this.next();
  // }
  async getNextFirst() {
    const res = {
      next: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }
    const { id } = this.current.comics.chapter;
    const { chapters } = this.current.comics;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex + 1];
    const index = 0;
    if (chapter) {
      const images = chapter.images;
      const obj = await this.isWideImage(images[index], images[index + 1]);
      const total = images.length;

      if (this.current.comics.isFirstPageCover == true && index == 0) {
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
  async getPreviousLast() {
    const res = {
      previous: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }
    const { id } = this.current.comics.chapter;
    const { chapters } = this.current.comics;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex - 1];

    if (chapter) {
      const images = chapter.images;
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

  loadImage = (url: string) => {
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
  createImage = async (imageUrl): Promise<ImageBitmap> => await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))

  isWideImage = async (primary: any, secondary: any) => {
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

  async getCurrentImages(images: Array<string>, index: number) {
    const total = images.length;

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
    const obj = await this.isWideImage(images[index], images[index + 1]);
    let steps = 0;
    if (obj.primary.width > obj.primary.height || obj.secondary.width > obj.secondary.height) {
      steps = 1;
      obj.secondary.image = "";
    } else {
      steps = 2;
    }

    if (this.isOne) {
      this.isOne = false;
      obj.secondary.image = "";
      steps = 1;
    }

    if (this.isPageFirst) {
      this.isPageFirst = false;
      if (this.current.comics.isFirstPageCover == true && index == 0) {
        obj.secondary.image = "";
        steps = 1;
      }
    } else {
      if (index == 0 && !this.isSwitch && this.current.comics.isFirstPageCover == true) {
        obj.secondary.image = "";
        steps = 1;
      }
      if (index == 0 && this.isSwitch && this.current.comics.isFirstPageCover == false) {
        obj.secondary.image = "";
        steps = 1;
      }
    }

    const [objPrevious, objNext] = await Promise.all([
      this.isWideImage(images[index - 1], images[index - 2]),
      this.isWideImage(images[index + steps], images[index + steps + 1])
    ]);
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
    this.oBox = document.querySelector('#mode1')
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
    // console.log(transX,transY,multiple);

    return { transX, transY }
  }


}
