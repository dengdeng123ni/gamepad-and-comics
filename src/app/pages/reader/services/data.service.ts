import { Injectable } from '@angular/core';
import { PagesItem, ChaptersItem, ComicsInfo, AppDataService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  pages: Array<PagesItem> = [];
  chapters: Array<ChaptersItem> = [];

  details={
    cover: '',
    title: '',
    author: '',
    styles: [],
    intro: ""
  };


  comics_id = "";
  chapter_id = "";
  page_index: number = 0;
  page_id: string = "";

  is_edit = false;
  is_locked = true;
  is_cache = false;
  is_local_record = true;
  is_offprint=false;

  comics_config = {
    reader_mode: "double_page_reader",
    is_page_order: false,
    is_page_direction: true,
    is_double_page: true,
  }

  is_init_free = false;


  constructor(public AppData:AppDataService) { }

  init() {
    const obj = this.AppData.getOption();
    this.is_locked = obj.is_locked;
    this.is_cache = obj.is_cache;
  }
}
