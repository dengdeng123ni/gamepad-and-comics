
# 漫画数据源注册 - window.\_gh_comics_register

## 概述

`window._gh_comics_register` 是一个漫画数据源注册接口，用于将指定的数据源注册到插件中并提供相应的事件回调和功能。通过此接口，可以与漫画数据源进行交互，获取漫画详情、章节、页面等信息，支持搜索、下载和缓存功能。

---

## 注册接口 - `window._gh_comics_register(option, events)`

使用该接口将一个漫画数据源注册到插件中。插件会根据提供的 `option` 和 `events` 配置项执行不同的操作。

### 参数说明

#### `option`

`option` 是一个对象，包含了漫画数据源的相关信息和配置。字段如下：

| 名称           | 描述                                       |
| -------------- | ------------------------------------------ |
| `id`           | 数据源 ID（唯一标识符，字符串类型）        |
| `name`         | 数据源名称（字符串类型）                   |
| `href?`        | 相关数据源链接（字符串类型）               |
| `is_cache?`    | 是否缓存数据（布尔类型）                   |
| `is_download?` | 是否允许下载（布尔类型）                   |
| `is_locked?`   | 是否有锁（布尔类型，表示数据源是否有保护） |
| `menu`         | 菜单数组，包含各种可用的操作选项           |

#### `events`

`events` 是一个对象，包含了处理漫画数据的不同事件。每个事件对应一个回调函数，用于获取数据或执行其他操作。字段如下：

| 名称             | 返回数据类型        | 描述                             |
| ---------------- | ------------------- | -------------------------------- |
| `getDetail`      | `<Comics>`          | 获取漫画数据详情                 |
| `getPages`       | `Array<string>`     | 获取漫画页面数据                 |
| `getImage?`      | `<Blob>`            | 获取漫画页面数据（用于复杂图像） |
| `Search?`        | `Array<ComicsItem>` | 根据关键词查询漫画数据           |
| `UrlToDetailId?` | `<comics_id>`       | 将 URL 转换为漫画 ID             |
| `UrlToList?`     | `Array<ComicsItem>` | 获取漫画列表                     |
| `getList?`       | `Array<ComicsItem>` | 根据 `menu` 查询漫画列表         |

---

## 数据结构

### Comics

`Comics` 是表示漫画数据的对象，包含了漫画的基本信息、封面、章节等内容。字段如下：

| 名称       | 描述                                      |
| ---------- | ----------------------------------------- |
| `id`       | 漫画 ID（唯一标识符）                     |
| `title?`   | 漫画标题                                  |
| `cover?`   | 漫画封面 URL                              |
| `href?`    | 漫画详情链接                              |
| `intro?`   | 漫画简介                                  |
| `author?`  | 作者（字符串或数组对象 `[{name, href}]`） |
| `styles?`  | 作者（字符串或数组对象 `[{name, href}]`） |
| `chapters` | 章节列表（数组，包含章节项）              |

### ChapterItem

`ChapterItem` 代表漫画的章节，包含了章节的标题、封面和章节 ID。字段如下：

| 名称     | 描述         |
| -------- | ------------ |
| `id`     | 章节 ID      |
| `title?` | 章节标题     |
| `cover?` | 章节封面 URL |

### ComicsItem

`ChapterItem` 代表漫画的章节，包含了章节的标题、封面和章节 ID。字段如下：

| 名称        | 描述         |
| ----------- | ------------ |
| `id`        | 漫画 ID      |
| `title?`    | 漫画标题     |
| `subTitle?` | 漫画封面 URL |
| `cover`     | 漫画封面 URL |

### ComicsItem

`ComicsItem` 是表示漫画条目的对象，通常用于漫画列表。字段如下：

| 名称       | 描述         |
| ---------- | ------------ |
| `title`    | 漫画标题     |
| `cover`    | 漫画封面 URL |
| `subTitle` | 漫画副标题   |
| `id`       | 漫画 ID      |

### Pages

`Pages` 是表示漫画页面的数据结构，包含了页面图像的 URL 和尺寸。字段如下：

| 名称     | 描述     |
| -------- | -------- |
| `src`    | 图像链接 |
| `width`  | 图像宽度 |
| `height` | 图像高度 |

---

## 使用示例

**注册漫画数据源：**

