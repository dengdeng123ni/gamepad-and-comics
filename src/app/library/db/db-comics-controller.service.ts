import { Injectable } from '@angular/core';
import { AppDataService, CacheControllerService, IndexdbControllerService } from 'src/app/library/public-api';
import { DbComicsEventService } from './db-comics-event.service';

import CryptoJS from 'crypto-js'
interface Item { id: string | number, cover: string, title: string, subTitle: string }
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function
}

@Injectable({
  providedIn: 'root'
})
export class DbComicsControllerService {

  lists: any = {};
  query: any = {};
  details: any = {};
  pages: any = {};
  replies: any = {};

  cache = {
    details: false,
    pages: false
  }


  image_url = {};
  constructor(
    private AppData: AppDataService,
    private DbComicsEvent: DbComicsEventService,
    private webDb: IndexdbControllerService,
    private webCh: CacheControllerService
  ) {

    window._gh_comics_get_list = this.getList;
    window._gh_comics_get_detail = this.getDetail;
    window._gh_comics_get_pages = this.getPages;
    window._gh_comics_get_image = this.getImage;
    window._gh_comics_search = this.Search;
    window._gh_cache_fn = this.cache_fn;
  }
  cache_fn = async (json: any, fn: Function, options: { cache_duration: number }) => {
    let obn = JSON.parse(JSON.stringify(json))
    const id = CryptoJS.MD5(JSON.stringify(obn)).toString().toLowerCase();
    const res: any = await this.webDb.getByKey('data', id);
    const get = async () => {
      const data = await fn(json)
      await this.webDb.update('data', { id: id, creation_time: new Date().getTime(), data: data })
      return data
    }
    if (res) {
      const currentTime = Date.now();
      const cacheDuration = currentTime - res.creation_time;
      if (cacheDuration < options.cache_duration) {

        return res.data
      } else {
        return await get()
      }

    } else {
      return await get()
    }
  }

