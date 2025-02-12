import { Injectable } from '@angular/core';


import { ComicsItem, IndexdbControllerService } from 'src/app/library/public-api';
declare const window: any;
@Injectable({
  providedIn: 'root'
})

export class DataService {


  key = "_gh_list_data";

  is_init_free=false;

  list: Array<ComicsItem> = [];


  is_edit = false;
  is_locked = false;
  is_cache = false;
  is_local_record = false;
  is_download = false;

  is_loading_free = false;



  menu = [];
  menu_2=[];
  menu_2_obj:any={
    submenu:[]
  };

  qurye_page_type = "cached"

  query_option:any = {

  }
  default_query_option = {
    page_size:5,
    page_num:1
  }
  keyword = "";


  currend_read_comics_id='';

  // is_left_drawer_opened=false;

  left_drawer_mode: any = 'over';

  is_developer_mode=true;

  config={
    click_type:1,
  }

  constructor(public webDb: IndexdbControllerService,) {

  }

  async post() {
    return await this.webDb.update("data", {
      id: this.key,
      currend_read_comics_id:this.currend_read_comics_id
    })
  }

  async get() {
    const res: any = await this.webDb.getByKey("data", this.key)
    if (res) {
      if(!this.currend_read_comics_id)  this.currend_read_comics_id=res.currend_read_comics_id;
    }
  }

  async init() {

    await this.get();
  }
}

