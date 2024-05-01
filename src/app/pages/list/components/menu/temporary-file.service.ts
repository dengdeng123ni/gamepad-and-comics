import { Injectable } from '@angular/core';
import { DbEventService, MessageEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class TemporaryFileService {
  files: any = [];
  data: any = [];
  chapters: any = [];
  menu:any=[];
  constructor(public MessageEvent: MessageEventService,
    public DbEvent: DbEventService
  ) {
    // MessageEvent.service_worker_register('temporary_file', async event => {
    //   const id = parseInt(event.data.id);
    //   const obj = this.files.find(x => x.id == id);
    //   const blob = await obj.blob.getFile();
    //   return { id: event.data.id, type: "temporary_file", blob: blob }
    // })]
    DbEvent.register({
      id:"temporary_file",
      name: "temporary_file",
      is_download:true,
      is_cache: false
    }, {
      List: async (obj: any) => {
        let list = [];
        list = this.data.filter((x: { temporary_file_id: any; })=>obj.temporary_file_id==x.temporary_file_id).map((x: any) => {
          return { id: x.id, cover: x.chapters[0].pages[0].id.toString(), title: x.title, subTitle: `${x.chapters[0].title}` }
        }).slice((obj.page_num-1)*obj.page_size,obj.page_size);
        return list
      },
      Detail: async (id: string) => {
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
          chapter_id:obj.chapters[0].id
        }
      },
      Pages: async (id: string) => {
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
      Image: async (id: string) => {
        const obj = this.files.find((x: { id: string; }) => x.id == id);
        const blob = await obj.blob.getFile();
        return blob
      }
    });
  }
  init() {
  }

}
