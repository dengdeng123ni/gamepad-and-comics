
import { Component, HostListener } from '@angular/core';
import { GamepadInputService, ImageService, KeyboardEventService, PagesItem } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { GamepadControllerService } from 'src/app/library/gamepad/gamepad-controller.service';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { ZoomService } from '../../services/zoom.service';
// import Swiper from 'swiper';
declare const Swiper: any;
@Component({
  selector: 'app-double-page-reader-v2-default',
  templateUrl: './double-page-reader-v2-default.component.html',
  styleUrls: ['./double-page-reader-v2-default.component.scss']
})
export class DoublePageReaderV2DefaultComponent {
  swiper = null;
  @HostListener('window:resize', ['$event'])
  resize = (event: KeyboardEvent) => {
    document.documentElement.style.setProperty('--double-page-reader-v2-width', '100vw');
    this.is_1 = false;
  }
  change$;
  event$;
  is_destroy = false;

  swiper_id = `_${new Date().getTime()}`;

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
        this.zoom.zoomSize <= 1 ? this.current._pagePrevious() : this.zoom.down("DPAD_LEFT");
      },
      "UP": () => {
        this.zoom.zoomSize <= 1 ? this.current._pagePrevious() : this.zoom.down("DPAD_UP");
      },
      "DOWN": () => {
        this.zoom.zoomSize <= 1 ? this.current._pageNext() : this.zoom.down("DPAD_DOWN");
      },
      "RIGHT": () => {
        this.zoom.zoomSize <= 1 ? this.current._pageNext() : this.zoom.down("DPAD_RIGHT");
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


    this.setTimeoutSwiper()
  }
  async setTimeoutSwiper(){
    setTimeout(async ()=>{
       if(this.is_destroy){

       }else{
        if(this.swiper.slides.length>0&&this.swiper.activeIndex==0){
          await this.next()
          this.setTimeoutSwiper()
        }else{
          this.setTimeoutSwiper()
        }
       }
    },1000)
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
    this.swiper = null;
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
      }, 3000)
    }

  }

  async previous() {
    const nodes = this.swiper.slides[0].querySelectorAll("[current_page]");
    if(this.swiper.activeIndex>2) return
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
        const next_chapter_id = await this.current._getNextChapterId(chapter_id);
        this.current._loadPages(next_chapter_id)
      }, 300)
    }
    if (index >= pages.length) {
      const next_chapter_id = await this.current._getNextChapterId(chapter_id);

      if (next_chapter_id) {
        const res = await this.current._getChapter(next_chapter_id);
        this.isSwitch = false;
        await this.addNextSlide(next_chapter_id, res, 0);
        return
      } else {
        return
      }
    } else {
      await this.addNextSlide(chapter_id, pages, index)
      return
    }
  }
  async next() {
    const nodes = this.swiper.slides[this.swiper.slides.length - 1].querySelectorAll("[current_page]");
    if((this.swiper.activeIndex+2)<(this.swiper.slides.length - 1)) return
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

        await this.addPreviousSlide(next_chapter_id, res, res.length - 1);
        return
      } else {
        return
      }
    } else {
      await this.addPreviousSlide(chapter_id, pages, index)
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
    const is_standalone_page = res.primary.end || res.primary.start;

    if (res.primary.end) current = current + await this.getBlankPage(res);
    if (res.secondary.src) current = current + `<img content_menu_key="pages_item" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.src) current = current + `<img content_menu_key="pages_item"  is_standalone_page="${is_standalone_page}" width="${c ? '_50' : '_100'}"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    if (res.primary.start) current = current + await this.getBlankPage(res);
    if (!!current) {
      this.objNextHtml[`${chapter_id}_${index}`] = `${chapter_id}_${index}`;
      setTimeout(() => {
        this.objNextHtml[`${chapter_id}_${index}`] = undefined;
      }, 1000)
      if (this.swiper.slides.length > 20) {
        this.ccc = true;
        const nodes = this.swiper.slides[this.swiper.slides.length - 1].querySelectorAll("img");
        for (let index = 0; index < nodes.length; index++) {
          const x = nodes[index];
          this.objNextHtml[`${x.getAttribute('chapter_id')}_${x.getAttribute('index')}`] = undefined;
        }
        const getrange = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => i + min)
        this.swiper.removeSlide(getrange(this.swiper.activeIndex+3, this.swiper.slides.length - 1).reverse());
        await this.sleep(581);
        this.ccc = false;
      }
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
    const is_standalone_page = res.primary.end || res.primary.start;
    if (res.primary.end) current = current + await this.getBlankPage(res);
    if (res.primary.src) current = current + `<img content_menu_key="pages_item"  is_standalone_page="${is_standalone_page}" width="${c ? '_50' : '_100'}"  current_page chapter_id=${chapter_id} index=${res.primary.index}  page_id="${res.primary.id}" src="${res.primary.src}" />`;
    if (res.secondary.src) current = current + `<img content_menu_key="pages_item" current_page chapter_id=${chapter_id} index=${res.secondary.index} page_id="${res.secondary.id}" src="${res.secondary.src}" />`;
    if (res.primary.start) current = current + await this.getBlankPage(res);
    if (!!current) {
      this.objPreviousHtml[`${chapter_id}_${index}`] = `${chapter_id}_${index}`;
      setTimeout(() => {
        this.objPreviousHtml[`${chapter_id}_${index}`] = undefined;
      }, 1000)
      if (this.swiper.slides.length > 20) {
        this.ccc = true;
        const nodes = this.swiper.slides[0].querySelectorAll("img");
        for (let index = 0; index < nodes.length; index++) {
          const x = nodes[index];
          this.objPreviousHtml[`${x.getAttribute('chapter_id')}_${x.getAttribute('index')}`] = undefined;
        }
        const getrange = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => i + min)
        this.swiper.removeSlide(getrange(0,this.swiper.activeIndex - 3));
        await this.sleep(581);
        this.ccc = false;
      }
      this.appendSlide(current)
    }
  }
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  async getBlankPage(res) {

    let current = ""

    if (this.data.comics_config.first_cover_background_color == "default" && this.data.comics_config.background_color != "frosted_glass") {
      let base64 = this.generateBase64(res.primary.width, res.primary.height, this.data.comics_config.background_color)
      current = current + `<img type="none" src="${base64}" />`;
    } else if (this.data.comics_config.first_cover_background_color == "transparent") {
      current = current + `<img type="none" style="opacity: 0;"   src="${res.primary.src}" />`;
    } else if (this.data.comics_config.first_cover_background_color == "#fff") {
      let base64 = this.generateBase64(res.primary.width, res.primary.height, "#ffffff")
      current = current + `<img type="none" src="${base64}" />`;
    } else if (this.data.comics_config.first_cover_background_color == "#000") {
      let base64 = this.generateBase64(res.primary.width, res.primary.height, "#000000")
      current = current + `<img type="none" src="${base64}" />`;
    } else {
      let base64 = this.generateBase64(res.primary.width, res.primary.height, "#ffffff")
      current = current + `<img type="none" src="${base64}" />`;
    }
    return current
  }
  prependSlide(src: string) {
    // if(this.swiper.slides.length>5) this.swiper.removeSlide((this.swiper.slides.length-1));
    if (
      !!src
    ) {
      this.swiper.prependSlide
        (`
     <div class="swiper-slide" style="display: flex;">
     <div class="swiper-zoom-container">
     <div style="display: flex;width: 100%; height: 100%;" class="swiper-zoom-target">  ${src}</div>
     </div>
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
       <div class="swiper-zoom-container">
     <div style="display: flex;width: 100%; height: 100%;" class="swiper-zoom-target">${src}</div>
     </div>
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
    if (primary && imgPrimary.width == 0 && imgPrimary.height == 0) primary.src = "error"
    if (secondary && imgSecondary.width == 0 && imgSecondary.height == 0) secondary.src = "error"

    if (imgPrimary.width != 0 && imgPrimary.width == imgSecondary.width && imgPrimary.height == imgSecondary.height && !this.is_1) {
      const size = this.data.comics_config.page_height / 100;
      if (imgPrimary.width > imgPrimary.height || imgSecondary.width > imgSecondary.height) {
        const width = ((imgPrimary.width / imgPrimary.height) * window.innerHeight * (size));
        document.documentElement.style.setProperty('--double-page-reader-v2-width', `${width < window.innerWidth ? width + 'px' : '100vw'}`);
      } else {

        const width = ((imgPrimary.width / imgPrimary.height) * window.innerHeight * (2 * size));
        document.documentElement.style.setProperty('--double-page-reader-v2-width', `${width < window.innerWidth ? width + 'px' : '100vw'}`);
      }
      this.is_1 = true
    }

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
    // 过渡动画 open close
    //
    let obj = {
      none: {
        name: "无",
        speed: 0
      },
      effect: {
        name: "平滑",
        effect: 'slide'
      },
      fade: {
        name: "淡出淡入",
        effect: 'fade',
        fadeEffect: {
          crossFade: true, // 是否交叉淡出
        }
      },
      coverflow: {
        name: "封面流",
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 50, // 旋转角度
          stretch: 0, // 每个滑块之间的拉伸值
          depth: 100, // 滑块之间的深度
          modifier: 1,
          slideShadows: true, // 是否显示阴影
        }
      },
      flip: {
        name: "翻转",
        effect: 'flip',
        flipEffect: {
          slideShadows: true, // 是否显示阴影
        }
      },
      creative: {
        name: "近大远小",
        effect: 'creative',
        creativeEffect: {
          prev: {
            translate: ['-120%', 0, -400], // 上一个滑块的位置变化
          },
          next: {
            translate: ['120%', 0, -400], // 下一个滑块的位置变化
          },
        }
      },
      creative_2: {
        name: "覆盖",
        effect: 'creative',
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
      },
      cards: {
        name: "卡片",
        effect: 'cards',
        cardsEffect: {
          slideShadows: true, // 是否显示阴影
        }
      },
      creative_3: {
        name: "旋转",
        effect: 'creative',
        creativeEffect: {
          prev: {
            translate: ['-100%', 0, -400], // 左侧滑块平移并远离视角
            rotate: [0, 0, -90], // 旋转
            scale: 0.5, // 缩小
            opacity: 0.6, // 改变透明度
          },
          next: {
            translate: ['100%', 0, -400], // 右侧滑块平移并远离视角
            rotate: [0, 0, 90], // 旋转
            scale: 0.5, // 缩小
            opacity: 0.6, // 改变透明度
          },
        },
      }
    }
    let objc = null;
    Object.keys(obj).forEach(x => {
      if (obj[x].name == this.data.comics_config.page_switching_effect) {
        objc = obj[x]
      }
    })
    if (!objc) objc = obj['creative_2']

    this.swiper = new Swiper(`#${this.swiper_id}`, {
      mousewheel: {
        thresholdDelta: 50,
        forceToAxis: false,
        thresholdTime: 1000,
      },
      zoom:true,
      grabCursor: true,
      ...objc
    });
    this.swiper.on('slidePrevTransitionEnd', async () => {
      if (!this.ccc) {
        this.ccc = true;

        await this.previous()

        this.ccc = false;

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

        await this.next()

        this.ccc = false;

      }
    });
  }

  generateBase64(width, height, bgColor) {
    // 创建 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 绘制背景
    ctx.fillStyle = bgColor; // 设置背景颜色
    ctx.fillRect(0, 0, width, height); // 绘制矩形

    // 导出为 Base64
    return canvas.toDataURL('image/png', 0.1); // 默认导出为 PNG 格式
  }

  ccc = false;
  bbb = false;
  ppp = false;


  //


}
