import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { PagesItem, ChaptersItem, ComicsInfo, AppDataService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  pages: Array<PagesItem> = [];
  chapters: Array<ChaptersItem> = [];

  details = {
    cover: '',
    title: '',
    author: '',
    styles: [],
    href:"",
    intro: ""
  };


  comics_id = "";
  chapter_id = "";
  page_index: number = 0;
  page_id: string = "";

  is_edit = false;
  is_locked = false;
  is_cache = true;
  is_local_record = true;
  is_offprint = false;

  comics_config = {
    reader_mode: "double_page_reader",
    is_page_order: false, // true 正常模式 false 日漫模式
    is_page_direction: true,
    is_double_page: true,
    background_color: "#303030",
    first_cover_background_color: "default",
    page_switching_effect: "平滑",
    page_height: 100,
    border_radius: 4,
  }

  nine_grid={
    1:"",
    2:"",
    3:"",
    4:"",
    5:"comics_toolbar",
    6:"",
    7:"",
    8:"",
    9:""
  }

  is_init_free = false;
  is_download = false;


  constructor(public AppData: AppDataService,public platform:Platform) {
     this.comics_config.is_double_page=!(window.innerWidth < 480 && (this.platform.ANDROID || this.platform.IOS))

    const igh=  localStorage.getItem("nine_grid");
    if(igh){
      this.nine_grid=JSON.parse(igh)
    }
  }

  init() {
    const obj = this.AppData.getOption();
    if(!obj) return

    this.is_locked = obj.is_locked;
    this.is_cache = obj.is_cache;
    this.is_download = obj.is_download;

  }





}
