import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DownloadService, I18nService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';

@Component({
  selector: 'app-reader-toolbar',
  templateUrl: './reader-toolbar.component.html',
  styleUrls: ['./reader-toolbar.component.scss']
})
export class ReaderToolbarComponent {
  isfullscreen = false;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentReaderService,
    public config: ConfigReaderService,
    public download: DownloadService,
    public i18n: I18nService
  ) {

  }
  menuObj = {
    list: [],
    type: "delete"
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
    node_reader_toolbar.style.opacity = 1;
    this.menuObj.list = [];
    const p = $event.target.getBoundingClientRect();
    let node = (document.getElementById(`reader_toolbar_menu`) as any);
    node.style.top = `${p.y}px`;
    node.style.left = `${p.x + p.width + 4}px`;
    const nodes = document.querySelectorAll(".swiper-slide-active img")
    const images = (this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id)).images;
    for (let i = 0; i < nodes.length; i++) {
      const node: any = nodes[i];
      const imageId = node.getAttribute('id')
      const index = images.findIndex(x => x.id == imageId)
      this.menuObj.list.push({ name: index + 1, id: imageId })
    }
    setTimeout(() => this.menu.openMenu(), 0)
  }
  openList = ($event) => {
    this.menuObj.type = "list"
    const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
    node_reader_toolbar.style.opacity = 1;
    this.menuObj.list = [];
    const p = $event.target.getBoundingClientRect();
    let node = (document.getElementById(`reader_toolbar_menu`) as any);
    node.style.top = `${p.bottom}px`;
    node.style.left = `${p.x + p.width + 4}px`;
    this.menuObj.list = this.current.comics.chapters;
    setTimeout(() => this.menu.openMenu(), 0)
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
  mouseoverDeleteMenu(id) {
    const node = document.getElementById(id);
    if (node) node.style.opacity = "0.7";
  }
  mouseoutDeleteMenu(id) {
    const node = document.getElementById(id);
    if (node) node.style.opacity = "1";
  }
  async delete(imageId) {
    const id = this.current.comics.id
    const chapterId = this.current.comics.chapter.id;
    await this.current.deletePage(id, chapterId, imageId);
    this.current.pageChange(this.current.comics.chapter.index)
  }
  onListMenuItemClick(id) {
    this.current.chapterChange(id);
  }
  modeChange() {
    if (this.current.comics.mode != 4) this.current.mode$.next(this.current.comics.mode + 1)
    else this.current.mode$.next(1)
  }
  async insertPage() {
    const id = this.current.comics.id
    const chapterId = this.current.comics.chapter.id;
    const images = this.current.comics.chapters.find(x => x.id == chapterId).images;
    const imagesId = images[this.current.comics.chapter.index].id;
    await this.current.insertPage(id, chapterId, imagesId)
    this.current.pageChange(this.current.comics.chapter.index)
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