```javascript
window._gh_comics_register(
  {
    id: "bilibili",
    name: "哔哩哔哩漫画",
    href: "https://manga.bilibili.com/",
    menu: [
      {
        id: "search",
        icon: "search",
        name: "搜索",
        query: {
          type: "search",
          page_size: 20,
        },
      },
      {
        id: "type",
        icon: "class",
        name: "分类",
        query: {
          type: "multipy",
          page_size: 20,
          list: [
            {
              key: "styles",
              name: "题材",
              index: 0,
              tag: [
                {
                  id: -1,
                  name: "全部",
                  index: 0,
                },
                {
                  id: 999,
                  name: "热血",
                  index: 1,
                },
                {
                  id: 997,
                  name: "古风",
                  index: 2,
                },
                {
                  id: 1016,
                  name: "玄幻",
                  index: 3,
                },
                {
                  id: 998,
                  name: "奇幻",
                  index: 4,
                },
                {
                  id: 1023,
                  name: "悬疑",
                  index: 5,
                },
                {
                  id: 1002,
                  name: "都市",
                  index: 6,
                },
                {
                  id: 1096,
                  name: "历史",
                  index: 7,
                },
                {
                  id: 1092,
                  name: "武侠仙侠",
                  index: 8,
                },
                {
                  id: 1088,
                  name: "游戏竞技",
                  index: 9,
                },
                {
                  id: 1081,
                  name: "悬疑灵异",
                  index: 10,
                },
                {
                  id: 1063,
                  name: "架空",
                  index: 11,
                },
                {
                  id: 1060,
                  name: "青春",
                  index: 12,
                },
                {
                  id: 1054,
                  name: "西幻",
                  index: 13,
                },
                {
                  id: 1048,
                  name: "现代",
                  index: 14,
                },
                {
                  id: 1028,
                  name: "正能量",
                  index: 15,
                },
                {
                  id: 1015,
                  name: "科幻",
                  index: 16,
                },
              ],
            },
            {
              key: "areas",
              name: "区域",
              index: 0,
              tag: [
                {
                  id: -1,
                  name: "全部",
                  index: 0,
                },
                {
                  id: 1,
                  name: "大陆",
                  index: 1,
                },
                {
                  id: 2,
                  name: "日本",
                  index: 2,
                },
                {
                  id: 6,
                  name: "韩国",
                  index: 3,
                },
                {
                  id: 5,
                  name: "其他",
                  index: 4,
                },
              ],
            },
            {
              key: "status",
              name: "进度",
              index: 0,
              tag: [
                {
                  id: -1,
                  name: "全部",
                  index: 0,
                },
                {
                  id: 0,
                  name: "连载",
                  index: 1,
                },
                {
                  id: 1,
                  name: "完结",
                  index: 2,
                },
              ],
            },
            {
              key: "prices",
              name: "收费",
              index: 0,
              tag: [
                {
                  id: -1,
                  name: "全部",
                  index: 0,
                },
                {
                  id: 1,
                  name: "免费",
                  index: 1,
                },
                {
                  id: 2,
                  name: "付费",
                  index: 2,
                },
                {
                  id: 3,
                  name: "等就免费",
                  index: 3,
                },
              ],
            },
            {
              key: "orders",
              name: "排序",
              index: 0,
              tag: [
                {
                  id: 0,
                  name: "人气推荐",
                  index: 0,
                },
                {
                  id: 1,
                  name: "更新时间",
                  index: 1,
                },
                {
                  id: 3,
                  name: "上架时间",
                  index: 2,
                },
              ],
            },
          ],
        },
      },
      {
        id: "ranking",
        icon: "sort",
        name: "排行榜",
        page_size: 20,
        query: {
          type: "choice",
          list: [
            {
              id: 7,
              type: 0,
              description: "前7日综合指标最高的三个月内上线漫画作品排行",
              name: "新作榜",
            },
            {
              id: 11,
              type: 0,
              description: "前7日综合指标最高的男性向漫画作品排行",
              name: "男生榜",
            },
            {
              id: 12,
              type: 0,
              description: "前7日综合指标最高的女性向漫画作品排行",
              name: "女生榜",
            },
            {
              id: 1,
              type: 0,
              description: "前7日人气最高的国漫作品排行，每日更新",
              name: "国漫榜",
            },
            {
              id: 0,
              type: 0,
              description: "前7日人气最高的日漫作品排行，每日更新",
              name: "日漫榜",
            },
            {
              id: 2,
              type: 0,
              description: "前7日人气最高的韩漫作品排行，每日更新",
              name: "韩漫榜",
            },
            {
              id: 5,
              type: 0,
              description: "前7日人气最高的官方精选漫画作品排行，每日更新",
              name: "宝藏榜",
            },
            {
              id: 13,
              type: 2,
              description: "前365日综合指标最高的完结漫画作品排行",
              name: "完结榜",
            },
          ],
        },
      },
      {
        id: "favorites",
        icon: "favorite",
        name: "我的追漫",
        page_size: 20,
        query: {
          type: "choice",
          name: "我的追漫",
          list: [
            {
              order: 1,
              name: "追漫顺序",
              wait_free: 0,
            },
            {
              order: 2,
              name: "更新时间",
              wait_free: 0,
            },
            {
              order: 3,
              name: "最近阅读",
              wait_free: 0,
            },
            {
              order: 4,
              name: "完成等免",
              wait_free: 1,
            },
          ],
        },
      },
    ],
    is_cache: true,
    is_download: false,
    is_locked: true,
  },
  {
    getList: async (obj) => {
      let list = [];
      if (obj.menu_id == "type") {
        let data = {};
        obj.list.forEach((x) => {
          if (x.key == "orders") data.order = x.tag.id;
          if (x.key == "prices") data.is_free = x.tag.id;
          if (x.key == "status") data.is_finish = x.tag.id;
          if (x.key == "areas") data.area_id = x.tag.id;
          if (x.key == "styles") data.style_id = x.tag.id;
        });
        obj.list = undefined;
        data = { ...obj, ...data };

        const res = await window._gh_fetch(
          "https://manga.bilibili.com/twirp/comic.v1.Comic/ClassPage?device=pc&platform=web",
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(data),
            method: "POST",
          },
          {
            proxy: "https://manga.bilibili.com/",
          }
        );
        const json = await res.json();
        list = json.data.map((x) => {
          const httpUrlToHttps = (str) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`;
            } else {
              return str;
            }
          };
          return { id: x.season_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: x.bottom_info };
        });
      } else if (obj.menu_id == "favorites") {
        const res = await window._gh_fetch(
          "https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite?device=pc&platform=web",
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: `{\"page_num\":${obj.page_num},\"page_size\":${obj.page_size},\"order\":${obj.order},\"wait_free\":${obj.wait_free}}`,
            method: "POST",
          },
          {
            proxy: "https://manga.bilibili.com/",
          }
        );
        const json = await res.json();
        const httpUrlToHttps = (str) => {
          const url = new URL(str);
          if (url.protocol == "http:") {
            return `https://${url.host}${url.pathname}`;
          } else {
            return str;
          }
        };
        list = json.data.map((x) => {
          return { id: x.comic_id, cover: httpUrlToHttps(x.vcover), title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` };
        });
      } else if (obj.query_type == "update") {
        const res = await window._gh_fetch(
          "https://manga.bilibili.com/twirp/comic.v1.Comic/GetDailyPush?device=pc&platform=web",
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: `{\"date\":\"${obj.date}\",\"page_num\":1,\"page_size\":50}`,
            method: "POST",
          },
          {
            proxy: "https://manga.bilibili.com/",
          }
        );
        const json = await res.json();
        const httpUrlToHttps = (str) => {
          const url = new URL(str);
          if (url.protocol == "http:") {
            return `https://${url.host}${url.pathname}`;
          } else {
            return str;
          }
        };
        list = json.data.list.map((x) => {
          return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.short_title} 话` };
        });
      } else if (obj.menu_id == "ranking") {
        const res = await window._gh_fetch(
          "https://manga.bilibili.com/twirp/comic.v1.Comic/GetRankInfo?device=pc&platform=web",
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: `{\"id\":${obj.id}}`,
            method: "POST",
          },
          {
            proxy: "https://manga.bilibili.com/",
          }
        );
        const json = await res.json();
        const httpUrlToHttps = (str) => {
          const url = new URL(str);
          if (url.protocol == "http:") {
            return `https://${url.host}${url.pathname}`;
          } else {
            return str;
          }
        };
        list = json.data.list.map((x) => {
          return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.total} 话` };
        });
      } else if (obj.query_type == "home") {
        const res = await window._gh_fetch(
          "https://manga.bilibili.com/twirp/comic.v1.Comic/GetClassPageSixComics?device=pc&platform=web",
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: `{\"id\":${obj.id},\"isAll\":0,\"page_num\":${obj.page_num},\"page_size\":${obj.page_size}}`,
            method: "POST",
          },
          {
            proxy: "https://manga.bilibili.com/",
          }
        );
        const json = await res.json();
        const httpUrlToHttps = (str) => {
          const url = new URL(str);
          if (url.protocol == "http:") {
            return `https://${url.host}${url.pathname}`;
          } else {
            return str;
          }
        };
        list = json.data.roll_six_comics.map((x) => {
          return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `${x.recommendation}` };
        });
      }
      return list;
    },
    getDetail: async (id) => {
      const res = await window._gh_fetch(
        "https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
          },
          body: `{\"comic_id\":${id}}`,
          method: "POST",
        },
        {
          proxy: "https://manga.bilibili.com/",
        }
      );
      const json = await res.json();
      const x = json.data;

      const httpUrlToHttps = (str) => {
        const url = new URL(str);
        if (url.protocol == "http:") {
          return `https://${url.host}${url.pathname}`;
        } else {
          return str;
        }
      };
      return {
        id: x.id,
        href: `https://manga.bilibili.com/detail/mc${x.id}`,
        cover: httpUrlToHttps(x.vertical_cover),
        title: x.title,
        author: x.author_name.toString(),
        intro: x.classic_lines,
        styles: x.styles2.map((x) => ({
          ...x,
          href: `https://manga.bilibili.com/classify?from=manga_detail&styles=${x.id}&areas=-1&status=-1&prices=-1&orders=0`,
        })),
        chapters: x.ep_list
          .map((c) => ({
            ...c,
            cover: httpUrlToHttps(c.cover),
            title: `${c.short_title} ${c.title}`,
          }))
          .reverse(),
        chapter_id: x.read_epid,
      };
    },
    getPages: async (id) => {
      const res = await window._gh_fetch(
        "https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
          },
          body: `{\"ep_id\":${id}}`,
          method: "POST",
        },
        {
          proxy: "https://manga.bilibili.com/",
        }
      );

      const json = await res.json();
      let data = [];
      for (let index = 0; index < json.data.images.length; index++) {
        let x = json.data.images[index];
        let obj = {
          id: "",
          src: "",
          width: 0,
          height: 0,
        };
        const utf8_to_b64 = (str) => {
          return window.btoa(encodeURIComponent(str));
        };
        obj["id"] = `${id}_${index}`;
        obj["src"] = x.path;
        obj["width"] = x.x;
        obj["height"] = x.y;
        data.push(obj);
      }
      return data;
    },
    getImage: async (id) => {
      if (id.substring(0, 4) == "http") {
        const res = await window._gh_fetch(id, {
          method: "GET",
          headers: {
            accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "sec-ch-ua": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          },
          mode: "cors",
        });
        const blob = await res.blob();
        return blob;
      } else {
        const getImageUrl = async (id) => {
          try {
            const res = await window._gh_fetch(
              "https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web",
              {
                headers: {
                  accept: "application/json, text/plain, */*",
                  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                  "content-type": "application/json;charset=UTF-8",
                },
                body: `{\"urls\":\"[\\\"${id}\\\"]\"}`,
                method: "POST",
              },
              {
                proxy: "https://manga.bilibili.com/",
              }
            );
            const json = await res.json();

            return `${json.data[0].complete_url}`;
          } catch (error) {
            return await getImageUrl(id);
          }
        };
        const url = await getImageUrl(id);
        // console.log(id,url);

        const res = await window._gh_fetch(
          url,
          {
            method: "GET",
            headers: {
              accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "sec-ch-ua": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            },
            mode: "cors",
          },
          {
            proxy: "https://manga.bilibili.com/",
          }
        );
        const blob = await res.blob();
        return blob;
      }
    },
    UrlToList: async (id) => {
      //

      return [];
    },
    Search: async (obj) => {
      const res = await window._gh_fetch(
        "https://manga.bilibili.com/twirp/comic.v1.Comic/Search?device=pc&platform=web",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({ key_word: obj.keyword, page_num: obj.page_num, page_size: obj.page_size }),
          method: "POST",
        },
        {
          proxy: "https://manga.bilibili.com/",
        }
      );
      const httpUrlToHttps = (str) => {
        const url = new URL(str);
        if (url.protocol == "http:") {
          return `https://${url.host}${url.pathname}`;
        } else {
          return str;
        }
      };
      const json = await res.json();
      const list = json.data.list.map((x) => ({ id: x.id, title: x.real_title, cover: httpUrlToHttps(x.vertical_cover), subTitle: x.is_finish ? "已完结" : "连载中" }));
      return list;
    },
    getReplies: async (obj) => {
      const href = `https://manga.bilibili.com/detail/mc${obj.comics_id}`;
      await window._gh_new_page(href);
      const sleep = (duration) => {
        return new Promise((resolve) => {
          setTimeout(resolve, duration);
        });
      };
      await sleep(2000);
      const arr = await window._gh_execute_eval(
        `https://manga.bilibili.com`,
        `(async function () { 
              let arr = []; 
              return arr
            })()
            `
      );
      return arr;
    },
    Unlock: async () => {
      return false;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "manga.bilibili.com") {
        return obj.pathname.split("/").at(-1).replace("mc", "");
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "hanime1",
    href: "https://hanime1.me/comics",
    is_cache: true,
    is_download: true,
    is_preloading: true,
    menu: [
      {
        id: "search",
        icon: "search",
        name: "搜索",
        query: {
          type: "search",
          page_size: 30,
        },
      },
      {
        id: "latestUpload",
        icon: "fiber_new",
        name: "最新上傳",
        page_size: 30,
        query: {
          type: "single",
          name: "最新上傳",
        },
      },
    ],
  },
  {
    getList: async (obj) => {
      const res = await window._gh_get_html(`https://hanime1.me/comics?page=${obj.page_num}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      let data = [];
      let nodes = doc.querySelectorAll("body .comic-rows-videos-div");
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        const id = node.querySelector("a").href.split("/").at(-1);
        const cover = node.querySelector("img").getAttribute("data-srcset");
        const title = node.textContent;
        data.push({ id, cover, title });
      }
      return data;
    },
    getDetail: async (id) => { 

      const res = await window._gh_get_html(`https://hanime1.me/comic/${id}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html"); 

      let obj = {
        id: id,
        cover: "",
        title: "",
        author: "",
        href: `https://hanime1.me/comic/${id}`,
        author_href: "",
        intro: "",
        chapters: [],
        chapter_id: id,
        styles: [],
      };
      const utf8_to_b64 = (str) => {
        return window.btoa(encodeURIComponent(str));
      };
      obj.title = doc.querySelector("body > div > div:nth-child(4) > div:nth-child(2) > div > div.col-md-8 > h3").textContent.trim();
      obj.cover = doc.querySelector("body > div > div:nth-child(4) > div:nth-child(2) > div > div.col-md-4 > a > img").src;
      const nodes = doc.querySelectorAll("h5:nth-child(1) .hover-lighter .no-select");
      const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
      const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
      let styles = [];

      if (nodes1.length > nodes.length) {
        for (let index = 0; index < nodes1.length; index++) {
          obj.styles.push({ name: nodes1[index].textContent, href: nodes1[index].parentNode.href });
        }
        obj.author = [{ name: nodes2[0].textContent, href: nodes2[0].parentNode.href }];
      } else {
        for (let index = 0; index < nodes.length; index++) {
          obj.styles.push({ name: nodes[index].textContent, href: nodes[index]?.parentNode?.href });
        }
        obj.author = [{ name: nodes1[0].textContent, href: nodes1[0].parentNode.href }];
      } 

      obj.chapters.push({
        id: utf8_to_b64(`https://hanime1.me/comic/${obj.id}/1`),
        title: obj.title,
        cover: obj.cover,
      });
      return obj;
    },
    getPages: async (id) => { 

      const arr = await window._gh_execute_eval(
        decodeURIComponent(window.atob(id)),
        `
         (async function () {
            const meta = document.createElement('meta');
            meta.httpEquiv = "Content-Security-Policy";
            meta.content = "img-src 'none'";
            document.head.appendChild(meta);
            const length=parseInt(document.querySelector(".current-page-number").parentNode.textContent.split("/").at(-1))
            let arr = [];
            for (let index = 0; index < length; index++) {
              arr.push(document.querySelector("#current-page-image").src)
              document.querySelector(".arrow-right").click();
            }
            return arr
          })()
        `
      );
      return arr;
    },
    getImage: async (id) => {
      if (id.substring(0, 4) == "http") {
        const res = await window._gh_fetch(id, {
          method: "GET",
          headers: {
            accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "sec-ch-ua": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          },
          mode: "cors",
        });
        const blob = await res.blob();
        return blob;
      } else {
        const getHtmlUrl = async (url) => {
          const res = await window._gh_get_html(url, {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: null,
            method: "GET",
          });
          const text = await res.text();
          var parser = new DOMParser();
          var doc = parser.parseFromString(text, "text/html");
          return doc.querySelector("#current-page-image").src;
        };
        const src = await getHtmlUrl(decodeURIComponent(window.atob(id)));

        const res = await window._gh_fetch(src, {
          method: "GET",
          headers: {
            accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "sec-ch-ua": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          },
          mode: "cors",
        });
        const blob = await res.blob();
        return blob;
      }
    },
    Search: async (obj) => {
      const res = await window._gh_get_html(`https://hanime1.me/comics/search?query=${obj.keyword}&page=${obj.page_num}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });

      const text = await res.text();

      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");

      let data = [];
      let nodes = doc.querySelectorAll("body .comic-rows-videos-div");

      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        const id = node.querySelector("a").href.split("/").at(-1);
        const cover = node.querySelector("img").getAttribute("data-srcset");
        const title = node.textContent;
        data.push({ id, cover, title });
      }

      return data;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "hanime1.me") {
        return obj.pathname.split("/").at(-1);
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "ehentai",
    name: "ehentai",
    href: "https://e-hentai.org/",
    is_cache: true,
    is_download: true,
    is_preloading: true,
  },
  {
    getDetail: async (id) => {
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      };
      const res = await window._gh_fetch(b64_to_utf8(id), {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");

      let obj = {
        id: id,
        cover: "",
        title: "",
        href: b64_to_utf8(id),
        author: "",
        intro: "",
        chapters: [],
        chapter_id: id,
      };
      const utf8_to_b64 = (str) => {
        return window.btoa(encodeURIComponent(str));
      };
      obj.title = doc.querySelector("#gn").textContent.trim();
      obj.cover = doc.querySelector("#gd1 > div").style.background.split('"')[1];
      obj.chapters.push({
        id: obj.id,
        title: obj.title,
        cover: obj.cover,
      });

      return obj;
    },
    getPages: async (id) => {
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      };
      const res = await window._gh_fetch(b64_to_utf8(id), {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      let nodes = doc.querySelectorAll(".ptt a");

      let arr = nodes[nodes.length - 2].href.split("/?p=");
      let length = parseInt(arr[1]);
      let data1 = [];
      data1.push(arr[0]);
      for (let index = 0; index < length; index++) {
        data1.push(`${arr[0]}/?p=${index + 1}`);
      }
      let arr2 = [];

      for (let index = 0; index < data1.length; index++) {
        const res = await window._gh_fetch(data1[index], {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
          },
          body: null,
          method: "GET",
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "text/html");
        const nodes = doc.querySelectorAll("#gdt a");

        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          arr2.push(element.href);
        }
      }

      let data = [];
      for (let index = 0; index < arr2.length; index++) {
        let obj = {
          id: "",
          src: "",
          width: 0,
          height: 0,
        };
        const utf8_to_b64 = (str) => {
          return window.btoa(encodeURIComponent(str));
        };

        obj["id"] = `${id}_${index}`;
        obj["src"] = `${utf8_to_b64(arr2[index])}`;
        data.push(obj);
      }

      return data;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "e-hentai.org") {
        return window.btoa(encodeURIComponent(id));
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "baozimhw",
    href: "https://www.baozimhw.com/",
    is_cache: true,
    is_download: true,
  },
  {
    getDetail: async (id) => {
      const res = await window._gh_get_html(`https://www.baozimhw.com/manhua/${id}.html`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      let obj = {
        id: id,
        cover: "",
        title: "",
        author: "",
        href: `https://www.baozimhw.com/manhua/${id}.html`,
        author_href: "",
        intro: "",
        chapters: [],
        chapter_id: id,
        styles: [],
      };
      const utf8_to_b64 = (str) => {
        return window.btoa(encodeURIComponent(str));
      };
      obj.title = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > div.pt-novel > h1 > a").textContent.trim();
      obj.cover = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > img").src;
      const nodes = doc.querySelectorAll("#chapterlist a");
      // const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
      // const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
      let styles = [];

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
        obj.styles.push({ name: nodes[index].textContent, href: nodes[index].parentNode.href });
        obj.chapters.push({
          id: nodes[index].getAttribute("href").split("/").at(-1),
          title: nodes[index].textContent,
        });
      }

      return obj;
    },
    getPages: async (id) => {
      const res = await window._gh_get_html(`https://www.baozimhw.com/manhua/capter/${id}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");

      let data = [];
      let nodes = doc.querySelectorAll(".padding5 img");
      for (let index = 0; index < nodes.length; index++) {
        let obj = {
          id: "",
          src: "",
          width: 0,
          height: 0,
        };

        obj["id"] = `123123${index}`;
        obj["src"] = `${nodes[index].src}`;
        data.push(obj);
      }

      return data;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "www.baozimhw.com") {
        return obj.pathname.split("/").at(-1).split(".")[0];
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "nhentai",
    is_cache: true,
    is_download: true,
    is_preloading: true,
    menu: [],
  },
  {
    getDetail: async (id) => {
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      };
      const res = await window._gh_get_html(b64_to_utf8(id), {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      let obj = {
        id: id,
        cover: "",
        title: "",
        author: "",
        href: b64_to_utf8(id),
        author_href: "",
        intro: "",
        chapters: [],
        chapter_id: id,
        styles: [],
      };
      const utf8_to_b64 = (str) => {
        return window.btoa(encodeURIComponent(str));
      };
      obj.title = doc.querySelector("#info > h1").textContent.trim();
      obj.cover = doc.querySelector("#cover > a > img").src;

      obj.chapters.push({
        id: obj.id,
        title: obj.title,
        cover: obj.cover,
      });

      return obj;
    },
    getPages: async (id) => {
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      };
      const res = await window._gh_get_html(b64_to_utf8(id), {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");

      let data = [];
      let nodes = doc.querySelectorAll(".thumbs a");

      for (let index = 0; index < nodes.length; index++) {
        let obj = {
          id: "",
          src: "",
          width: 0,
          height: 0,
        };
        const utf8_to_b64 = (str) => {
          return window.btoa(encodeURIComponent(str));
        };

        obj["id"] = `${index}`;
        obj["src"] = window.btoa(encodeURIComponent(nodes[index].href.replace("http://localhost:4200", "https://nhentai.net")));
        data.push(obj);
      }

      return data;
    },
    getImage: async (id) => {
      if (id.substring(0, 4) == "http") {
        const res = await window._gh_fetch(id, {
          method: "GET",
          headers: {
            accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "sec-ch-ua": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          },
          mode: "cors",
        });
        const blob = await res.blob();
        return blob;
      } else {
        const getImageUrl = async (id) => {
          const res = await window._gh_fetch(id, {
            method: "GET",
            headers: {
              accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "sec-ch-ua": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            },
            mode: "cors",
          });
          const blob = await res.blob();
          return blob;
        };
        const getHtmlUrl = async (url) => {
          const res = await window._gh_get_html(url, {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
            },
            body: null,
            method: "GET",
          });
          const text = await res.text();
          var parser = new DOMParser();
          var doc = parser.parseFromString(text, "text/html");

          return doc.querySelector("#image-container > a > img").src;
        };

        const src = await getHtmlUrl(decodeURIComponent(window.atob(id)));

        const blob = await getImageUrl(src);
        return blob;
      }
    },
    Search: async (obj) => {
      const res = await window._gh_get_html(`https://hanime1.me/comics/search?query=${obj.keyword}&page=${obj.page_num}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      let data = [];
      let nodes = doc.querySelectorAll("body .comic-rows-videos-div");
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        const id = node.querySelector("a").href.split("/").at(-1);
        const cover = node.querySelector("img").getAttribute("data-srcset");
        const title = node.textContent;
        data.push({ id, cover, title });
      }
      return data;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "nhentai.net") {
        return window.btoa(encodeURIComponent(id));
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "nhentai_xxx",
    href: "https://nhentai.xxx/",
    is_cache: true,
    is_download: true,
    is_preloading: true,
    menu: [],
  },
  {
    getDetail: async (id) => {
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      };
      const res = await window._gh_get_html(b64_to_utf8(id));
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");

      let obj = {
        id: id,
        cover: "",
        title: "",
        author: "",
        href: b64_to_utf8(id),
        author_href: "",
        intro: "",
        chapters: [],
        chapter_id: id,
        styles: [],
      };
      const utf8_to_b64 = (str) => {
        return window.btoa(encodeURIComponent(str));
      };

      obj.title = doc.querySelector(".info > h1").textContent.trim();
      obj.cover = doc.querySelector(".cover > a > img").src;

      obj.chapters.push({
        id: utf8_to_b64(`https://nhentai.xxx${doc.querySelectorAll(".gt_th a")[0].getAttribute("href")}`),
        title: obj.title,
        cover: obj.cover,
      });
      return obj;
    },
    getPages: async (id) => {
      await window._gh_new_page(decodeURIComponent(window.atob(id)));
      const sleep = (duration) => {
        return new Promise((resolve) => {
          setTimeout(resolve, duration);
        });
      };
      await sleep(1000);
      const arr = await window._gh_execute_eval(
        decodeURIComponent(window.atob(id)),
        `
      (async function () {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "img-src 'none'";
  document.head.appendChild(meta);
  const length=parseInt(document.querySelector(".tp").textContent)
  const hr=document.querySelector("#fimg").getAttribute("data-src").split("/")
  const type=hr.pop().split(".")[1]
  const c=hr.join("/")+"/"
  let arr = [];
  for (let index = 0; index < length; index++) {
     arr.push(c+(index+1)+"."+type)
  }
  setTimeout(()=>{
    window.close()
  },500)
  return arr
})()
        `
      );

      return arr;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "nhentai.xxx") {
        return window.btoa(encodeURIComponent(id));
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "yabai",
    href: "https://yabai.si/g",
    is_cache: true,
    is_download: true,
    is_preloading: true,
    menu: [],
  },
  {
    getDetail: async (id) => {
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      };
      const res = await window._gh_get_html(b64_to_utf8(id));

      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");

      let obj = {
        id: id,
        cover: "",
        title: "",
        author: "",
        href: b64_to_utf8(id),
        author_href: "",
        intro: "",
        chapters: [],
        chapter_id: id,
        styles: [],
      };
      const utf8_to_b64 = (str) => {
        return window.btoa(encodeURIComponent(str));
      };

      obj.title = doc.querySelector("#app header > h1").textContent.trim();
      obj.cover = doc.querySelector("#app img").src;

      obj.chapters.push({
        id: utf8_to_b64(`${b64_to_utf8(id)}/read`),
        title: obj.title,
        cover: obj.cover,
      });
      return obj;
    },
    getPages: async (id) => {
      await window._gh_new_page(decodeURIComponent(window.atob(id)));
      const sleep = (duration) => {
        return new Promise((resolve) => {
          setTimeout(resolve, duration);
        });
      };
      await sleep(3000);
      const arr = await window._gh_execute_eval(
        decodeURIComponent(window.atob(id)),
        `(async function () {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "img-src 'none'";
  document.head.appendChild(meta);
  const length=document.querySelectorAll("#page-select option").length
  let arr = [];
  const sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  for (let index = 0; index < length; index++) {
    arr.push(document.querySelector("#app img").src);console.log(index)
    document.querySelector("#app > nav > div > button:nth-child(5)").click();
    await sleep(10)
  }
  return arr
})()`
      ); 

      return arr;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "yabai.si") {
        return window.btoa(encodeURIComponent(id));
      } else {
        return null;
      }
    },
  }
);
window._gh_comics_register(
  {
    id: "kaobei",
    name: "拷贝漫画",
    href: "https://www.mangacopy.com/",
    is_cache: true,
    is_download: true,
    menu: [
      {
        id: "search",
        icon: "search",
        name: "搜索",
        query: {
          type: "search",
          page_size: 30,
        },
      },
    ],
  },
  {
    getDetail: async (novel_id) => {
      const res = await window._gh_get_html(decodeURIComponent(window.atob(novel_id)), {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });
      const text = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      let obj = {
        id: novel_id,
        cover: "",
        title: "",
        author: "",
        href: decodeURIComponent(window.atob(novel_id)),
        intro: "",
        category: "",
        chapters: [],
      };

      obj.cover = doc.querySelector(".content-box img").src;
      obj.title = doc.querySelector(".content-box h6").textContent.trim();
      obj.intro = doc.querySelector(".comicParticulars-synopsis p").textContent.trim();
      obj.author = doc.querySelector(".comicParticulars-title-right > ul > li:nth-child(3) > span:nth-child(1)").textContent.trim();
      const nodes = doc.querySelectorAll("#default全部 > ul:nth-child(1) a");

      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        const id = window.btoa(encodeURIComponent(`https://www.mangacopy.com${node.getAttribute("href")}`));
        const title = node.getAttribute("title");
        obj.chapters.push({ id, title });
      }

      return obj;
    },
    getPages: async (id) => {
      await window._gh_new_page(decodeURIComponent(window.atob(id)));
      const sleep = (duration) => {
        return new Promise((resolve) => {
          setTimeout(resolve, duration);
        });
      };
      await sleep(1000);
      const arr = await window._gh_execute_eval(
        decodeURIComponent(window.atob(id)),
        `
(async function() {
  const sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  for (let index = 0; index < 300; index++) {
    document.querySelector("html").scrollTop = document.querySelector("html").scrollTop + 30;
    await sleep(10)
  }
  const nodes = document.querySelectorAll(".comicContent-list li img");
  let arr=[];
  for (let index = 0; index < nodes.length; index++) {
    arr.push(nodes[index].getAttribute('data-src'))
  }
  setTimeout(()=>{
    window.close()
  },500)
  return arr
})()
        `
      ); 

      return arr;
    },
    UrlToDetailId: async (id) => {
      const obj = new URL(id);
      if (obj.host == "www.mangacopy.com") {
        return window.btoa(encodeURIComponent(id));
      } else {
        return null;
      }
    },
    Search: async (obj) => {
      const res = await window._gh_fetch(`https://www.mangacopy.com/api/kb/web/searchbc/comics?offset=${(obj.page_num - 1) * obj.page_size}&platform=2&limit=${obj.page_size}&q=${obj.keyword}q_type=`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
        },
        body: null,
        method: "GET",
      });

      const json = await res.json();
      let data = [];
      for (let index = 0; index < json.results.list.length; index++) {
        const x = json.results.list[index];
        data.push({
          id: window.btoa(encodeURIComponent(`https://www.mangacopy.com/comic/${x.path_word}`)),
          title: x.name,
          cover: x.cover,
          subTitle: x.author.map((x) => x.name).toString(),
        });
      }
      return data;
    },
  }
);
``` 

## 接口

## 接口 添加右键菜单 - `window._gh_menu_register(region, Array<{name:string,id:string,click:Function}>)` 
## 接口 获取漫画数据 - `window._gh_comics_get_detail(id, option?:{source?:string,is_cache?:boolean})` 
## 接口 获取页面数据 - `window._gh_comics_get_pages(id, option?:{source?:string,is_cache?:boolean})`
## 接口 获取图像数据 - `window._gh_comics_get_image(id, option?:{source?:string,is_cache?:boolean})`

`region` 是一个枚举,可以选 ['comics_item','chapters_item']

```javascript
window._gh_menu_register("comics_list", [
  {
    name: "漫画加载",
    id: "1223",
    click: (list) => {
        for (let index = 0; index < list.length; index++) {
                    const res = await window._gh_comics_get_detail(list[index].id)
                  for (let index = 0; index < res.chapters.length; index++) {
                    const chapter_id = res.chapters[index].id;
                    const pages = await  window._gh_comics_get_pages(chapter_id)
                    for (let index2 = 0; index2 < pages.length; index2++) {
                      await window._gh_comics_get_image(pages[index2].src)
                    }
                  }
        }
    },
  },
]);
```

# 动态执行 JavaScript - window.\_gh_execute_eval

## 概述

`window._gh_execute_eval` 方法允许在指定的网页上执行动态 JavaScript 代码。通过这个方法，您可以将 JavaScript 脚本注入到指定的网页中，并执行该脚本。执行结果将返回给调用者。该方法对于需要与目标网页交互、获取网页内容或执行自动化操作的场景非常有用。

---

## 接口 - `window._gh_execute_eval(url, script)`

### 参数说明

| 名称     | 描述            |
| -------- | --------------- |
| `url`    | 网站地址        |
| `script` | JavaScript 脚本 |

### 示例：

```javascript
const arr = await window._gh_execute_eval(
  `https://example.com`,
  `(async function () { 
    let arr = [];
    return arr;
  })()`
);
```

# 使用发送请求 - window.\_gh_fetch

## 概述

`window._gh_fetch` window.\_gh_fetch 模拟 fetch ,添加了一个配置接口,可以选择添加代理,在代理网站上发起请求,如果没有代理网站,直接由插件后台发起请求

---

## 注册接口 - `window._gh_fetch(input, init,option)`

使用该接口模拟 fetch。插件会根据提供的 `option` 配置项执行不同的操作。

### 参数说明

#### `option`

`option` 是一个对象，相关信息和配置。字段如下：

| 名称    | 描述     |
| ------- | -------- |
| `proxy` | 代理网站 |

### 示例：

```javascript
window._gh_fetch(
  "https://example.com",
  {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
    method: "POST",
  },
  {
    proxy: "https://manga.bilibili.com/",
  }
);
```

# 使用发送请求 - window.\_gh_get_html

## 概述

`window._gh_get_html` 获取网站 DOM

---

## 注册接口 - `window._gh_get_html(url)`

使用该接口,获取网站 dom 结构
 
### 示例：

```javascript
const res = await window._gh_get_html(`https://manga.bilibili.com/`);
const text = await res.text();
var parser = new DOMParser();
var doc = parser.parseFromString(text, "text/html");
```

# 漫画添加接口 - window.\_gh_add_comics

## 概述

`window._gh_add_comics` 添加漫画数据

---

## 接口 - `window._gh_comics_register(Array<string>, option)` 

### 示例：

```javascript
const imageUrls = ["https://example.com/image1.jpg", "https://example.com/image2.jpg", "https://example.com/image3.jpg"];
const options = {
  title: "Comic Page Images",
};

window._gh_add_comics(imageUrls, options);
```


# 提供新的下载文件接口 window.\_gh_generate_file_path

## 示例：

```javascript
window._gh_generate_file_path("可选项", (e) => {
  if (e.page_index !== undefined && e.chapter_id) {
    const is_offprint = e.comics.chapters.length == 1 ? true : false;
    if (is_offprint) {
      return `${e.comics.title}/${e.page_index + 1}.${e.blob.type.split("/").at(-1)}`;
    } else {
      return `${e.comics.title}/${e.chapter_index + 1}_${e.page_index + 1}.${e.blob.type.split("/").at(-1)}`;
    }
  } else if (e.chapter_id) {
    const is_offprint = e.comics.chapters.length == 1 ? true : false;
    if (is_offprint) {
      return `${e.comics.title}.${e.blob.type.split("/").at(-1)}`;
    } else {
      const obj = e.comics.chapters[e.chapter_index];
      return `${e.comics.title}_${obj.title}.${e.blob.type.split("/").at(-1)}`;
    }
  } else {
    return `${e.comics.title}.${e.blob.type.split("/").at(-1)}`;
  }
});
```



// APK 版本 ?? 难以完成 
// Gamepad 输入法 
