import { Injectable } from '@angular/core';
import { ComicsItem } from 'src/app/library/public-api';
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class DataService {

  is_init_free=false;

  list: Array<ComicsItem> = [];


  is_edit = false;
  is_locked = false;
  is_cache = false;
  is_local_record = false;
  is_download = false;

  is_loading_free = false;



  menu = [];

  qurye_page_type = "cached"

  query_option:any = {

  }
  default_query_option = {
    page_size:5,
    page_num:1
  }
  keyword = "";



  // is_left_drawer_opened=false;

  left_drawer_mode: any = 'over';
  constructor() {

  }
}
