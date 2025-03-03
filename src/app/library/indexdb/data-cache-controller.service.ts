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
  // 获取缓存数据
  get_cache_data(id: string) {

  }

  // 获取缓存时间
  get_cache_time(id: string) {

  }

  // 删除缓存数据
  del_cache_data(id: string) {

  }
  // json 转 md5
  JSON_to_md5(JSON: JSON): string {
    return '';
  }
}
