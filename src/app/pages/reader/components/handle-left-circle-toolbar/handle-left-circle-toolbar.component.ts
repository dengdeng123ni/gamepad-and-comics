import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DownloadService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { ModeChangeService } from '../mode-change/mode-change.service';
import { ReaderSettingsService } from '../reader-settings/reader-settings.service';
import { SectionService } from '../section/section.service';
import { SidebarLeftService } from '../sidebar-left/sidebar-left.service';
import { SlideBottomService } from '../slide-bottom/slide-bottom.service';
import { ThumbnailBottomService } from '../thumbnail-bottom/thumbnail-bottom.service';
import { ThumbnailService } from '../thumbnail-list/thumbnail.service';
import { HandleLeftCircleToolbarService } from './handle-left-circle-toolbar.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-handle-left-circle-toolbar',
  templateUrl: './handle-left-circle-toolbar.component.html',
  styleUrls: ['./handle-left-circle-toolbar.component.scss']
})
export class HandleLeftCircleToolbarComponent implements OnInit {
  index = 1;
  isfullscreen =!!document.fullscreenElement;
  menuObj = {
    list: [],
    type: "delete"
  }
  deleteMenuItemId = null;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public HandleLeftCircleToolbar: HandleLeftCircleToolbarService,
    public GamepadController: GamepadControllerService,
    public GamepadEvent: GamepadEventService,
    public config: ConfigReaderService,
    public current: CurrentReaderService,
    public thumbnail: ThumbnailService,
    public slideBottom: SlideBottomService,
    public left: SidebarLeftService,
    public ModeChange: ModeChangeService,
    public section: SectionService,
    public thumbnailBottom: ThumbnailBottomService,
    public readerSettings: ReaderSettingsService,
    public download: DownloadService,
    public i18n: I18nService
  ) {
    this.GamepadEvent.registerAreaEvent("handel_toolabr_menu", {
      B: () => {
        this.menu.closeMenu();
        this.GamepadController.setCurrentTargetId("handel_toolabr_left_delete")
        if (this.deleteMenuItemId) this.mouseoutDeleteMenu(this.deleteMenuItemId);
      },
      "UP": () => {
        this.GamepadController.setCurrentRegionTarget("UP");
      },
      "DOWN": () => {
        this.GamepadController.setCurrentRegionTarget("DOWN");
      },
      "LEFT": () => {
        this.GamepadController.setCurrentRegionTarget("LEFT");
      },
      "RIGHT": () => {
        this.GamepadController.setCurrentRegionTarget("RIGHT");
      },
      A: () => {
        this.GamepadController.leftKey();
        setTimeout(() => {
          this.GamepadController.setCurrentTargetId("handel_toolabr_left_delete")
        }, 50)
      },
      RIGHT_BUMPER: () => {

      },
      LEFT_BUMPER: () => {
      },
      LEFT_TRIGGER: () => {
      },
      RIGHT_TRIGGER: () => {
      }
    })

    GamepadEvent.registerHoverEvent("handel_toolabr_menu", {
      ENTER: e => {
        const id = parseInt(e.getAttribute("id"))
        this.mouseoverDeleteMenu(id);
        this.deleteMenuItemId = id;
      },
      LEAVE: e => {
        const id = parseInt(e.getAttribute("id"))
        this.mouseoutDeleteMenu(id);
        this.deleteMenuItemId = null;
      }
    })
  }

  ngOnInit(): void {
  }


  modeChange() {
    if (this.current.comics.mode != 4) this.current.mode$.next(this.current.comics.mode + 1)
    else this.current.mode$.next(1)
  }
  close() {

  }

  back() {
    window.history.back()
  }
  changeSpreadMatch() {
    this.current.switch$.next("");
  }
  change(e: any): void {
    if (e == this.current.comics.chapter.total) e--
    this.current.page$.next(e)
  }
  isFullChange(e) {
    this.isfullscreen = !this.isfullscreen;
    if (e == "window") {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    if (e == "full_screen") {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }

    }
  }
  firstPageCoverChange() {
    this.config.mode1.isFirstPageCover = !this.config.mode1.isFirstPageCover;
    if (this.current.comics.chapter.index == 0) {
      this.changeSpreadMatch();
      this.changeSpreadMatch();
    }
    this.config.save();
  }

  openDeleteMenu = ($event) => {

    this.menuObj.type = "delete"
    const node_reader_toolbar: any = document.querySelector("#reader_toolbar_page")
    // node_reader_toolbar.style.opacity = 1;

    this.menuObj.list = [];
    const p = $event.target.getBoundingClientRect();
    let node = (document.getElementById(`reader_toolbar_menu_1`) as any);
    node.style.top = `${p.y}px`;
    node.style.left = `${p.x + p.width + 4}px`;
    const nodes = document.querySelectorAll("[currentimage]")
    const images = (this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id)).images;
    for (let i = 0; i < nodes.length; i++) {
      const node: any = nodes[i];
      const imageId = node.getAttribute('id')
      const index = images.findIndex(x => x.id == imageId)
      this.menuObj.list.push({ name: index + 1, id: imageId })
    }
    setTimeout(() => {
      this.menu.openMenu()
      setTimeout(() => {
        this.GamepadController.setCurrentTargetId("handel_toolabr_menu_1");
      }, 50)
    }, 0)
  }
  closeMenu() {
    if (this.menuObj.type == "list") {
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    } else if (this.menuObj.type == "delete") {
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_page")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    }

  }
  mouseoverDeleteMenu(id) {
    const node = document.getElementById(id);
    if (node) node.style.opacity = "0.7";
  }
  mouseoutDeleteMenu(id) {
    const node = document.getElementById(id);
    if (node) node.style.opacity = "1";
  }
  async deleteImage(imageId) {
    const id = this.current.comics.id
    const chapterId = this.current.comics.chapter.id;
    await this.current.deletePage(id, chapterId, imageId);
    this.current.pageChange(this.current.comics.chapter.index)
  }
  onListMenuItemClick(id) {
    this.current.chapterChange(id);
  }
  async insertPage() {
    const id = this.current.comics.id
    const chapterId = this.current.comics.chapter.id;
    const images = this.current.comics.chapters.find(x => x.id == chapterId).images;
    const imagesId = images[this.current.comics.chapter.index].id;
    await this.current.insertPage(id, chapterId, imagesId)
    this.current.pageChange(this.current.comics.chapter.index)
  }
  cursorChange() {
    if (document.body.getAttribute("cursor") == "none") {
      document.body.setAttribute("cursor", "")
    } else {
      document.body.setAttribute("cursor", "none")
    }
  }
  handelClose() {
    document.body.setAttribute("pattern", "")
  }
  on($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (position.y + (position.height / 2)) - (openTargetHeight / 2);
    // this.uploadSelect.open({ x, y });
    this.ModeChange.open(null, "handle_mode_change")
  }
  openSettings() {
    this.readerSettings.open({
      panelClass: "reader_settings_center"
    })
  }
  // -------------

  downloadFile(type = "PDF") {
    const selectedList = this.current.comics.chapters.filter(x => x.id == this.current.comics.chapter.id)
    const page = this.config.mode == 1 ? 'double' : 'one';
    const isFirstPageCover = this.config.mode1.isFirstPageCover;
    const pageOrder = this.config.mode1.pageOrder;
    if (type == "PDF") {
      if (page == "one") this.download.pdf({ name: this.current.comics.title, chapters: selectedList, page })
      else this.download.pdf({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: selectedList, page });
    }
    if (type == "PPT") {
      if (page == "one") this.download.ppt({ name: this.current.comics.title, chapters: selectedList, page })
      else this.download.ppt({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: selectedList, page });
    }
    if (type == "ZIP") {
      if (page == "one") this.download.zip({ name: this.current.comics.title, chapters: selectedList, page })
      else this.download.zip({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: selectedList, page });
    }
  }
  async mergeImages() {
    const nodes: any = document.querySelectorAll(".swiper-slide-active img")
    if (nodes.length == 1) {
      const image1 = new Image();
      const req = await fetch(nodes[0].src);
      const blob = await req.blob();
      let name = `${this.current.comics.title}_${this.current.comics.chapter.title}_${this.current.comics.chapter.index}`;
      saveAs(blob, name);
    } else if (nodes.length == 2) {
      const image1 = await this.createImage(nodes[0].src);
      const image2 = await this.createImage(nodes[1].src);
      let canvas = document.createElement('canvas');
      canvas.width = image1.width + image2.width;
      canvas.height = (image1.height + image2.height) / 2;
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.drawImage(image1, 0, 0, image1.width, canvas.height);
      context.drawImage(image2, image1.width, 0, image2.width, canvas.height);
      let dataURL = canvas.toDataURL("image/png", 1);
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      let name = `${this.current.comics.title}_${this.current.comics.chapter.title}_${this.current.comics.chapter.index},${this.current.comics.chapter.index + 1}`;
      a.download = `${name}.png`; // 设置图片名称
      a.href = dataURL; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    } else {
      if (this.config.mode == 3) {
        const list = (this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id)).images
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          const x = list[i];
          const image = await this.createImage(x.src);
          arr.push(image)
        }
        let width = 0, height = 0;
        arr.forEach(x => {
          height = height + x.height;
        });

        const widthArr = [];
        arr.forEach(x => {
          const width1 = x.width / (x.height / (height / arr.length));
          widthArr.push(width1);
          width = width + width1;
        });
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height / arr.length;
        let context = canvas.getContext('2d');
        context.rect(0, 0, canvas.width, canvas.height);
        let x1 = 0;
        arr.reverse();
        widthArr.reverse();
        for (let i = 0; i < arr.length; i++) {
          const x = arr[i];
          context.drawImage(x, x1, 0, widthArr[i], canvas.height);
          x1 = x1 + widthArr[i];
        }
        let dataURL = canvas.toDataURL("image/png", 1);
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        let name = `${this.current.comics.title}_${this.current.comics.chapter.title}`
        a.download = `${name}.png`; // 设置图片名称
        a.href = dataURL; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      } else if (this.config.mode == 5) {
        const list = (this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id)).images
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          const x = list[i];
          const image = await this.createImage(x.src);
          arr.push(image)
        }
        let width = 0, height = 0;
        arr.forEach(x => {
          height = height + x.height;
        });

        const widthArr = [];
        arr.forEach(x => {
          const width1 = x.width / (x.height / (height / arr.length));
          widthArr.push(width1);
          width = width + width1;
        });
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height / arr.length;
        let context = canvas.getContext('2d');
        context.rect(0, 0, canvas.width, canvas.height);
        let x1 = 0;
        arr.reverse();
        widthArr.reverse();
        for (let i = 0; i < arr.length; i++) {
          const x = arr[i];
          context.drawImage(x, x1, 0, widthArr[i], canvas.height);
          x1 = x1 + widthArr[i];
        }
        let dataURL = canvas.toDataURL("image/png", 1);
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        let name = `${this.current.comics.title}_${this.current.comics.chapter.title}`
        a.download = `${name}.png`; // 设置图片名称
        a.href = dataURL; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      } else if (this.config.mode == 2) {
        const list = (this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id)).images
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          const x = list[i];
          const image = await this.createImage(x.src);
          arr.push(image)
        }
        let width = 0, height = 0;
        arr.forEach(x => {
          width = width + x.width;
        });
        const heightArr = [];
        arr.forEach(x => {
          const height1 = x.height / (x.width / (width / arr.length));
          heightArr.push(height1);
          height = height + height1;
        });
        let canvas = document.createElement('canvas');
        canvas.width = width / arr.length;
        canvas.height = height;
        let context = canvas.getContext('2d');
        context.rect(0, 0, canvas.width, canvas.height);
        let y1 = 0;
        for (let i = 0; i < arr.length; i++) {
          const x = arr[i];
          context.drawImage(x, 0, y1, canvas.width, heightArr[i]);
          y1 = y1 + heightArr[i];
        }
        let dataURL = canvas.toDataURL("image/png", 1);
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        let name = `${this.current.comics.title}_${this.current.comics.chapter.title}`
        a.download = `${name}.png`; // 设置图片名称
        a.href = dataURL; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      }

    }


  }
  createImage(src): any {
    if (!src) {
      return {
        width: 0,
        height: 0
      }
    }
    return new Promise((r, j) => {
      var img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.src = src;
      img.onload = function () {
        r(img)
        j(img)
      };
    })
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
  async separatePage() {
    const nodes: any = document.querySelectorAll("[currentimage]")
    if(nodes.length==1)
    {
      const comicsId = this.current.comics.id
      const chapterId = this.current.comics.chapter.id;
      const image1Id = parseInt(nodes[0].getAttribute("id"));
      const image1 = await this.createImage(nodes[0].src);
      let canvas1 = document.createElement('canvas');
      canvas1.width = (image1.width / 2);
      canvas1.height = image1.height;
      let context1 = canvas1.getContext('2d');
      context1.rect(0, 0, canvas1.width, canvas1.height);
      context1.drawImage(image1, 0, 0, image1.width, image1.height,0,0,image1.width, image1.height);
      let canvas2 = document.createElement('canvas');
      canvas2.width = (image1.width / 2);
      canvas2.height = image1.height;
      let context2 = canvas2.getContext('2d');
      context2.rect(0, 0, canvas2.width, canvas2.height);
      context2.drawImage(image1, canvas1.width, 0, image1.width, image1.height,0,0,image1.width, image1.height);
      let dataURL1 = canvas1.toDataURL("image/png");
      let dataURL2 = canvas2.toDataURL("image/png");
      await this.current.insertPage(comicsId, chapterId, image1Id, dataURL2)
      await this.current.insertPage(comicsId, chapterId, image1Id, dataURL1)
      await this.current.deletePage(comicsId, chapterId, image1Id);
      this.current.pageChange(this.current.comics.chapter.index)
    }
  }
  async mergePage() {
    const nodes: any = document.querySelectorAll("[currentimage]")
    if(nodes.length==2)
    {
      const comicsId = this.current.comics.id
      const chapterId = this.current.comics.chapter.id;
      const image1Id = parseInt(nodes[0].getAttribute("id"));
      const image2Id = parseInt(nodes[1].getAttribute("id"));
      const image1 = await this.createImage(nodes[0].src);
      const image2 = await this.createImage(nodes[1].src);
      let canvas = document.createElement('canvas');
      canvas.width = image1.width + image2.width;
      canvas.height = (image1.height + image2.height) / 2;
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.drawImage(image1, 0, 0, image1.width, canvas.height);
      context.drawImage(image2, image1.width, 0, image2.width, canvas.height);
      let dataURL = canvas.toDataURL("image/png", 1);
      await this.current.insertPage(comicsId, chapterId, image1Id, dataURL)
      await this.current.deletePage(comicsId, chapterId, image1Id);
      await this.current.deletePage(comicsId, chapterId, image2Id);
      this.current.pageChange(this.current.comics.chapter.index)
    }

  }




}
