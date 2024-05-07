// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
import { Subject } from 'rxjs';
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function;
  Search?: Function
}
interface Config {
  id: string,
  name?: string,
  menu?: Array<any>;
  is_locked?: boolean;
  is_download?: boolean;
  is_cache?: boolean;
}
interface Tab {
  url: string,
  host_names: Array<string>,
}
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class DbEventService {
  public Events: { [key: string]: Events } = {};
  public Configs: { [key: string]: Config } = {};

  public change() {
    return this.change$
  }
  change$ = new Subject();


  constructor(
    public http: HttpClient,
    public _http: MessageFetchService,
  ) {

    window._gh_register = this.register;


    // window._gh_register({
    //   id: "18comic",
    //   is_cache: true,
    //   is_download: true
    // }, {
    //   List: async (obj) => {
    //     let list = [];
    //     return list
    //   },
    //   Detail: async (id) => {
    //     const res = await window._gh_getHtml(`https://18comic.vip/album/468577`, {
    //       "headers": {
    //         "accept": "application/json, text/plain, */*",
    //         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    //         "content-type": "application/json;charset=UTF-8"
    //       },
    //       "body": null,
    //       "method": "GET"
    //     });
    //     const text = await res.text();
    //     var parser = new DOMParser();
    //     var doc = parser.parseFromString(text, 'text/html');
    //     let obj = {
    //       id: id,
    //       cover: "",
    //       title: "",
    //       author: "",
    //       href: `https://hanime1.me/comic/${id}`,
    //       author_href: "",
    //       intro: "",
    //       chapters: [

    //       ],
    //       chapter_id: id,
    //       styles: []
    //     }
    //     const utf8_to_b64 = (str) => {
    //       return window.btoa(encodeURIComponent(str));
    //     }
    //     obj.title = doc.querySelector("#wrapper > div.container > div:nth-child(4) > div > div.panel.panel-default.visible-lg.hidden-xs > div.panel-heading > div.pull-left > h1").textContent.trim()
    //     obj.cover = doc.querySelector("#album_photo_cover > div.thumb-overlay > a > div > img")
    //     const nodes = doc.querySelectorAll(".episode ul.btn-toolbar  > a")
    //     // const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
    //     // const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
    //     let styles = []

    //     // if (nodes1.length > nodes.length) {
    //     //   for (let index = 0; index < nodes1.length; index++) {
    //     //     obj.styles.push({ name: nodes1[index].textContent, href: nodes1[index].parentNode.href })
    //     //   }
    //     //   obj.author = [{name:nodes2[0].textContent,href:nodes2[0].parentNode.href}];
    //     // } else {
    //     //   for (let index = 0; index < nodes.length; index++) {
    //     //     obj.styles.push({ name: nodes[index].textContent, href: nodes1[index]?.parentNode?.href })
    //     //   }
    //     //   obj.author = [{name:nodes1[0].textContent,href:nodes1[0].parentNode.href}];
    //     // }
    //     for (let index = 0; index < nodes.length; index++) {
    //       obj.styles.push({ name: nodes[index].textContent, href: nodes[index].parentNode.href })
    //       obj.chapters.push({
    //         id: nodes[index].getAttribute("data-album"),
    //         title: nodes[index].textContent,
    //       })
    //     }

    //     return obj
    //   },
    //   Pages: async (id) => {
    //     const res = await window._gh_getHtml(`https://18comic.vip/photo/${id}`, {
    //       "headers": {
    //         "accept": "application/json, text/plain, */*",
    //         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    //         "content-type": "application/json;charset=UTF-8"
    //       },
    //       "body": null,
    //       "method": "GET"
    //     });
    //     const text = await res.text();
    //     var parser = new DOMParser();
    //     var doc = parser.parseFromString(text, 'text/html');

    //     let data = [];
    //     let nodes = doc.querySelectorAll(".comics-thumbnail-wrapper img")
    //     for (let index = 0; index < nodes.length; index++) {
    //       let _id = nodes[index].dataset.srcset.split("/").at(-2)
    //       let type = nodes[index].dataset.srcset.split("/").at(-1).split(".").at(-1)
    //       let obj = {
    //         id: "",
    //         src: "",
    //         width: 0,
    //         height: 0
    //       };
    //       const utf8_to_b64 = (str) => {
    //         return window.btoa(encodeURIComponent(str));
    //       }

    //       obj["id"] = `${id}_${index}`;
    //       obj["src"] = `https://i.nhentai.net/galleries/${_id}/${index + 1}.${type}`
    //       data.push(obj)
    //     }
    //     return data
    //   },
    //   Image: async (id) => {
    //     const getImageUrl = async (id) => {
    //       const res = await window._gh_fetch(id, {
    //         method: "GET",
    //         headers: {
    //           "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    //           "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    //           "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
    //         },
    //         mode: "cors"
    //       });
    //       const blob = await res.blob();
    //       return blob
    //     }
    //     const blob = await getImageUrl(id);
    //     return blob
    //   }
    // });
    window._gh_register({
      id: "baozimhw",
      is_cache: true,
      is_download: true
    }, {
      List: async (obj) => {
        let list = [];
        return list
      },
      Detail: async (id) => {

        const res = await window._gh_getHtml(`https://www.baozimhw.com/manhua/${id}.html`, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');
        let obj = {
          id: id,
          cover: "",
          title: "",
          author: "",
          href: `https://hanime1.me/comic/${id}`,
          author_href: "",
          intro: "",
          chapters: [

          ],
          chapter_id: id,
          styles: []
        }
        const utf8_to_b64 = (str) => {
          return window.btoa(encodeURIComponent(str));
        }
        obj.title = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > div.pt-novel > h1 > a").textContent.trim()
        obj.cover = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > img").src
        const nodes = doc.querySelectorAll("#chapterlist a")
        // const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
        // const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
        let styles = []

        // if (nodes1.length > nodes.length) {
        //   for (let index = 0; index < nodes1.length; index++) {
        //     obj.styles.push({ name: nodes1[index].textContent, href: nodes1[index].parentNode.href })
        //   }
        //   obj.author = [{name:nodes2[0].textContent,href:nodes2[0].parentNode.href}];
        // } else {
        //   for (let index = 0; index < nodes.length; index++) {
        //     obj.styles.push({ name: nodes[index].textContent, href: nodes1[index]?.parentNode?.href })
        //   }
        //   obj.author = [{name:nodes1[0].textContent,href:nodes1[0].parentNode.href}];
        // }
        for (let index = 0; index < nodes.length; index++) {
          obj.styles.push({ name: nodes[index].textContent, href: nodes[index].parentNode.href })
          obj.chapters.push({
            id: nodes[index].getAttribute("href").split("/").at(-1),
            title: nodes[index].textContent,
          })
        }

        return obj
      },
      Pages: async (id) => {
        const res = await window._gh_getHtml(`https://www.baozimhw.com/manhua/capter/${id}`, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');

        let data = [];
        let nodes = doc.querySelectorAll(".padding5 img")
        for (let index = 0; index < nodes.length; index++) {
          let obj = {
            id: "",
            src: "",
            width: 0,
            height: 0
          };

          obj["id"] = `123123${index}`;
          obj["src"] = `${nodes[index].src}`
          data.push(obj)
        }

        return data
      },
      Image: async (id) => {

        const getImageUrl = async (id) => {
          const res = await window._gh_fetch(id, {
            method: "GET",
            headers: {
              "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
            },
            mode: "cors"
          });
          const blob = await res.blob();
          return blob
        }
        const blob = await getImageUrl(id);
        return blob
      }
    });

  }

  register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      name: key,
      is_cache: false,
      is_download: false,
      ...config
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
console.log(this.Configs[key]);

    this.change$.next(config)
  }

}
