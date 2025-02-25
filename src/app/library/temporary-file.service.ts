import { Injectable } from '@angular/core';
import { DbComicsEventService, MessageEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class TemporaryFileService {
  files: any = [];
  data: any = [];
  chapters: any = [];
  menu: any = [];
  constructor(
    public MessageEvent: MessageEventService,
    public DbComicsEvent: DbComicsEventService
  ) {
    // MessageEvent.service_worker_register('temporary_file', async event => {
    //   const id = parseInt(event.data.id);
    //   const obj = this.files.find(x => x.id == id);
    //   const blob = await obj.blob.getFile();
    //   return { id: event.data.id, type: "temporary_file", blob: blob }
    // })]




    DbComicsEvent.comics_register({
      id: "temporary_file",
      name: "本地文件",
      is_visible: false,
      is_download: true,
      is_cache: false
    }, {
      getList: async (obj: any) => {
        let list = [];
        list = this.data.filter((x: { temporary_file_id: any; }) => obj.temporary_file_id == x.temporary_file_id).map((x: any) => {
          return { id: x.id, cover: x.chapters[0].pages[0].id.toString(), title: x.title, subTitle: `${x.chapters[0].title}` }
        }).slice((obj.page_num - 1) * obj.page_size, obj.page_size * obj.page_num);
        return list
      },
      getDetail: async (id: string) => {
        const obj = this.data.find((x: { id: string; }) => x.id == id)
        return {
          id: obj.id,
          cover: obj.chapters[0].pages[0].id.toString(),
          title: obj.title,
          author: "",
          intro: "",
          chapters: obj.chapters.map((x: {
            title: any;
            id: any; pages: {
              id: any; name: any;
            }[];
          }) => ({
            id: x.id,
            cover: x.pages[0].id.toString(),
            title: x.title,
            read: 0,
            selected: false,
            is_locked: false

          })),
          chapter_id: obj.chapters[0].id
        }
      },
      getPages: async (id: string) => {
        const obj1: any = this.chapters.find((x: { id: string; }) => x.id == id);
        let data = [];
        for (let index = 0; index < obj1.pages.length; index++) {
          const x = obj1.pages[index];
          let obj = {
            id: "",
            src: "",
            width: 0,
            height: 0
          };
          obj["id"] = `${id}_${index}`;
          obj["src"] = x.id.toString();
          obj["width"] = 0;
          obj["height"] = 0;
          data.push(obj)
        }
        return data
      },
      getImage: async (id: string) => {
        const obj = this.files.find((x: { id: string; }) => x.id == id);
        if (obj.blob instanceof File) {
          return obj.blob
        } else {
          const blob = await obj.blob.getFile();
          return blob
        }
      }
    });
  }
  init() {
  }

}
