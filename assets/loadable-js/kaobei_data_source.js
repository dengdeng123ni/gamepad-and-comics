window._gh_comics_register({
  id: "kaobei",
  name: "拷贝漫画",
  href: "https://www.mangacopy.com/",
  is_cache: true,
  is_download: true,
  menu: [
    {
      id: 'advanced_search',
      icon: 'search',
      name: '搜索',
      query: {
        type: 'advanced_search',
        conditions: [
          {
            "id": "search",
            "type": "search"
          },
          {
            "id": "q_type",
            "name": "类型",
            "type": "select",
            "options": [
              {
                "label": "名称",
                "value": "name"
              },
              {
                "label": "作者",
                "value": "author"
              },
              {
                "label": "汉化组",
                "value": "local"
              },
            ]
          },
        ]
      },
    },
    {
      id: 'discover',
      icon: 'ballot',
      name: '发现',
      query: {
        type: 'choice',
        name: '发现',
        conditions: [
          {
            "label": "编辑推荐",
            "value": "1"
          },
          {
            "label": "全新上架",
            "value": "2"
          },
          {
            "label": "热门更新",
            "value": "3"
          },

        ]
      }
    },
    {
      id: 'type',
      icon: 'class',
      name: '分类',
      query: {
        type: 'multipy',
        page_size: 20,
        conditions: [
          {
            "key": "styles",
            "name": "题材",
            "index": 0,
            "tag": [

              {
                "name": "全部",
                "id": "-1"
              },
              {
                "name": "愛情",
                "id": "aiqing"
              },
              {
                "name": "歡樂向",
                "id": "huanlexiang"
              },
              {
                "name": "冒險",
                "id": "maoxian"
              },
              {
                "name": "奇幻",
                "id": "qihuan"
              },
              {
                "name": "百合",
                "id": "baihe"
              },
              {
                "name": "校园",
                "id": "xiaoyuan"
              },
              {
                "name": "科幻",
                "id": "kehuan"
              },
              {
                "name": "東方",
                "id": "dongfang"
              },
              {
                "name": "耽美",
                "id": "danmei"
              },
              {
                "name": "生活",
                "id": "shenghuo"
              },
              {
                "name": "格鬥",
                "id": "gedou"
              },
              {
                "name": "轻小说",
                "id": "qingxiaoshuo"
              },
              {
                "name": "悬疑",
                "id": "xuanyi"
              },
              {
                "name": "其他",
                "id": "qita"
              },
              {
                "name": "神鬼",
                "id": "shengui"
              },
              {
                "name": "职场",
                "id": "zhichang"
              },
              {
                "name": "",
                "id": "teenslove"
              },
              {
                "name": "萌系",
                "id": "mengxi"
              },
              {
                "name": "治愈",
                "id": "zhiyu"
              },
              {
                "name": "長條",
                "id": "changtiao"
              },
              {
                "name": "四格",
                "id": "sige"
              },
              {
                "name": "节操",
                "id": "jiecao"
              },
              {
                "name": "舰娘",
                "id": "jianniang"
              },
              {
                "name": "竞技",
                "id": "jingji"
              },
              {
                "name": "搞笑",
                "id": "gaoxiao"
              },
              {
                "name": "伪娘",
                "id": "weiniang"
              },
              {
                "name": "热血",
                "id": "rexue"
              },
              {
                "name": "励志",
                "id": "lizhi"
              },
              {
                "name": "性转换",
                "id": "xingzhuanhuan"
              },
              {
                "name": "彩色",
                "id": "COLOR"
              },
              {
                "name": "後宮",
                "id": "hougong"
              },
              {
                "name": "美食",
                "id": "meishi"
              },
              {
                "name": "侦探",
                "id": "zhentan"
              },
              {
                "name": "",
                "id": "aa"
              },
              {
                "name": "音乐舞蹈",
                "id": "yinyuewudao"
              },
              {
                "name": "魔幻",
                "id": "mohuan"
              },
              {
                "name": "战争",
                "id": "zhanzheng"
              },
              {
                "name": "历史",
                "id": "lishi"
              },
              {
                "name": "异世界",
                "id": "yishijie"
              },
              {
                "name": "惊悚",
                "id": "jingsong"
              },
              {
                "name": "机战",
                "id": "jizhan"
              },
              {
                "name": "都市",
                "id": "dushi"
              },
              {
                "name": "穿越",
                "id": "chuanyue"
              },
              {
                "name": "恐怖",
                "id": "kongbu"
              },
              {
                "name": "",
                "id": "comiket100"
              },
              {
                "name": "重生",
                "id": "chongsheng"
              },
              {
                "name": "",
                "id": "comiket99"
              },
              {
                "name": "",
                "id": "comiket101"
              },
              {
                "name": "",
                "id": "comiket97"
              },
              {
                "name": "",
                "id": "comiket96"
              },
              {
                "name": "生存",
                "id": "shengcun"
              },
              {
                "name": "宅系",
                "id": "zhaixi"
              },
              {
                "name": "武侠",
                "id": "wuxia"
              },
              {
                "name": "",
                "id": "C98"
              },
              {
                "name": "",
                "id": "comiket95"
              },
              {
                "name": "",
                "id": "fate"
              },
              {
                "name": "转生",
                "id": "zhuansheng"
              },
              {
                "name": "無修正",
                "id": "Uncensored"
              },
              {
                "name": "仙侠",
                "id": "xianxia"
              },
              {
                "name": "",
                "id": "loveLive"
              },




            ]
          },
          {
            "key": "areas",
            "name": "区域",
            "index": 0,
            "tag": [
              {
                "name": "全部",
                "id": "-1"
              },
              {
                "name": "日漫",
                "id": "0"
              },
              {
                "name": "韓漫",
                "id": "1"
              },
              {
                "name": "美漫",
                "id": "2"
              },

            ]
          },
          {
            "key": "status",
            "name": "状态",
            "index": 0,
            "tag": [
              {
                "name": "全部",
                "id": "-1"
              },
              {
                "name": "連載中",
                "id": "0"
              },
              {
                "name": "已完結",
                "id": "1"
              },
              {
                "name": "短篇",
                "id": "2"
              },

            ]
          },
          {
            "key": "prices",
            "name": "排序",
            "index": 0,
            "tag": [
              {
                "name": "更新時間",
                "id": "-datetime_updated"
              },
              {
                "name": "熱門",
                "id": "-popular"
              }
            ]
          }
        ]
      }
    },
    {
      id: 'featured',
      icon: 'featured_play_list',
      name: '漫画专题',
      query: {
        type: 'choice',
        name: '漫画专题',
        updateConditions: async () => {
          const fn = async () => {
            const res = await window._gh_fetch(`https://www.mangacopy.com/topic`)
            const text = await res.text();
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, 'text/html');
            const nodes = doc.querySelectorAll(".col-6")
            let arr = [];
            for (let index = 0; index < nodes.length; index++) {
              const node = nodes[index];
              let obj = {};
              const label = node.querySelector(".specialContentImage")?.textContent;
              const href = "https://www.mangacopy.com" + node.querySelector("a").getAttribute("href");
              obj["label"] = label;

              obj["id"] = window.btoa(encodeURIComponent(href));
              arr.push(obj)
            }
            return arr
          }

          const arr= await window._gh_cache_fn('topic', fn, { cache_duration: 3000 * 60 *60 * 24 })
          return arr



          // return []
        },
        conditions: [

        ]
      }
    },
    {
      id: 'sort',
      icon: 'sort',
      name: '排行榜',
      query: {
        type: 'double_choice',
        name: '排行榜',
        conditions: [
          {
            label: "漫画排行榜(男频)",
            "value": "male",
            "options": [
              {
                "label": "日榜(上升最快)",
                "value": "day"
              },
              {
                "label": "周榜(最近7天)",
                "value": "week"
              },
              {
                "label": "月榜(最近30天)",
                "value": "month"
              },
              {
                "label": "总榜单",
                "value": "total"
              },
            ]
          },
          {
            label: "漫画排行榜(女频)",
            "value": "female",
            "options": [
              {
                "label": "日榜(上升最快)",
                "value": "day"
              },
              {
                "label": "周榜(最近7天)",
                "value": "week"
              },
              {
                "label": "月榜(最近30天)",
                "value": "month"
              },
              {
                "label": "总榜单",
                "value": "total"
              },
            ]
          },

        ]
      }
    },
  ],
}, {
  getList: async (obj) => {
    if (obj.menu_id == "sort") {
      if (obj.page_num == 1) {
        const res = await window._gh_execute_eval(`https://www.mangacopy.com/rank?type=${obj.value}&table=${obj.option.value}`,
          `
          (async function () {
          const sleep = (duration) => {
return new Promise(resolve => {
  setTimeout(resolve, duration);
})
}
for (let index = 0; index < 200; index++) {
document.querySelector("html").scrollTop = document.querySelector("html").scrollTop + 30;
await sleep(10)
}


          const nodes = document.querySelectorAll(".col-4")
          let arr = [];
          for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            let obj = {};
            const cover = node.querySelector("img").src
            const title = node.querySelector("p")?.textContent;
            const subTitle = node.querySelector(".update span")?.textContent;
            const href=node.querySelector("a").href;
            obj["cover"] = cover;
            obj["title"] = title;
            obj["subTitle"] = subTitle;
            obj["href"] = href;
            obj["id"] = window.btoa(encodeURIComponent(href));
            arr.push(obj)
          }
          return arr
        })()
          `
        )
        console.log(res);

        return res
      } else {
        return []
      }

    } else if (obj.menu_id == "featured") {
      if (obj.page_num == 1) {
        const res = await window._gh_fetch(
          decodeURIComponent(window.atob(obj.id))
        )
        const text = await res.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');
        const nodes = doc.querySelectorAll(".col-6")
        let arr = [];
        for (let index = 0; index < nodes.length; index++) {
          const node = nodes[index];
          let obj = {};
          const cover = node.querySelector("img").getAttribute("data-src")
          const title = node.querySelector("p")?.textContent;
          const subTitle = node.querySelector("p:nth-child(4)")?.textContent;
          const href = "https://www.mangacopy.com" + node.querySelector("a").getAttribute("href");
          obj["cover"] = cover;
          obj["title"] = title;
          obj["subTitle"] = subTitle;
          obj["href"] = href;
          obj["id"] = window.btoa(encodeURIComponent(href));
          arr.push(obj)
        }
        return arr
      } else {
        return []
      }
    } else if (obj.menu_id == "discover") {
      if (obj.value == "1") {
        const res = await window._gh_fetch(
          `https://www.mangacopy.com/recommend?type=3200102&offset=${obj.page_num * 60 - 60}&limit=60`
        )
        const text = await res.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');
        const nodes = doc.querySelectorAll(".col-auto")
        let arr = [];
        for (let index = 0; index < nodes.length; index++) {
          const node = nodes[index];
          let obj = {};
          const cover = node.querySelector("img").getAttribute("data-src")
          const title = node.querySelector("p")?.textContent;
          const subTitle = node.querySelector(".exemptComicItem-txt-box > div > span > a")?.textContent;
          const href = "https://www.mangacopy.com" + node.querySelector("a").getAttribute("href");
          obj["cover"] = cover;
          obj["title"] = title;
          obj["subTitle"] = subTitle;
          obj["href"] = href;
          obj["id"] = window.btoa(encodeURIComponent(href));
          arr.push(obj)
        }
        return arr
      } else if (obj.value == "2") {
        const res = await window._gh_fetch(
          ` https://www.mangacopy.com/newest?offset=${obj.page_num * 60 - 60}&limit=60`
        )
        const text = await res.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');
        const nodes = doc.querySelectorAll(".col-auto")
        let arr = [];
        for (let index = 0; index < nodes.length; index++) {
          const node = nodes[index];
          let obj = {};
          const cover = node.querySelector("img").getAttribute("data-src")
          const title = node.querySelector("p")?.textContent;
          const subTitle = node.querySelector(".exemptComicItem-txt-box > div > span > a")?.textContent;
          const href = "https://www.mangacopy.com" + node.querySelector("a").getAttribute("href");
          obj["cover"] = cover;
          obj["title"] = title;
          obj["subTitle"] = subTitle;
          obj["href"] = href;
          obj["id"] = window.btoa(encodeURIComponent(href));
          arr.push(obj)
        }
        return arr
      } else if (obj.value == "3") {
        // const res = await window._gh_fetch(
        //   `https://www.mangacopy.com/comics?ordering=-datetime_updated&offset=${obj.page_num*50-50}&limit=50`
        // )

        const arr = await window._gh_execute_eval(`https://www.mangacopy.com/comics?ordering=-datetime_updated&offset=${obj.page_num * 50 - 50}&limit=50`,
          `
(async function () {
const nodes = document.querySelectorAll(".col-auto")
let arr = [];
for (let index = 0; index < nodes.length; index++) {
const node = nodes[index];
let obj = {};
const cover = node.querySelector("img").getAttribute("data-src")
const title = node.querySelector("p")?.textContent;
const subTitle = node.querySelector(".exemptComicItem-txt > span > a")?.textContent;
const href = "https://www.mangacopy.com" + node.querySelector("a").getAttribute("href");
obj["cover"] = cover;
obj["title"] = title;
obj["subTitle"] = subTitle;
obj["href"] = href;
obj["id"] = window.btoa(encodeURIComponent(href));
arr.push(obj)
}
return arr
})()


  `)

        return arr
      }





    } else if (obj.menu_id == "advanced_search") {
      if (!obj.search) return []

      const res = await window._gh_fetch(`https://www.mangacopy.com/api/kb/web/searchbc/comics?offset=${(obj.page_num - 1) * 12}&platform=2&limit=${12}&q=${obj.search}&q_type=${obj.q_type ?? ""}`)
      const json = await res.json();

      let data = [];
      for (let index = 0; index < json.results.list.length; index++) {
        const x = json.results.list[index];
        data.push({
          id: window.btoa(encodeURIComponent(`https://www.mangacopy.com/comic/${x.path_word}`)),
          title: x.name,
          cover: x.cover,
          subTitle: x.author.map(x => x.name).toString()
        })
      }
      return data


    } else if (obj.menu_id == "type") {
      console.log(obj);

      let serf = {};

      if (obj.styles.id !== "-1") serf["theme"] = obj.styles.id;
      if (obj.areas.id !== "-1") serf["region"] = obj.areas.id;
      if (obj.status.id !== "-1") serf["status"] = obj.status.id;
      serf["ordering"] = obj.prices.id;
      const params = new URLSearchParams(serf).toString();
      console.log(`https://www.mangacopy.com/comics?${params}&offset=${obj.page_num * 50 - 50}&limit=50`);

      const arr = await window._gh_execute_eval(`https://www.mangacopy.com/comics?${params}&offset=${obj.page_num * 50 - 50}&limit=50`,
        `
(async function () {
const nodes = document.querySelectorAll(".col-auto")
let arr = [];
for (let index = 0; index < nodes.length; index++) {
const node = nodes[index];
let obj = {};
const cover = node.querySelector("img").getAttribute("data-src")
const title = node.querySelector("p")?.textContent;
const subTitle = node.querySelector(".exemptComicItem-txt > span > a")?.textContent;
const href = "https://www.mangacopy.com" + node.querySelector("a").getAttribute("href");
obj["cover"] = cover;
obj["title"] = title;
obj["subTitle"] = subTitle;
obj["href"] = href;
obj["id"] = window.btoa(encodeURIComponent(href));
arr.push(obj)
}
return arr
})()


`)

      return arr

    }
    return []

  },
  getDetail: async (comcis_id) => {

    const res = await window._gh_get_html(decodeURIComponent(window.atob(comcis_id)));
    const text = await res.text();
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/html');
    let obj = {
      id: comcis_id,
      cover: "",
      title: "",
      author: [],
      href: decodeURIComponent(window.atob(comcis_id)),
      intro: "",
      category: "",
      chapters: [

      ],
    }

    obj.cover = doc.querySelector(".content-box img").src;
    obj.title = doc.querySelector(".content-box h6").textContent.trim();
    obj.intro = doc.querySelector(".comicParticulars-synopsis p").textContent.trim();

    const nodes2 = doc.querySelectorAll(".comicParticulars-title-right > ul > li:nth-child(3) .comicParticulars-right-txt a");
    for (let index = 0; index < nodes2.length; index++) {
      const element = nodes2[index];
      const name = element.textContent.trim()
      const href = `https://www.mangacopy.com${element.getAttribute("href")}`;

      obj.author.push({
        name: name,
        href,
        router: ['advanced_search', { search: name }]
      })
    }

    const nodes = doc.querySelectorAll("#default全部 ul:nth-child(1) a");

    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const id = window.btoa(encodeURIComponent(`https://www.mangacopy.com${node.getAttribute("href")}`))
      const title = node.getAttribute("title")
      obj.chapters.push({ id, title })
    }
    obj.author = obj.author

    return obj
  },
  getPages: async (id) => {
    const arr = await window._gh_execute_eval(decodeURIComponent(window.atob(id)),
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
return arr
})()
  `)

    return arr
  },
  UrlToDetailId: async (id) => {
    const obj = new URL(id);
    if (obj.host == "www.mangacopy.com") {
      console.log(id);

      return window.btoa(encodeURIComponent(id))
    } else {
      return null
    }
  },
  Search: async (obj) => {

    const res = await window._gh_fetch(`https://www.mangacopy.com/api/kb/web/searchbc/comics?offset=${(obj.page_num - 1) * obj.page_size}&platform=2&limit=${obj.page_size}&q=${obj.keyword}q_type=`, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type": "application/json;charset=UTF-8"
      },
      "body": null,
      "method": "GET"
    })


    const json = await res.json();
    let data = [];
    for (let index = 0; index < json.results.list.length; index++) {
      const x = json.results.list[index];
      data.push({
        id: window.btoa(encodeURIComponent(`https://www.mangacopy.com/comic/${x.path_word}`)),
        title: x.name,
        cover: x.cover,
        subTitle: x.author.map(x => x.name).toString()
      })
    }
    return data
  },
});
