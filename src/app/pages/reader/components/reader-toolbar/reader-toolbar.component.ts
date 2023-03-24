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
export class ReaderToolbarComponent{
  isfullscreen=false;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentReaderService,
    public config:ConfigReaderService,
    public download:DownloadService,
    public i18n:I18nService
  ) {

  }
  menuObj={
    list:[],
    type:"delete"
  }
  back(){
    window.history.back()
  }
  changeSpreadMatch(){
    this.current.switch$.next("");
  }
  change(e: any): void {
    if (e == this.current.comics.chapter.total) e--
    this.current.page$.next(e)
  }
  isFullChange(e) {
    this.isfullscreen=!this.isfullscreen;
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
  firstPageCoverChange(){
    this.config.mode1.isFirstPageCover=!this.config.mode1.isFirstPageCover;
    if(this.current.comics.chapter.index==0) {
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
    const images=(this.current.comics.chapters.find(x=>x.id==this.current.comics.chapter.id)).images;
    for (let i = 0; i < nodes.length; i++) {
      const node: any = nodes[i];
      const imageId=node.getAttribute('id')
      const index=images.findIndex(x=>x.id==imageId)
      this.menuObj.list.push({ name: index+1,id:imageId })
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
    this.menuObj.list=this.current.comics.chapters;
    setTimeout(() => this.menu.openMenu(), 0)
  }
  closeMenu() {
    if(this.menuObj.type=="list"){
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    }else if(this.menuObj.type=="delete"){
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_page")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    }

  }
  mouseoverDeleteMenu(id) {
    const node=document.getElementById(id);
    if(node) node.style.opacity = "0.7";
  }
  mouseoutDeleteMenu(id) {
    const node=document.getElementById(id);
    if(node) node.style.opacity = "1";
  }
  delete(imageId) {
    const id=this.current.comics.id
    const chapterId=this.current.comics.chapter.id;
    this.current.deletePage(id,chapterId,imageId);
  }
  onListMenuItemClick(id){
     this.current.chapterChange(id);
  }
  modeChange(){
   if(this.current.comics.mode!=4) this.current.mode$.next(this.current.comics.mode+1)
   else this.current.mode$.next(1)
  }
  insertPage(){
    const id=this.current.comics.id
    const chapterId=this.current.comics.chapter.id;
    const images=this.current.comics.chapters.find(x=>x.id==chapterId).images;
    const imagesId=images[this.current.comics.chapter.index].id;
    this.current.insertPage(id,chapterId,imagesId)
  }


}
