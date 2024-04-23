import { HttpClient } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { MessageFetchService } from '../public-api';
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function;
}
interface Config {
  id: string,
  name?: string,
  menu?: Array<any>;
  is_locked?: boolean;
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
  constructor(
    public http: HttpClient,
    public _http: MessageFetchService,
  ) {

    window._gh_register = this.register;
    window._gh_register({
      id: "bilibili",
      name: "哔哩哔哩漫画",
      is_cache: true,
    }, {
      List: async (obj) => {
        let list = [];
        if (obj.menu_id == "type") {
          let data: any = {};
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
      Detail: async (id) => {
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
      Pages: async (id) => {
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
      Image: async (id) => {
        if (id.substring(0, 4) == "http") {
          const res = await  window._gh_fetch(id, {
            method: "GET",
            headers: {
              "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
            },
            mode: "cors"
          }, {
            proxy: "https://manga.bilibili.com/"
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
              return `${json.data[0].url}?token=${json.data[0].token}`
            } catch (error) {
              return await getImageUrl(id)
            }
          }
          const url = await getImageUrl(id);
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
      Query: async (id) => {

      },
      UrlToDetailId: async (id) => {

      }
    });

  }

  register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      name: key,
      is_cache: false,
      ...config
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
  }

}
