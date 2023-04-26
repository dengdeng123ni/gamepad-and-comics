import { Component, OnInit } from '@angular/core';
import { DownloadService, I18nService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { ModeChangeService } from '../mode-change/mode-change.service';
import { ReaderSettingsService } from '../reader-settings/reader-settings.service';
import { SectionService } from '../section/section.service';
import { SidebarLeftService } from '../sidebar-left/sidebar-left.service';
import { SlideBottomService } from '../slide-bottom/slide-bottom.service';
import { ThumbnailBottomService } from '../thumbnail-bottom/thumbnail-bottom.service';
import { ThumbnailService } from '../thumbnail-list/thumbnail.service';
import { saveAs } from 'file-saver';
import { ReadTimeService } from '../read-time/read-time.service';
import { ReaderAutoService } from '../reader-auto/reader-auto.service';
import { ReaderAutoSettingsService } from '../reader-auto-settings/reader-auto-settings.service';
@Component({
  selector: 'app-popup-toolbar',
  templateUrl: './popup-toolbar.component.html',
  styleUrls: ['./popup-toolbar.component.scss']
})
export class PopupToolbarComponent implements OnInit {

  constructor(
    public thumbnail: ThumbnailService,
    public slideBottom: SlideBottomService,
    public left: SidebarLeftService,
    public ModeChange: ModeChangeService,
    public section: SectionService,
    public thumbnailBottom: ThumbnailBottomService,
    public readerSettings:ReaderSettingsService,
    public i18n:I18nService,
    public current: CurrentReaderService,
    public config:ConfigReaderService,
    public download:DownloadService,
    public readTime:ReadTimeService,
    public readerAuto:ReaderAutoService,
    public readerAutoSettings:ReaderAutoSettingsService
  ) { }
  expanded = false;
  ngOnInit(): void {
  }
  openReaderAutoSettings($event) {
    if(this.readerAuto.opened){
     this.readerAuto.close();
     return
    }
    // readerSettings.open_bottom_sheet({});
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = window.innerWidth-x+8;
    y = (window.innerHeight) - (y+height/2) -54;
    this.readerAutoSettings.open({
      position: {
        bottom: `${y}px`,
        right: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }
  on($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y =( window.innerHeight-512)/2;
    // this.uploadSelect.open({ x, y });
    this.ModeChange.open({ top:`${y}px`, right:`${x}px` })
  }
  openSettings($event){
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (position.y + (position.height / 2)) - (openTargetHeight / 2);
     this.readerSettings.open({
      position:{ top:`${y}px`, right:`${x}px` },
      delayFocusTrap:false,
      panelClass:"reader_settings_right",
      backdropClass:"reader_settings_right_backdrop",
     })
  }
  downloadFile(type="PDF"){
    const selectedList=this.current.comics.chapters.filter(x=>x.id==this.current.comics.chapter.id)
    const page = this.config.mode==1?'double':'one';
    const isFirstPageCover = this.current.comics.isFirstPageCover;
    const pageOrder = this.current.comics.pageOrder;
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
      const req=await fetch(nodes[0].src);
      const blob= await req.blob();
      let name = `${this.current.comics.title}_${this.current.comics.chapter.title}_${this.current.comics.chapter.index}`;
      saveAs(blob,name);
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
        const list=(this.current.comics.chapters.find(x=>x.id==this.current.comics.chapter.id)).images
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
       const list=(this.current.comics.chapters.find(x=>x.id==this.current.comics.chapter.id)).images
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
        const list=(this.current.comics.chapters.find(x=>x.id==this.current.comics.chapter.id)).images
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
}
