window._gh_register({
  id: "bilibili",
  name: "哔哩哔哩漫画",
  menu:[
    {
      id: 'search',
      icon: 'search',
      name: '搜索',
      query: {
        type: 'search'
      }
    },
    {
      id: 'type',
      icon: 'class',
      name: '分类',
      query: {
        type: 'multipy',
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
}, {
  List: async (obj) => {
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
      const res = await window._gh_fetch(id, {
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

  },
  UrlToDetailId: async (id) => {

  }
});

window._gh_register({
  id: "hanime1",
  is_cache: true
}, {
  List: async (obj) => {
    let list = [];
    return list
  },
  Detail: async (id) => {
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
      obj.author = nodes2[0].textContent;
      obj.author_href = nodes2[0].parentNode.href
    } else {
      for (let index = 0; index < nodes.length; index++) {
        obj.styles.push({ name: nodes[index].textContent, href: nodes1[index]?.parentNode?.href })
      }
      obj.author = nodes1[0].textContent;
      obj.author_href = nodes1[0].parentNode.href
    }

    obj.chapters.push({
      id: obj.id,
      title: obj.title,
      cover: obj.cover,
    })
    return obj
  },
  Pages: async (id) => {
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
    let nodes = doc.querySelectorAll(".comics-thumbnail-wrapper img")
    for (let index = 0; index < nodes.length; index++) {
      let _id = nodes[index].dataset.srcset.split("/").at(-2)
      let type = nodes[index].dataset.srcset.split("/").at(-1).split(".").at(-1)
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
      obj["src"] = `https://i.nhentai.net/galleries/${_id}/${index + 1}.${type}`
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
