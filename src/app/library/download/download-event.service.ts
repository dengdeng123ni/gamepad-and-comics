import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js'
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class DownloadEventService {

  Paths = {};

  constructor() {
    window._gh_generate_file_path = this.generate_file_path;
    this.generate_file_path('可选项', (e) => {
      if (e.page_index !== undefined && e.chapter_id) {
        const is_offprint = e.comics.chapters.length == 1 ? true : false;
        if (is_offprint) {
          return `${e.comics.title}/${e.page_index + 1}.${e.blob.type.split("/").at(-1)}`
        } else {
          return `${e.comics.title}/${e.chapter_index + 1}_${e.page_index + 1}.${e.blob.type.split("/").at(-1)}`
        }
      } else if (e.chapter_id) {
        const is_offprint = e.comics.chapters.length == 1 ? true : false;
        if (is_offprint) {
          return `${e.comics.title}.${e.blob.type.split("/").at(-1)}`
        } else {
          const obj = e.comics.chapters[e.chapter_index]
          return `${e.comics.title}_${obj.title}.${e.blob.type.split("/").at(-1)}`
        }
      } else {
        return `${e.comics.title}.${e.blob.type.split("/").at(-1)}`
      }
    })
  }

  generate_file_path = (name, event) => {
    const id = CryptoJS.MD5(name).toString().toLowerCase();
    this.Paths[id] = {
      key: id,
      name: name,
      event: event
    };
  }



}
