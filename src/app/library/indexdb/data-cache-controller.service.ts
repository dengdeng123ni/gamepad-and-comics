import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataCacheControllerService {

  constructor() { }


  // 缓存数据

  // id 为缓存的唯一标识  data 为缓存的数据
  set_cache_data(id: string, data: JSON | Blob | ArrayBuffer | string | number | boolean) {

  }

  get_cache_data(id: string) {

  }


  get_cache_date(id: string) {

  }

  del_cache_data(id: string) {

  }

  JSON_to_md5(JSON: JSON): string {
    return '';
  }
}
