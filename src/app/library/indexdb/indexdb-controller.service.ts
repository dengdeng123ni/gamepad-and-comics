import { Injectable } from '@angular/core';
import { Key, NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

type DataType =
  | "temporary_file"
  | "query_fixed"
  | "color_matrix"
  | "url_to_list"
  | "data"
  | "list"
  | "replies"
  | "temporary_details"
  | "temporary_pages"
  | "details"
  | "pages"
  | "novels_list"
  | "novels_details"
  | "novels_pages"
  | "read_novels"
  | "history"
  | "preload_comics"
  | "preload_pages"
  | "read_record"
  | "local_details"
  | "local_comics"
  | "local_chapters"
  | "local_pages"
  | "read_comics_chapter"
  | "read_comics"
  | "comics_config"
  | "last_read_comics"
  | "last_read_chapter_page"
  | "chapter_first_page_cover"
  | "image"
  | "script"
  | "data_v2"
  | "favorites_menu"
  | "favorites_comics"
  | "router";


@Injectable({
  providedIn: 'root'
})
export class IndexdbControllerService {

  constructor(private db: NgxIndexedDBService) {


    // window._gh_send_message
    // window._gh_receive_message\
    window._gh_web_db = {
      getAll: this.getAll,
      update: this.update,
      deleteByKey: this.deleteByKey,
      getByKey: this.getByKey
    }

  }

  public getAll = async (storeName: DataType) => {
    const res = await firstValueFrom(this.db.getAll(storeName))
    return res
  }
  public update = async (storeName: DataType, value: any) => {
    const res = await firstValueFrom(this.db.update(storeName, value))
    return res
  }
  public deleteByKey = async (storeName: DataType, key: Key) => {
    const res = await firstValueFrom(this.db.deleteByKey(storeName, key))
    return res
  }
  public getByKey = async (storeName: DataType, key: IDBValidKey) => {
    const res = await firstValueFrom(this.db.getByKey(storeName, key))
    return res
  }

  public getDbNames = async () => {

    return [
      "temporary_file",
      "query_fixed",
      "color_matrix",
      "url_to_list",
      "data",
      "list",
      "replies",
      "temporary_details",
      "temporary_pages",
      "details",
      "pages",
      "novels_list",
      "novels_details",
      "novels_pages",
      "read_novels",
      "history",
      "preload_comics",
      "preload_pages",
      "read_record",
      "local_details",
      "local_comics",
      "local_chapters",
      "local_pages",
      "read_comics_chapter",
      "read_comics",
      "comics_config",
      "last_read_comics",
      "last_read_chapter_page",
      "chapter_first_page_cover",
      "image",
      "script",
      "data_v2",
      "router"
    ]
  }

}
