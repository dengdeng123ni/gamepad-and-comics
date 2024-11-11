// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
import { Subject, firstValueFrom } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
interface Events {
  Unlock?: Function;
  getList: Function;
  getDetail: Function;
  getPages: Function;
  getImage: Function;
  Search?: Function
}
interface Config {
  id: string,
  type?: string,
  name?: string,
  menu?: Array<any>;
  href?: string,
  is_locked?: boolean;
  is_download?: boolean;
  is_cache?: boolean;
  is_preloading?: boolean;
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
    private webDb: NgxIndexedDBService,
    public _http: MessageFetchService,
  ) {





    window._gh_comics_register = this.comics_register;
    window._gh_novels_register = this.novels_register;
    if (location.hostname == "localhost") {

      // window._gh_comics_register({
      //   id: "ehentai",
      //   tab: {
      //     url: "https://hanime1.me/comic/",
      //     host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
      //   },
      //   is_cache: true,
      //   is_download: true,
      //   is_preloading: true
      // }, {
      //   getList: async (obj) => {
      //     let list = [];
      //     return list
      //   },
      //   getDetail: async (id) => {
      //     const b64_to_utf8 = (str) => {
      //       return decodeURIComponent(window.atob(str));
      //     }
      //     const res = await window._gh_getHtml(b64_to_utf8(id), {
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
      //       intro: "",
      //       chapters: [

      //       ],
      //       chapter_id: id
      //     }
      //     const utf8_to_b64 = (str) => {
      //       return window.btoa(encodeURIComponent(str));
      //     }
      //     obj.title = doc.querySelector("#gn").textContent.trim()
      //     obj.cover = doc.querySelector("#gd1 > div").style.background.split('"')[1];
      //     obj.chapters.push({
      //       id: obj.id,
      //       title: obj.title,
      //       cover: obj.cover,
      //     })

      //     return obj
      //   },
      //   getPages: async (id) => {
      //     const b64_to_utf8 = (str) => {
      //       return decodeURIComponent(window.atob(str));
      //     }
      //     const res = await window._gh_getHtml(b64_to_utf8(id), {
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
      //     const nodes = doc.querySelectorAll(".ptt a");


      //     let arr = []
      //     for (let index = 0; index < nodes.length; index++) {
      //       const element = nodes[index];
      //       arr.push(element.href)
      //     }

      //     if (arr.length > 1) arr.pop()

      //     let arr2 = [];
      //     for (let index = 0; index < arr.length; index++) {
      //       const res = await window._gh_getHtml(arr[index], {
      //         "headers": {
      //           "accept": "application/json, text/plain, */*",
      //           "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      //           "content-type": "application/json;charset=UTF-8"
      //         },
      //         "body": null,
      //         "method": "GET"
      //       });
      //       const text = await res.text();
      //       var parser = new DOMParser();
      //       var doc = parser.parseFromString(text, 'text/html');
      //       const nodes = doc.querySelectorAll("#gdt a")

      //       for (let index = 0; index < nodes.length; index++) {
      //         const element = nodes[index];
      //         arr2.push(element.href)
      //       }

      //     }

      //     let data = [];
      //     for (let index = 0; index < arr2.length; index++) {
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
      //       obj["src"] = `${utf8_to_b64(arr2[index])}`
      //       data.push(obj)
      //     }

      //     return data
      //   },
      //   getImage: async (id) => {

      //     if (id.substring(0, 4) == "http") {
      //       const res = await window._gh_fetch(id, {
      //         method: "GET",
      //         headers: {
      //           "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      //           "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      //           "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
      //         },
      //         mode: "cors"
      //       })
      //       const blob = await res.blob();
      //       return blob
      //     } else {
      //       const b64_to_utf8 = (str) => {
      //         return decodeURIComponent(window.atob(str));
      //       }
      //       const _id = b64_to_utf8(id);
      //       const getHtmlUrl = async (url) => {
      //         const res = await window._gh_getHtml(url, {
      //           "headers": {
      //             "accept": "application/json, text/plain, */*",
      //             "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      //             "content-type": "application/json;charset=UTF-8"
      //           },
      //           "body": null,
      //           "method": "GET"
      //         });
      //         const text = await res.text();
      //         var parser = new DOMParser();
      //         var doc = parser.parseFromString(text, 'text/html');
      //         return doc.querySelector("#img").src
      //       }
      //       const getImageUrl = async (id) => {
      //         const res = await window._gh_fetch(id, {
      //           method: "GET",
      //           headers: {
      //             "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      //             "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      //             "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
      //           },
      //           mode: "cors"
      //         });
      //         const blob = await res.blob();
      //         return blob
      //       }
      //       const url = await getHtmlUrl(_id)

      //       const blob = await getImageUrl(url);
      //       return blob
      //     }

      //   },
      //   UrlToDetailId: async (id) => {
      //     const obj = new URL(id);
      //     if (obj.host == "e-hentai.org") {
      //       return window.btoa(encodeURIComponent(id))
      //     } else {
      //       return null
      //     }
      //   }
      // });
      // window._gh_comics_register({
      //   id: "baozimhw",
      //   is_cache: true,
      //   is_download: true
      // }, {
      //   getList: async (obj) => {
      //     let list = [];
      //     return list
      //   },
      //   getDetail: async (id) => {

      //     const res = await window._gh_getHtml(`https://www.baozimhw.com/manhua/${id}.html`, {
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
      //     obj.title = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > div.pt-novel > h1 > a").textContent.trim()
      //     obj.cover = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > img").src
      //     const nodes = doc.querySelectorAll("#chapterlist a")
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
      //         id: nodes[index].getAttribute("href").split("/").at(-1),
      //         title: nodes[index].textContent,
      //       })
      //     }

      //     return obj
      //   },
      //   getPages: async (id) => {
      //     const res = await window._gh_getHtml(`https://www.baozimhw.com/manhua/capter/${id}`, {
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
      //     let nodes = doc.querySelectorAll(".padding5 img")
      //     for (let index = 0; index < nodes.length; index++) {
      //       let obj = {
      //         id: "",
      //         src: "",
      //         width: 0,
      //         height: 0
      //       };

      //       obj["id"] = `123123${index}`;
      //       obj["src"] = `${nodes[index].src}`
      //       data.push(obj)
      //     }

      //     return data
      //   },
      //   getImage: async (id) => {

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
      //   },
      //   UrlToDetailId: async (id) => {
      //     const obj = new URL(id);

      //     if (obj.host == "www.baozimhw.com") {

      //       return obj.pathname.split("/").at(-1).split(".")[0]
      //     } else {
      //       return null
      //     }
      //   }
      // });
      window._gh_comics_register({
        id: "bilibili",
        name: "哔哩哔哩漫画",
        href: "https://manga.bilibili.com/",
        menu: [
          {
            id: 'search',
            icon: 'search',
            name: '搜索',
            query: {
              type: 'search',
              page_size: 5
            }
          },
          {
            id: 'type',
            icon: 'class',
            name: '分类',
            query: {
              type: 'multipy',
              page_size: 20,
              list: [
                {
                  "key": "styles",
                  "name": "题材",
                  "index": 0,
                  "tag": [
                    {
                      "id": -1,
                      "name": "全部",
                      "index": 0
                    },
                    {
                      "id": 999,
                      "name": "热血",
                      "index": 1
                    },
                    {
                      "id": 997,
                      "name": "古风",
                      "index": 2
                    },
                    {
                      "id": 1016,
                      "name": "玄幻",
                      "index": 3
                    },
                    {
                      "id": 998,
                      "name": "奇幻",
                      "index": 4
                    },
                    {
                      "id": 1023,
                      "name": "悬疑",
                      "index": 5
                    },
                    {
                      "id": 1002,
                      "name": "都市",
                      "index": 6
                    },
                    {
                      "id": 1096,
                      "name": "历史",
                      "index": 7
                    },
                    {
                      "id": 1092,
                      "name": "武侠仙侠",
                      "index": 8
                    },
                    {
                      "id": 1088,
                      "name": "游戏竞技",
                      "index": 9
                    },
                    {
                      "id": 1081,
                      "name": "悬疑灵异",
                      "index": 10
                    },
                    {
                      "id": 1063,
                      "name": "架空",
                      "index": 11
                    },
                    {
                      "id": 1060,
                      "name": "青春",
                      "index": 12
                    },
                    {
                      "id": 1054,
                      "name": "西幻",
                      "index": 13
                    },
                    {
                      "id": 1048,
                      "name": "现代",
                      "index": 14
                    },
                    {
                      "id": 1028,
                      "name": "正能量",
                      "index": 15
                    },
                    {
                      "id": 1015,
                      "name": "科幻",
                      "index": 16
                    }
                  ]
                },
                {
                  "key": "areas",
                  "name": "区域",
                  "index": 0,
                  "tag": [
                    {
                      "id": -1,
                      "name": "全部",
                      "index": 0
                    },
                    {
                      "id": 1,
                      "name": "大陆",
                      "index": 1
                    },
                    {
                      "id": 2,
                      "name": "日本",
                      "index": 2
                    },
                    {
                      "id": 6,
                      "name": "韩国",
                      "index": 3
                    },
                    {
                      "id": 5,
                      "name": "其他",
                      "index": 4
                    }
                  ]
                },
                {
                  "key": "status",
                  "name": "进度",
                  "index": 0,
                  "tag": [
                    {
                      "id": -1,
                      "name": "全部",
                      "index": 0
                    },
                    {
                      "id": 0,
                      "name": "连载",
                      "index": 1
                    },
                    {
                      "id": 1,
                      "name": "完结",
                      "index": 2
                    }
                  ]
                },
                {
                  "key": "prices",
                  "name": "收费",
                  "index": 0,
                  "tag": [
                    {
                      "id": -1,
                      "name": "全部",
                      "index": 0
                    },
                    {
                      "id": 1,
                      "name": "免费",
                      "index": 1
                    },
                    {
                      "id": 2,
                      "name": "付费",
                      "index": 2
                    },
                    {
                      "id": 3,
                      "name": "等就免费",
                      "index": 3
                    }
                  ]
                },
                {
                  "key": "orders",
                  "name": "排序",
                  "index": 0,
                  "tag": [
                    {
                      "id": 0,
                      "name": "人气推荐",
                      "index": 0
                    },
                    {
                      "id": 1,
                      "name": "更新时间",
                      "index": 1
                    },
                    {
                      "id": 3,
                      "name": "上架时间",
                      "index": 2
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'ranking',
            icon: 'sort',
            name: '排行榜',
            page_size: 20,
            query: {
              type: 'choice',
              list: [
                {
                  id: 7,
                  type: 0,
                  description: '前7日综合指标最高的三个月内上线漫画作品排行',
                  name: '新作榜',
                },
                {
                  id: 11,
                  type: 0,
                  description: '前7日综合指标最高的男性向漫画作品排行',
                  name: '男生榜',
                },
                {
                  id: 12,
                  type: 0,
                  description: '前7日综合指标最高的女性向漫画作品排行',
                  name: '女生榜',
                },
                {
                  id: 1,
                  type: 0,
                  description: '前7日人气最高的国漫作品排行，每日更新',
                  name: '国漫榜',
                },
                {
                  id: 0,
                  type: 0,
                  description: '前7日人气最高的日漫作品排行，每日更新',
                  name: '日漫榜',
                },
                {
                  id: 2,
                  type: 0,
                  description: '前7日人气最高的韩漫作品排行，每日更新',
                  name: '韩漫榜',
                },
                {
                  id: 5,
                  type: 0,
                  description: '前7日人气最高的官方精选漫画作品排行，每日更新',
                  name: '宝藏榜',
                },
                {
                  id: 13,
                  type: 2,
                  description: '前365日综合指标最高的完结漫画作品排行',
                  name: '完结榜',
                },
              ]
            }
          },
          {
            id: 'favorites',
            icon: 'favorite',
            name: '我的追漫',
            page_size: 20,
            query: {
              type: 'choice',
              name: '我的追漫',
              list: [
                {
                  order: 1,
                  name: "追漫顺序",
                  wait_free: 0
                },
                {
                  order: 2,
                  name: "更新时间",
                  wait_free: 0
                },
                {
                  order: 3,
                  name: "最近阅读",
                  wait_free: 0
                },
                {
                  order: 4,
                  name: "完成等免",
                  wait_free: 1
                }
              ]
            }
          }
        ],
        is_cache: true,
        is_download: false,
        is_locked: true,
        is_preloading: true
      }, {
        getList: async (obj) => {
          let list = [];
          if (obj.menu_id == "type") {
            let data = {};
            obj.list.forEach(x => {
              if (x.key == "orders") data.order = x.tag.id;
              if (x.key == "prices") data.is_free = x.tag.id;
              if (x.key == "status") data.is_finish = x.tag.id;
              if (x.key == "areas") data.area_id = x.tag.id;
              if (x.key == "styles") data.style_id = x.tag.id;
            })
            obj.list = undefined;
            data = { ...obj, ...data }

            const res = await
              window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ClassPage?device=pc&platform=web", {
                "headers": {
                  "accept": "application/json, text/plain, */*",
                  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                  "content-type": "application/json;charset=UTF-8"
                },
                "body": JSON.stringify(data),
                "method": "POST"
              }, {
                proxy: "https://manga.bilibili.com/"
              });
            const json = await res.json();
            list = json.data.map((x) => {
              const httpUrlToHttps = (str) => {
                const url = new URL(str);
                if (url.protocol == "http:") {
                  return `https://${url.host}${url.pathname}`
                } else {
                  return str
                }
              }
              return { id: x.season_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: x.bottom_info }
            });
          } else if (obj.menu_id == "favorites") {
            const res = await
              window._gh_fetch("https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite?device=pc&platform=web", {
                "headers": {
                  "accept": "application/json, text/plain, */*",
                  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                  "content-type": "application/json;charset=UTF-8"
                },
                "body": `{\"page_num\":${obj.page_num},\"page_size\":${obj.page_size},\"order\":${obj.order},\"wait_free\":${obj.wait_free}}`,
                "method": "POST"
              }, {
                proxy: "https://manga.bilibili.com/"
              });
            const json = await res.json();
            const httpUrlToHttps = (str) => {
              const url = new URL(str);
              if (url.protocol == "http:") {
                return `https://${url.host}${url.pathname}`
              } else {
                return str
              }
            }
            list = json.data.map((x) => {
              return { id: x.comic_id, cover: httpUrlToHttps(x.vcover), title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` }
            });
          } else if (obj.query_type == "update") {
            const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetDailyPush?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"date\":\"${obj.date}\",\"page_num\":1,\"page_size\":50}`,
              "method": "POST"
            }, {
              proxy: "https://manga.bilibili.com/"
            });
            const json = await res.json();
            const httpUrlToHttps = (str) => {
              const url = new URL(str);
              if (url.protocol == "http:") {
                return `https://${url.host}${url.pathname}`
              } else {
                return str
              }
            }
            list = json.data.list.map((x) => {
              return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.short_title} 话` }
            });

          } else if (obj.menu_id == "ranking") {
            const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetRankInfo?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"id\":${obj.id}}`,
              "method": "POST"
            }, {
              proxy: "https://manga.bilibili.com/"
            });
            const json = await res.json();
            const httpUrlToHttps = (str) => {
              const url = new URL(str);
              if (url.protocol == "http:") {
                return `https://${url.host}${url.pathname}`
              } else {
                return str
              }
            }
            list = json.data.list.map((x) => {
              return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.total} 话` }
            });
          } else if (obj.query_type == "home") {
            const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetClassPageSixComics?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"id\":${obj.id},\"isAll\":0,\"page_num\":${obj.page_num},\"page_size\":${obj.page_size}}`,
              "method": "POST"
            }, {
              proxy: "https://manga.bilibili.com/"
            });
            const json = await res.json();
            const httpUrlToHttps = (str) => {
              const url = new URL(str);
              if (url.protocol == "http:") {
                return `https://${url.host}${url.pathname}`
              } else {
                return str
              }
            }
            list = json.data.roll_six_comics.map((x) => {
              return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `${x.recommendation}` }
            });
          }
          return list
        },
        getDetail: async (id) => {
          const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": `{\"comic_id\":${id}}`,
            "method": "POST"
          }, {
            proxy: "https://manga.bilibili.com/"
          });
          const json = await res.json();
          const x = json.data;

          const httpUrlToHttps = (str) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          return {
            id: x.id,
            href: `https://manga.bilibili.com/detail/mc${x.id}`,
            cover: httpUrlToHttps(x.vertical_cover),
            title: x.title,
            author: x.author_name.toString(),
            intro: x.classic_lines,
            styles: x.styles2.map(x => (
              {
                ...x,
                href: `https://manga.bilibili.com/classify?from=manga_detail&styles=${x.id}&areas=-1&status=-1&prices=-1&orders=0`
              }
            )),
            chapters: x.ep_list.map((c) => (
              {
                ...c,
                cover: httpUrlToHttps(c.cover),
                title: `${c.short_title} ${c.title}`
              }
            )).reverse(),
            chapter_id: x.read_epid
          }
        },
        getPages: async (id) => {
          const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": `{\"ep_id\":${id}}`,
            "method": "POST"
          }, {
            proxy: "https://manga.bilibili.com/"
          });


          const json = await res.json();
          let data = [];
          for (let index = 0; index < json.data.images.length; index++) {
            let x = json.data.images[index];
            let obj = {
              id: "",
              src: "",
              width: 0,
              height: 0
            };
            const utf8_to_b64 = (str) => {
              return window.btoa(encodeURIComponent(str));
            }
            obj["id"] = `${id}_${index}`;
            obj["src"] = x.path;
            obj["width"] = x.x;
            obj["height"] = x.y;
            data.push(obj)
          }
          return data
        },
        getImage: async (id) => {
          if (id.substring(0, 4) == "http") {
            const res = await window._gh_fetch(id, {
              method: "GET",
              headers: {
                "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
              },
              mode: "cors"
            })
            const blob = await res.blob();
            return blob
          } else {
            const getImageUrl = async (id) => {
              try {
                const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web", {
                  "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/json;charset=UTF-8"
                  },
                  "body": `{\"urls\":\"[\\\"${id}\\\"]\"}`,
                  "method": "POST",
                }, {
                  proxy: "https://manga.bilibili.com/"
                });
                const json = await res.json();

                return `${json.data[0].complete_url}`
              } catch (error) {
                return await getImageUrl(id)
              }
            }
            const url = await getImageUrl(id);
            // console.log(id,url);

            const res = await window._gh_fetch(url, {
              method: "GET",
              headers: {
                "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
              },
              mode: "cors"
            }, {
              proxy: "https://manga.bilibili.com/"
            });
            const blob = await res.blob();
            return blob
          }
        },
        getTagList: async (id) => {

        },
        getAuthorList: async (id) => {

        },
        Search: async (obj) => {
          const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/Search?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": JSON.stringify({ key_word: obj.keyword, page_num: obj.page_num, page_size: obj.page_size }),
            "method": "POST"
          }, {
            proxy: "https://manga.bilibili.com/"
          });
          const httpUrlToHttps = (str) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          const json = await res.json();
          const list = json.data.list.map(x => ({ id: x.id, title: x.real_title, cover: httpUrlToHttps(x.vertical_cover), subTitle: x.is_finish ? "已完结" : "连载中" }))
          return list
        },
        Unlock: async () => {

          return false
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "manga.bilibili.com") {

            return obj.pathname.split("/").at(-1).replace("mc", "");
          } else {
            return null
          }
        }
      });
      window._gh_comics_register({
        id: "hanime1",
        is_cache: true,
        is_download: true,
        is_preloading: true,
        menu: [
          {
            id: 'search',
            icon: 'search',
            name: '搜索',
            query: {
              type: 'search',
              page_size: 30
            }
          },
          {
            id: 'latestUpload',
            icon: 'fiber_new',
            name: '最新上傳',
            page_size: 30,
            query: {
              type: 'single',
              name: '最新上傳'
            }
          }
        ],
      }, {
        getList: async (obj) => {
          const res = await window._gh_getHtml(`https://hanime1.me/comics?page=${obj.page_num}`, {
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
          let nodes = doc.querySelectorAll("body .comic-rows-videos-div")
          for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            const id = node.querySelector("a").href.split("/").at(-1)
            const cover = node.querySelector("img").getAttribute("data-srcset");
            const title = node.textContent;
            data.push({ id, cover, title })
          }
          return data
        },
        getDetail: async (id) => {
          const res = await window._gh_getHtml(`https://hanime1.me/comic/${id}`, {
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
          obj.title = doc.querySelector("body > div > div:nth-child(4) > div:nth-child(2) > div > div.col-md-8 > h3").textContent.trim()
          obj.cover = doc.querySelector("body > div > div:nth-child(4) > div:nth-child(2) > div > div.col-md-4 > a > img").src;
          const nodes = doc.querySelectorAll("h5:nth-child(1) .hover-lighter .no-select");
          const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
          const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
          let styles = []

          if (nodes1.length > nodes.length) {
            for (let index = 0; index < nodes1.length; index++) {
              obj.styles.push({ name: nodes1[index].textContent, href: nodes1[index].parentNode.href })
            }
            obj.author = [{ name: nodes2[0].textContent, href: nodes2[0].parentNode.href }];
          } else {
            for (let index = 0; index < nodes.length; index++) {
              obj.styles.push({ name: nodes[index].textContent, href: nodes[index]?.parentNode?.href })
            }
            obj.author = [{ name: nodes1[0].textContent, href: nodes1[0].parentNode.href }];
          }

          obj.chapters.push({
            id: obj.id,
            title: obj.title,
            cover: obj.cover,
          })
          return obj
        },
        getPages: async (id) => {
          const res = await window._gh_getHtml(`https://hanime1.me/comic/${id}`, {
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
          let nodes = doc.querySelectorAll(".comics-thumbnail-wrapper a")
          for (let index = 0; index < nodes.length; index++) {
            let obj = {
              id: "",
              src: "",
              width: 0,
              height: 0
            };
            const utf8_to_b64 = (str) => {
              return window.btoa(encodeURIComponent(str));
            }

            obj["id"] = `${id}_${index}`;
            // obj["src"] = `https://i.nhentai.net/galleries/${_id}/${index + 1}.${type}`
            obj["src"] = window.btoa(encodeURIComponent(nodes[index].getAttribute("href")))
            // window.btoa(encodeURIComponent(nodes[index].href.replace("http://localhost:4200","https://nhentai.net")))
            data.push(obj)
          }
          return data
        },
        getImage: async (id) => {

          if (id.substring(0, 4) == "http") {
            const res = await window._gh_fetch(id, {
              method: "GET",
              headers: {
                "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
              },
              mode: "cors"
            })
            const blob = await res.blob();
            return blob
          } else {

            const getHtmlUrl = async (url) => {
              const res = await window._gh_getHtml(url, {
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
              return doc.querySelector("#current-page-image").src
            }
            const src = await getHtmlUrl(decodeURIComponent(window.atob(id)));

            const res = await window._gh_fetch(src, {
              method: "GET",
              headers: {
                "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
              },
              mode: "cors"
            })
            const blob = await res.blob();
            return blob
          }
        },
        Search: async (obj) => {
          const res = await window._gh_getHtml(`https://hanime1.me/comics/search?query=${obj.keyword}&page=${obj.page_num}`, {
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
          let nodes = doc.querySelectorAll("body .comic-rows-videos-div")

          for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            const id = node.querySelector("a").href.split("/").at(-1)
            const cover = node.querySelector("img").getAttribute("data-srcset");
            const title = node.textContent;
            data.push({ id, cover, title })
          }

          return data
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "hanime1.me") {
            return obj.pathname.split("/").at(-1)
          } else {
            return null
          }
        }
      });
      window._gh_comics_register({
        id: "nhentai",
        is_cache: true,
        is_download: true,
        is_preloading: true,
        menu: [
          {
            id: 'search',
            icon: 'search',
            name: '搜索',
            query: {
              type: 'search',
              page_size: 30
            }
          },
          {
            id: 'latestUpload',
            icon: 'fiber_new',
            name: '最新上傳',
            page_size: 30,
            query: {
              type: 'single',
              name: '最新上傳'
            }
          }
        ],
      }, {
        getList: async (obj) => {
          const res = await window._gh_getHtml(`https://hanime1.me/comics?page=${obj.page_num}`, {
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
          let nodes = doc.querySelectorAll("body .comic-rows-videos-div")
          for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            const id = node.querySelector("a").href.split("/").at(-1)
            const cover = node.querySelector("img").getAttribute("data-srcset");
            const title = node.textContent;
            data.push({ id, cover, title })
          }
          return data
        },
        getDetail: async (id) => {
          const b64_to_utf8 = (str) => {
            return decodeURIComponent(window.atob(str));
          }
          const res = await window._gh_getHtml(b64_to_utf8(id), {
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
            href: b64_to_utf8(id),
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
          obj.title = doc.querySelector("#info > h1").textContent.trim()
          obj.cover = doc.querySelector("#cover > a > img").src;


          obj.chapters.push({
            id: obj.id,
            title: obj.title,
            cover: obj.cover,
          })

          return obj
        },
        getPages: async (id) => {
          const b64_to_utf8 = (str) => {
            return decodeURIComponent(window.atob(str));
          }
          const res = await window._gh_getHtml(b64_to_utf8(id), {
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
          let nodes = doc.querySelectorAll(".thumbs a")

          for (let index = 0; index < nodes.length; index++) {

            let obj = {
              id: "",
              src: "",
              width: 0,
              height: 0
            };
            const utf8_to_b64 = (str) => {
              return window.btoa(encodeURIComponent(str));
            }

            obj["id"] = `${index}`;
            obj["src"] = window.btoa(encodeURIComponent(nodes[index].href.replace("http://localhost:4200", "https://nhentai.net")))
            data.push(obj)
          }

          return data
        },
        getImage: async (id) => {
          if (id.substring(0, 4) == "http") {
            const res = await window._gh_fetch(id, {
              method: "GET",
              headers: {
                "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
              },
              mode: "cors"
            })
            const blob = await res.blob();
            return blob
          } else {
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
            const getHtmlUrl = async (url) => {

              const res = await window._gh_getHtml(url, {
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

              return doc.querySelector("#image-container > a > img").src
            }


            const src = await getHtmlUrl(decodeURIComponent(window.atob(id)));

            const blob = await getImageUrl(src);
            return blob
          }

        },
        Search: async (obj) => {
          const res = await window._gh_getHtml(`https://hanime1.me/comics/search?query=${obj.keyword}&page=${obj.page_num}`, {
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
          let nodes = doc.querySelectorAll("body .comic-rows-videos-div")
          for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            const id = node.querySelector("a").href.split("/").at(-1)
            const cover = node.querySelector("img").getAttribute("data-srcset");
            const title = node.textContent;
            data.push({ id, cover, title })
          }
          return data
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "nhentai.net") {
            return window.btoa(encodeURIComponent(id))
          } else {
            return null
          }
        }
      });
      window._gh_comics_register({
        id: "kaobei",
        name: "拷贝漫画",
        href: "https://www.mangacopy.com/",
        is_cache: true,
        is_download: true,
        menu: [
          {
            id: 'search',
            icon: 'search',
            name: '搜索',
            query: {
              type: 'search',
              page_size: 30
            }
          }
        ],
      }, {
        getDetail: async (novel_id) => {

          const res = await window._gh_getHtml(decodeURIComponent(window.atob(novel_id)), {
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
            id: novel_id,
            cover: "",
            title: "",
            author: "",
            intro: "",
            category: "",
            chapters: [

            ],
          }

          obj.cover = doc.querySelector(".content-box img").src;
          obj.title = doc.querySelector(".content-box h6").textContent.trim();
          obj.intro = doc.querySelector(".comicParticulars-synopsis p").textContent.trim();
          obj.author = doc.querySelector(".comicParticulars-title-right > ul > li:nth-child(3) > span:nth-child(1)").textContent.trim();
          const nodes = doc.querySelectorAll("#default全部 > ul:nth-child(1) a");

          for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            const id = window.btoa(encodeURIComponent(`https://www.mangacopy.com${node.getAttribute("href")}`))
            const title = node.getAttribute("title")
            obj.chapters.push({ id, title })
          }
          console.log(obj);

          return obj
        },
        getPages: async (id) => {
          window.open(decodeURIComponent(window.atob(id)))
          const sleep = (duration) => {
            return new Promise(resolve => {
              setTimeout(resolve, duration);
            })
          }
          await sleep(2000)
          const res = await window._gh_getHtml(decodeURIComponent(window.atob(id)), {
            javascript:`
         for (let index = 0; index < 100; index++) {
  setTimeout(()=>{
    document.querySelector("html").scrollTop= document.querySelector("html").scrollTop+30;
  },40*index)
}
          `, sleep:5000
          });
          const text = await res.text();
          var parser = new DOMParser();
          var doc = parser.parseFromString(text, 'text/html');
          const nodes = doc.querySelectorAll(".comicContent-list li img");
          let data=[];
          for (let index = 0; index < nodes.length; index++) {
            let obj = {
              id: "",
              src: "",
              width: 0,
              height: 0
            };
            const utf8_to_b64 = (str) => {
              return window.btoa(encodeURIComponent(str));
            }

            obj["id"] = `${id}_${index}`;
            // obj["src"] = `https://i.nhentai.net/galleries/${_id}/${index + 1}.${type}`
            obj["src"] =  `${nodes[index].getAttribute('data-src')}`
            // window.btoa(encodeURIComponent(nodes[index].href.replace("http://localhost:4200","https://nhentai.net")))
            data.push(obj)
          }
          console.log(data);

          return data
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "www.mangacopy.com") {
            return window.btoa(encodeURIComponent(id))
          } else {
            return null
          }
        },
        Search: async (obj) => {
          const res = await window._gh_fetch(`https://www.biqgg.cc/user/search.html?q=${obj.keyword}`, {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": null,
            "method": "GET"
          });
          const json = await res.json();
          let data = [];
          for (let index = 0; index < json.length; index++) {
            const x = json[index];
            data.push({
              id: window.btoa(encodeURIComponent(`https://www.biqgg.cc` + x.url_list)),
              title: x.articlename,
              cover: x.url_img
            })
          }
          return data
        },
      });
      window._gh_novels_register({
        id: "biquge",
        name: "笔趣阁[小说]",
        href: "https://www.biqgg.cc",
        is_cache: true,
        is_download: true,
        menu: [
          {
            id: 'search',
            icon: 'search',
            name: '搜索',
            query: {
              type: 'search',
              page_size: 30
            }
          }
        ],
      }, {
        getList: async (obj) => {
          let list = [];
          return [
          ]
        },
        getDetail: async (novel_id) => {

          const res = await window._gh_getHtml(decodeURIComponent(window.atob(novel_id)), {
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
            id: novel_id,
            cover: "",
            title: "",
            author: "",
            intro: "",
            category: "",
            chapters: [

            ],
          }

          obj.cover = doc.querySelector("body .cover img").src;
          obj.title = doc.querySelector(".info h1").textContent.trim();
          obj.intro = doc.querySelector(".info dd").textContent.trim();
          obj.author = doc.querySelector(".info > div.small > span:nth-child(1)").textContent.trim();
          const nodes = doc.querySelectorAll(".listmain dd");
          for (let index = 0; index < nodes.length; index++) {
            const x = nodes[index];
            if (!x.className) {
              obj.chapters.push(
                {
                  id: window.btoa(encodeURIComponent(`https://www.biqgg.cc` + x.children[0].getAttribute("href"))),
                  title: x.children[0].textContent.trim()
                }
              )
            }

          }

          return obj
        },
        getPages: async (chapter_id) => {

          const res = await window._gh_fetch(decodeURIComponent(window.atob(chapter_id)), {
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
          const text1 = doc.querySelector("#chaptercontent").innerHTML
          let arr = text1.split("<br><br>");
          arr.pop();
          arr.pop();

          return arr.map(x => ({ content: x }))
        },
        getImage: async (id) => {
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
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "www.biqgg.cc") {
            return window.btoa(encodeURIComponent(id))
          } else {
            return null
          }
        },
        Search: async (obj) => {
          const res = await window._gh_fetch(`https://www.biqgg.cc/user/search.html?q=${obj.keyword}`, {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": null,
            "method": "GET"
          });
          const json = await res.json();
          let data = [];
          for (let index = 0; index < json.length; index++) {
            const x = json[index];
            data.push({
              id: window.btoa(encodeURIComponent(`https://www.biqgg.cc` + x.url_list)),
              title: x.articlename,
              cover: x.url_img
            })
          }
          return data
        },
      });

    }



  }
  // https://www.biqgg.cc/book/44197/

  comics_register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      name: key,
      type: 'comics',
      is_cache: false,
      is_download: false,
      is_preloading: false,
      is_load_free: false,
      ...config
    }

    events = {
      getList: async () => {
        let list = [];
        return [
        ]
      },
      UrlToDetailId: async () => {
        return null
      },
      getImage: async (id) => {
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
      },
      ...events
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;

    this.change$.next(config)
  }



  novels_register = (config: Config, events: Events) => {
    const key = config.id;

    config = {
      name: key,
      type: 'novels',
      is_cache: false,
      is_download: false,
      ...config
    }
    events = {
      getList: async () => {
        let list = [];
        return [
        ]
      },
      UrlToDetailId: async () => {
        return null
      },
      getImage: async (id) => {
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
      },
      ...events
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;

    this.change$.next(config)
  }

}