  getList = async (obj: any, option?: {
    source: string,
    cache_duration?: number,
    is_cache?: boolean,
  }): Promise<Array<Item>> => {
    try {
      if (!option.is_cache) option.is_cache = true;
      if (!option.source) option.source = this.AppData.source;
      if (!option.cache_duration) option.cache_duration = 1000 * 60 * 30;
      const config = this.DbComicsEvent.Configs[option.source]
      let obn = JSON.parse(JSON.stringify(obj))
      delete obn['page_size'];
      const id = CryptoJS.MD5(JSON.stringify({ data: obn, source: option.source })).toString().toLowerCase();
      if (this.lists[id] && config.is_cache) {
        return JSON.parse(JSON.stringify(this.lists[id]))
      } else {
        let res;
        if (config.is_cache) {
          const get = async () => {
            const data = await this.DbComicsEvent.Events[option.source]["getList"](obj);
            if (data.length == 0) return []
            await this.webDb.update('list', { id: id, source: option.source, creation_time: new Date().getTime(), data: data })
            return data
          }
          const res_db: any = await this.webDb.getByKey('list', id);
          if (res_db) {
            if (res_db.creation_time) {
              const currentTime = Date.now();
              const cacheDuration = currentTime - res_db.creation_time;

              if (cacheDuration < option.cache_duration) {
                res = res_db.data;
              } else {
                const data = await get();
                res = data;
              }
            } else {
              const data = await get();
              res = data;
            }


          } else {
            const data = await get();
            res = data;
          }
        } else {
          const data = await this.DbComicsEvent.Events[option.source]["getList"](obj);
          res = data;
        }

        res.forEach(x => {
          this.image_url[`${config.id}_comics_${x.id}`] = x.cover;
          x.cover = `http://localhost:7700/${config.id}/comics/${x.id}`;
          x.source = option.source;
        })

        if (res && res.length) this.lists[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } catch (error) {
      console.log(error);
      return []

    }

  }
  getDetail = async (id: string, option?: {
    source: string,
    is_cache?: boolean,
    is_update?: boolean
  }) => {
    try {
      if (!id) return null
      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbComicsEvent.Configs[option.source]
      if (option && option.is_cache === true) config.is_cache = true
      if (option && option.is_cache === false) config.is_cache = false
      if (this.DbComicsEvent.Events[option.source] && this.DbComicsEvent.Events[option.source]["getDetail"]) {

        if (this.details[id] && config.is_cache) {
          return JSON.parse(JSON.stringify(this.details[id]))
        } else {
          let res;
          if (config.is_cache) {

            res = await this.webDb.getByKey('details', id)

            if (res) {
              res = res.data;
              if (res?.cover?.substring(0, 4) == "http") this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
              if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
              res.chapters.forEach(x => {
                if (x?.cover?.substring(0, 4) == "http") this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                if (x.cover && x.cover.substring(7, 21) != "localhost:7700") x.cover = `http://localhost:7700/${config.id}/chapter/${res.id}/${x.id}`;
                if (!x.cover) x.cover = res.cover;
              })
            } else {
              res = await this.DbComicsEvent.Events[option.source]["getDetail"](id);
              this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, source: option.source, data: res })))
              this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
              if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
              res.chapters.forEach(x => {
                this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                if (x.cover && x.cover.substring(7, 21) != "localhost:7700") x.cover = `http://localhost:7700/${config.id}/chapter/${res.id}/${x.id}`;
                if (!x.cover) x.cover = res.cover;
              })
            }
          } else if (option.is_update) {
            res = await this.DbComicsEvent.Events[option.source]["getDetail"](id);
            this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, source: option.source, data: res })))
            this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
            if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
            res.chapters.forEach(x => {
              this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
              if (x.cover && x.cover.substring(7, 21) != "localhost:7700") x.cover = `http://localhost:7700/${config.id}/chapter/${res.id}/${x.id}`;
              if (!x.cover) x.cover = res.cover;
            })
          } else {
            res = await this.DbComicsEvent.Events[option.source]["getDetail"](id);
          }

          if (!Array.isArray(res.author)) {
            res.author = [{ name: res.author }]
          }
          res.source = option.source;
          this.details[id] = JSON.parse(JSON.stringify(res));

          return res
        }
      } else {
        return null
      }
    } catch (error) {
      console.log(error);
      return null
    }

  }
  getPages = async (id: string, option?: {
    source: string,
    is_cache?: boolean,
    is_update?: boolean
  }) => {
    try {
      if (!id) return []
      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbComicsEvent.Configs[option.source]
      if (option && option.is_cache === true) config.is_cache = true
      if (option && option.is_cache === false) config.is_cache = false
      if (this.DbComicsEvent.Events[option.source] && this.DbComicsEvent.Events[option.source]["getPages"]) {
        // const is_wait = await this.waitForRepetition(id)
        if (this.pages[id] && config.is_cache) {
          return JSON.parse(JSON.stringify(this.pages[id]))
        } else {
          let res;
          if (config.is_cache) {

            res = (await this.webDb.getByKey('pages', id)) as any
            if (res) {
              res = res.data;

              res.forEach((x, i) => {
                if (x.src.substring(7, 21) == "localhost:7700") {
                } else {
                  if (x.src.substring(0, 4) == "http") this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
                  if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
                }
              })
            } else {
              res = await this.DbComicsEvent.Events[option.source]["getPages"](id);
              const isEmpty = (value) => {
                if (value === null || value === undefined) {
                  // null 或 undefined
                  return true;
                }

                if (typeof value === "string" && value.trim() === "") {
                  // 空字符串（包括全是空格的情况）
                  return true;
                }

                if (Array.isArray(value) && value.length === 0) {
                  // 空数组
                  return true;
                }

                if (typeof value === "object" && Object.keys(value).length === 0) {
                  // 空对象
                  return true;
                }

                // 其他情况认为非空
                return false;
              }
              if (isEmpty(res)) {
                console.log("获取数据错误,重新获取中", res);
                res = await this.DbComicsEvent.Events[option.source]["getPages"](id)
              }
              if (typeof res[0] === 'string') {
                let arr = res;
                let data = [];
                for (let index = 0; index < arr.length; index++) {
                  let obj = {
                    id: "",
                    src: ""
                  };
                  obj["id"] = `${index}`;
                  obj["src"] = `${arr[index]}`
                  data.push(obj)
                }
                res = data;
              }

              await this.webDb.update('pages', { id, source: option.source, data: JSON.parse(JSON.stringify(res)) })
              res.forEach((x, i) => {
                this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
                if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
              })
            }
          } else if (option.is_update) {
            res = await this.DbComicsEvent.Events[option.source]["getPages"](id);
            const isEmpty = (value) => {
              if (value === null || value === undefined) {
                // null 或 undefined
                return true;
              }

              if (typeof value === "string" && value.trim() === "") {
                // 空字符串（包括全是空格的情况）
                return true;
              }

              if (Array.isArray(value) && value.length === 0) {
                // 空数组
                return true;
              }

              if (typeof value === "object" && Object.keys(value).length === 0) {
                // 空对象
                return true;
              }

              // 其他情况认为非空
              return false;
            }
            if (isEmpty(res)) {
              console.log("获取数据错误,重新获取中", res);
              res = await this.DbComicsEvent.Events[option.source]["getPages"](id)
            }
            if (typeof res[0] === 'string') {
              let arr = res;
              let data = [];
              for (let index = 0; index < arr.length; index++) {
                let obj = {
                  id: "",
                  src: ""
                };
                obj["id"] = `${index}`;
                obj["src"] = `${arr[index]}`
                data.push(obj)
              }
              res = data;
            }

            await this.webDb.update('pages', { id, source: option.source, data: JSON.parse(JSON.stringify(res)) })
            res.forEach((x, i) => {
              this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
              if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
            })
          } else {
            res = await this.DbComicsEvent.Events[option.source]["getPages"](id);
            if (typeof res[0] === 'string') {
              let arr = res;
              let data = [];
              for (let index = 0; index < arr.length; index++) {
                let obj = {
                  id: "",
                  src: ""
                };
                obj["id"] = `${index}`;
                obj["src"] = `${arr[index]}`
                data.push(obj)
              }
              res = data;
            }
          }
          res.forEach((x, i) => {
            if (!x.id) x.id = `${id}_${i}`;
            if (!x.uid) x.uid = `${id}_${i}`;
            if (!x.width) x.width = 0;
            if (!x.height) x.height = 0;
            x.index = i;
          })
          this.pages[id] = JSON.parse(JSON.stringify(res));
          return res
        }
      } else {
        return []
      }
    } catch (error) {
      console.log(error);
      return []
    }

  }

  getImage = async (id: string, option?: {
    source: string,
    is_cache?: boolean
  }): Promise<Blob> => {
    try {
      // console.log(id);

      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbComicsEvent.Configs[option.source]
      if (option && option.is_cache) config.is_cache = true
      let blob = new Blob([], {
        type: 'image/jpeg'
      });
      if (id.substring(7, 21) == "localhost:7700") {
        let url = id;
        const getBlob = async () => {
          const getImageURL2 = async (id: string) => {
            const arr = id.split("/")
            const source = arr[3];
            const type = arr[4];


            if (type == "page") {
              const chapter_id = arr[5];
              const index = arr[6];
              const url = this.image_url[`${source}_page_${chapter_id}_${index}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let resc = (await this.webDb.getByKey('pages', chapter_id) as any)
                if (resc) {
                  resc = resc.data;
                } else {
                  resc = await this.getPages(chapter_id, { source: source, is_cache: false, is_update: true })
                }

                resc.forEach((x, i) => {
                  this.image_url[`${source}_page_${chapter_id}_${i}`] = x.src;
                })
                this.isConditionMet = false;
                return this.image_url[`${source}_page_${chapter_id}_${index}`];
              }
            } else if (type == "comics") {
              const comics_id = arr[5];
              const url = this.image_url[`${source}_comics_${comics_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = (await this.webDb.getByKey('details', comics_id) as any)
                if (res) {
                  res = res.data;
                } else {
                  res = await this.getDetail(comics_id, { source: source, is_cache: false, is_update: true })
                }
                this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet = false;
                return this.image_url[`${source}_comics_${comics_id}`];
              }
            } else if (type == "chapter") {
              const comics_id = arr[5];
              const chapter_id = arr[6];
              const url = this.image_url[`${source}_chapter_${comics_id}_${chapter_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = (await this.webDb.getByKey('details', comics_id) as any)
                if (res) {
                  res = res.data;
                } else {
                  res = await this.getDetail(comics_id, { source: source, is_cache: false, is_update: true })
                }
                this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet = false;
                return this.image_url[`${source}_chapter_${comics_id}_${chapter_id}`];
              }
            } else {
              return ""
            }

          }
          const getImageURL = async (id: string) => {
            const arr = id.split("/")
            const source = arr[3];
            const type = arr[4];
            if (type == "page") {
              const chapter_id = arr[5];
              const index = arr[6];
              const url = this.image_url[`${source}_page_${chapter_id}_${index}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()

                let resc = await this.getPages(chapter_id, { source: source, is_cache: false, is_update: true })
                resc.forEach((x, i) => {
                  this.image_url[`${source}_page_${chapter_id}_${i}`] = x.src;
                })
                this.isConditionMet = false;
                return this.image_url[`${source}_page_${chapter_id}_${index}`];
              }
            } else if (type == "comics") {
              const comics_id = arr[5];
              const url = this.image_url[`${source}_comics_${comics_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = await this.getDetail(comics_id, { source: source, is_cache: false, is_update: true })
                this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet = false;
                return this.image_url[`${source}_comics_${comics_id}`];
              }
            } else if (type == "chapter") {
              const comics_id = arr[5];
              const chapter_id = arr[6];
              const url = this.image_url[`${source}_chapter_${comics_id}_${chapter_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = await this.getDetail(comics_id, { source: source, is_cache: false, is_update: true })
                this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet = false;
                return this.image_url[`${source}_chapter_${comics_id}_${chapter_id}`];
              }
            } else {
              return ""
            }

          }
          let image_id = null;

          const id1 = await getImageURL2(url);
          image_id = id1;
          let blob = await this.DbComicsEvent.Events[option.source]["getImage"](id1)
          if (blob.size < 3000 && blob.type.split("/")[0] == "image") {

            const id2 = await getImageURL(url);
            image_id = id2;
            blob = await this.DbComicsEvent.Events[option.source]["getImage"](id2)
          }


          const response = new Response(blob);
          const request = url;


          const record = async (url, blob) => {
            const image = await createImageBitmap(blob)
            // 其他用途防止黑盒 caches.keys()
            this.webDb.update('image', {
              id: CryptoJS.MD5(url).toString().toLowerCase(),
              creation_time: new Date().getTime(),
              type: blob.type,
              source: option.source,
              src: url,
              page_id: image_id,
              width: image.width,
              height: image.height
            })
            image.close()
          }

          if (blob.size > 5000 && blob.type.split("/")[0] == "image") {
            this.webCh.put('image', request, response.clone());
            const blob1 = await response.clone().blob()
            record(id, blob1)
            return blob1
          }
          else {
            if (blob.type == "binary/octet-stream") {
              const c = await createImageBitmap(blob)
              this.webCh.put('image', request, response.clone());
              const blob1 = await response.clone().blob()
              record(id, blob1)
              return blob1
            }
          }
          const res2 = await this.webCh.match('image', url);
          if (res2) {
            const blob2 = await res2.blob()
            return blob2
          } else {
            return blob
          }
        }

        const res = await this.webCh.match('image', url);

        if (res) {
          blob = await res.blob()

          if (blob.size < 5000 && blob.type.split("/")[0] == "image") {
            const image = await createImageBitmap(blob)
            if (image.height > 0 && image.width > 0) {
            } else {
              blob = await getBlob()
            }
          }
        } else {
          blob = await getBlob()
        }
      } else {
        blob = await this.DbComicsEvent.Events[option.source]["getImage"](id)
      }
      return blob
    } catch (error) {
      return new Blob([], {
        type: 'image/jpeg'
      })
    }
  }

  getReplies = async (comics_id: string, option?: {
    source: string,
    is_cache?: boolean
  }) => {
    try {

      const id = comics_id;
      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbComicsEvent.Configs[option.source]
      if (option && option.is_cache === true) config.is_cache = true
      if (option && option.is_cache === false) config.is_cache = false
      if (this.DbComicsEvent.Events[option.source] && this.DbComicsEvent.Events[option.source]["getReplies"]) {
        if (this.replies[id] && config.is_cache) {
          return JSON.parse(JSON.stringify(this.replies[id]))
        } else {
          let res;
          if (config.is_cache) {
            res = await this.webDb.getByKey('replies', id)
            if (res) {
              res = res.data;
            } else {
              res = await this.DbComicsEvent.Events[option.source]["getReplies"](comics_id);
              this.webDb.update('replies', JSON.parse(JSON.stringify({ id: id, source: option.source, data: res })))

            }
          } else {
            res = await this.DbComicsEvent.Events[option.source]["getReplies"](comics_id);
          }


          res.source = option.source;
          this.replies[id] = JSON.parse(JSON.stringify(res));

          return res
        }
      } else {
        return null
      }
    } catch (error) {
      console.log(error);
      return null
    }

  }

  Search = async (obj: any, option?: {
    source: string
  }): Promise<Array<Item>> => {

    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbComicsEvent.Configs[option.source]
    if (this.DbComicsEvent.Events[option.source] && this.DbComicsEvent.Events[option.source]["Search"]) {
      let res = await this.DbComicsEvent.Events[option.source]["Search"](obj);
      res.forEach(x => {
        this.image_url[`${config.id}_comics_${x.id}`] = x.cover;
        x.cover = `http://localhost:7700/${config.id}/comics/${x.id}`;
      })
      return res
    } else {
      return []
    }
  }
  UrlToList = async (url: string, option?: { source: string, is_cache?: boolean }) => {
    try {
      if (!option.is_cache) option.is_cache = true;
      if (!option.source) option.source = this.AppData.source;
      const config = this.DbComicsEvent.Configs[option.source]

      if (!(this.DbComicsEvent.Events[option.source] && this.DbComicsEvent.Events[option.source]["UrlToList"])) return []
      let obn = JSON.parse(JSON.stringify({ url, source: option.source }))
      const id = CryptoJS.MD5(JSON.stringify(obn)).toString().toLowerCase();
      if (this.lists[id] && config.is_cache) {
        return JSON.parse(JSON.stringify(this.lists[id]))
      } else {
        let res;
        if (config.is_cache) {
          const get = async () => {
            const data = await this.DbComicsEvent.Events[option.source]["UrlToList"](url);
            if (data.length == 0) return []
            const response = new Response(new Blob([JSON.stringify(data)], { type: 'application/json' }), {
              headers: { 'Content-Type': 'application/json', 'Cache-Timestamp': new Date().getTime().toString() }
            });
            this.webCh.put('list', request, response);
            return data
          }
          const request = `http://localhost:7700/${option.source}/${id}`
          const cachedData = await this.webCh.match('list', request);
          if (cachedData) {
            const cacheTimestamp = parseInt(cachedData.headers.get('Cache-Timestamp'))
            const currentTime = Date.now();
            const cacheDuration = currentTime - cacheTimestamp;
            if (cacheDuration) {
              get().then(x => {
                this.lists[id] = x;
              });
              // console.log('缓存失效');
            } else {
              // console.log('缓存有效，返回数据');
            }
            const data = await cachedData.json();
            res = data;
          } else {
            const data = await get();
            res = data;
          }
        } else {
          const data = await this.DbComicsEvent.Events[option.source]["UrlToList"](url);
          res = data;
        }

        if (res && res.length) this.lists[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } catch (error) {
      console.log(error);
      return []

    }
  }
  UrlToDetailId = async (url: any, option?: {
    source: string
  }) => {
    let res = await this.DbComicsEvent.Events[option.source]["UrlToDetailId"](url);
    return res
  }
  async delWebDbDetail(id) {
    this.details[id] = null;
    await this.webDb.deleteByKey('details', id)
  }
  async Unlock(id, option?: {
    source: string
  }) {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    if (this.DbComicsEvent.Events[option.source] && this.DbComicsEvent.Events[option.source]["Unlock"]) {
      return await this.DbComicsEvent.Events[option.source]["Unlock"](id);
    } else {
      return false
    }
  }
  async putWebDbDetail(id, obj) {
    this.details[id] = null;
    const res: any = await this.webDb.getByKey('details', id)
    if (res) {
      await this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, source: res.source, data: obj })))
    } else {
      await this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, data: obj })))
    }
  }
  async delWebDbPages(id) {
    this.pages[id] = null;
    await this.webDb.deleteByKey('pages', id)
  }
  async putWebDbPages(id, pages, obj = {}) {
    this.pages[id] = null;
    const res: any = await this.webDb.getByKey('pages', id)
    if (res) {
      await this.webDb.update('pages', { ...res, data: JSON.parse(JSON.stringify(pages)), ...obj })
    } else {
      await this.webDb.update('pages', { id: id, data: JSON.parse(JSON.stringify(pages)), ...obj })
    }
  }
  load = {};
  async loadPages(id, option?: {
    source: string
  }) {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbComicsEvent.Configs[option.source];
    if (!config.is_preloading || !config.is_cache) return

    if (this.load[id]) {

    } else {
      this.load[id] = id;
      const pages = await this.getPages(id);
      for (let index = (pages.length - 1); 0 <= index; index--) {
        const res = await this.webCh.match('image', pages[index].src);

        if (!res) {
          this.tasks.unshift({ id: pages[index].src, option })
        } else {

        }
      }

      this.processTasks();
    }
  }
  tasks = []; // 存储所有要执行的任务
  concurrent = 0; // 当前正在执行的任务数量
  maxConcurrent = 1; // 最大并发数量
  processTasks() {
    while (this.concurrent < this.maxConcurrent && this.tasks.length > 0) {
      const task = this.tasks.shift(); // 从队列中取出一个任务
      this.getImage(task.id, task.option)
        .then(() => {
          this.concurrent--; // 任务完成，减少并发计数
          this.processTasks(); // 继续处理下一个任务
        })
        .catch(error => {
          this.concurrent--; // 任务完成，减少并发计数
          this.processTasks(); // 继续处理下一个任务
        });
      this.concurrent++; // 增加并发计数
    }
  }
  async addImage(url, blob) {
    const image = await createImageBitmap(blob)
    const response = new Response(blob);
    const request = url;
    this.webDb.update('image', {
      id: CryptoJS.MD5(url).toString().toLowerCase(),
      creation_time: new Date().getTime(),
      type: blob.type,
      src: url,
      width: image.width,
      height: image.height
    })
    await this.webCh.put('image', request, response);
  }

  async delWebDbImage(id) {
    const res = await this.webCh.delete('image', id);
    if (res) {
      await this.webDb.deleteByKey('image', CryptoJS.MD5(id).toString().toLowerCase())
    }
    return res
  }

  async delComicsAllImages(comics_id) {
    const c = await this.getDetail(comics_id)
    const source = this.AppData.source;
    let list = [];
    list.push(`http://localhost:7700/${source}/comics/${comics_id}`)
    for (let index = 0; index < c.chapters.length; index++) {
      const x = c.chapters[index];
      list.push(`http://localhost:7700/${source}/chapter/${comics_id}/${x.id}`)
      let res = (await this.webDb.getByKey('pages', x.id) as any)
      if (res) {
        res = res.data;
        res.forEach((x, i) => {
          list.push(`http://localhost:7700/${source}/page/${x.id}/${index}`)
        })
        this.delWebDbPages(x.id)
      }
    }
    this.delWebDbDetail(comics_id)
    list.forEach(x => {
      this.delWebDbImage(x)
    })
  }
  isConditionMet = false;
  async waitForCondition(): Promise<boolean> {
    if (!this.isConditionMet) {

      return true
    }
    return new Promise((r, j) => {
      const get = () => {
        setTimeout(() => {
          if (!this.isConditionMet) r(true)
          else get()
        }, 33)
      }

      get();
      setTimeout(() => {
        if (!this.isConditionMet) j(false)
      }, 30000)
    })
  }


  waitList = [];
  async waitForRepetition(id) {
    const obj = this.waitList.find(x => x.id == id);
    if (obj) {
      if (obj.is_loading) {
        return true
      } else {
        await this.sleep(30)
        return await this.waitForRepetition(id)
      }
    } else {
      this.waitList.push({ id: id, is_loading: false })
      return false
    }
  }
  async updateWaitList(id) {
    const index = this.waitList.findIndex(x => x.id == id);
    if (index > -1) {
      this.waitList[index].is_loading = true;
    }
  }
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
}
