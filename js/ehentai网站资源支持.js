window._gh_comics_register({
  id: "ehentai",
  name: "ehentai",
  href: "https://e-hentai.org/",
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
            "id": "f_search",
            "label": "关键字",
            "type": "search"
          },
          {
            "id": "f_cats",
            "label": "类别",
            "type": "tag",
            "options": [
              {
                "label": "同人志",
                "value": "1021"
              },
              {
                "label": "漫画",
                "value": "1019"
              },
              {
                "label": "艺术家 CG",
                "value": "1015"
              },
              {
                "label": "游戏 CG",
                "value": "1007"
              },
              {
                "label": "西方",
                "value": "511"
              },
              {
                "label": "非 H",
                "value": "767"
              },
              {
                "label": "图像集",
                "value": "991"
              },
              {
                "label": "角色扮演",
                "value": "959"
              },
              {
                "label": "亚洲色情",
                "value": "895"
              },
              {
                "label": "杂项",
                "value": "1022"
              }
            ]
          },
          {
            "id": "f_srdd",
            "label": "最低评分",
            "type": "select",
            "options": [
              { "label": "1", "value": 1 },
              { "label": "2", "value": 2 },
              { "label": "3", "value": 3 },
              { "label": "4", "value": 4 },
              { "label": "5", "value": 5 }
            ]
          },
          {
            "id": "language",
            "label": "语言",
            "type": "select",
            "options": [
              { "label": "中文", "value": "chinese" }
            ]
          },
          {
            "id": "f_sh",
            "label": "浏览已删除画廊",
            "type": "toggle"
          },
          {
            "id": "f_spf",
            "label": "最小页数",
            "type": "slider",
            min: 0,
            max: 300
          },
          {
            "id": "f_spt",
            "label": "最大页数",
            "type": "slider",
            min: 0,
            max: 2000
          },
        ]
      },
    },
    {
      id: 'latest',
      icon: 'fiber_new',
      name: '最新',
      query: {
        type: 'single',
        name: '最新'
      }
    },
    {
      id: 'popular',
      icon: 'local_fire_department',
      name: '热门',
      query: {
        type: 'single',
        name: '热门'
      }
    },
    {
      id: 'sort',
      icon: 'sort',
      name: '排行榜',
      query: {
        type: 'choice',
        name: '排行榜',
        conditions: [
          {
            order: 4,
            name: "日"
          },
          {
            order: 3,
            name: "月"
          },
          {
            order: 2,
            name: "年"
          },
          {
            order: 1,
            name: "总"
          },
        ]
      }
    },
    {
      id: 'favorite',
      icon: 'favorite',
      name: '收藏',
      query: {
        type: 'single',
        name: '收藏',
      }
    },
  ]
}, {
  getList: async (obj) => {
    if (obj.menu_id == "popular") {
      if (obj.page_num == 1) {
        const res = await window._gh_fetch("https://e-hentai.org/popular", {
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
        const nodes = doc.querySelectorAll(".gltc tr");

        let list = [];
        for (let index = 1; index < nodes.length; index++) {
          const x = nodes[index];
          let obj = {}
          const src = x.querySelector(".glthumb img").getAttribute("src");
          obj["cover"] = src;
          if (obj["cover"].substring(0, 4) != "http") {
            const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
            obj["cover"] = datasrc;
          }
          const title = x.querySelector(".glname .glink").textContent.trim();
          obj["title"] = title;
          const id = x.querySelector(".glname a").href
          obj["id"] = window.btoa(encodeURIComponent(id));
          const subTitle = x.querySelector(".gl1c").textContent
          obj["subTitle"] = subTitle;
          list.push(obj)
        }
        return list
      } else {
        return []
      }

    } else if (obj.menu_id == "latest") {
      if (obj.page_num == 1) {
        const res = await window._gh_fetch("https://e-hentai.org/", {
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
        const nodes = doc.querySelectorAll(".gltc tr");
        if (doc.querySelector("#unext").getAttribute("href")) {
          const href = doc.querySelector("#unext").getAttribute("href");
          window._gh_set_data(`${obj.page_num}_latest`, {
            href: href,
            page_num: obj.page_num
          })
        }
        let list = [];
        for (let index = 1; index < nodes.length; index++) {
          const x = nodes[index];
          let obj = {}
          const src = x.querySelector(".glthumb img").getAttribute("src");
          obj["cover"] = src;
          if (obj["cover"].substring(0, 4) != "http") {
            const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
            obj["cover"] = datasrc;
          }
          const title = x.querySelector(".glname .glink").textContent.trim();
          obj["title"] = title;
          const id = x.querySelector(".glname a").href
          obj["id"] = window.btoa(encodeURIComponent(id));
          const subTitle = x.querySelector(".gl1c").textContent
          obj["subTitle"] = subTitle;
          list.push(obj)
        }
        return list
      } else {
        const obj22 = await window._gh_get_data(`${obj.page_num - 1}_latest`)
        if (obj22) {
          const res = await window._gh_fetch(obj22.href, {
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
          const nodes = doc.querySelectorAll(".gltc tr");
          if (doc.querySelector("#unext").getAttribute("href")) {
            const href = doc.querySelector("#unext").getAttribute("href");
            window._gh_set_data(`${obj.page_num}_latest`, {
              href: href,
              page_num: obj.page_num
            })
          }
          let list = [];
          for (let index = 1; index < nodes.length; index++) {
            const x = nodes[index];
            let obj = {}
            const src = x.querySelector(".glthumb img").getAttribute("src");
            obj["cover"] = src;
            if (obj["cover"].substring(0, 4) != "http") {
              const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
              obj["cover"] = datasrc;
            }
            const title = x.querySelector(".glname .glink").textContent.trim();
            obj["title"] = title;
            const id = x.querySelector(".glname a").href
            obj["id"] = window.btoa(encodeURIComponent(id));
            const subTitle = x.querySelector(".gl1c").textContent
            obj["subTitle"] = subTitle;
            list.push(obj)
          }
          return list
        }
      }
    } else if (obj.menu_id == "sort") {
      let tl;
      if (obj.order == 4) tl = 15;
      if (obj.order == 3) tl = 13;
      if (obj.order == 2) tl = 12;
      if (obj.order == 1) tl = 11;

      const res = await window._gh_fetch(`https://e-hentai.org/toplist.php?tl=${tl}&p=${obj.page_num - 1}`, {
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
      const nodes = doc.querySelectorAll(".gltc tr");

      let list = [];
      for (let index = 1; index < nodes.length; index++) {
        const x = nodes[index];
        let obj = {}
        const src = x.querySelector(".glthumb img").getAttribute("src");
        obj["cover"] = src;
        if (obj["cover"].substring(0, 4) != "http") {
          const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
          obj["cover"] = datasrc;
        }
        const title = x.querySelector(".glname .glink").textContent.trim();
        obj["title"] = title;
        const id = x.querySelector(".glname a").href
        obj["id"] = window.btoa(encodeURIComponent(id));
        const subTitle = x.querySelector(".gl1c").textContent
        obj["subTitle"] = subTitle;
        list.push(obj)
      }

      return list
    } else if (obj.menu_id == "advanced_search") {
      let url = "https://e-hentai.org/?";
      if (obj.language && obj.f_search) obj.f_search = obj.f_search + "+language:chinese"
      if (obj.language && !obj.f_search) obj.f_search = "language:chinese"
      if (obj.f_sh) obj.f_sh = "on"

      let serf = {};
      if (obj.f_search) serf['f_search'] = obj.f_search;
      if (obj.f_cats) serf['f_cats'] = obj.f_cats;
      if (obj.f_srdd) serf['f_srdd'] = obj.f_srdd;
      if (obj.f_sh) serf['f_sh'] = obj.f_sh;
      if (obj.f_spf) serf['f_spf'] = obj.f_spf;
      if (obj.f_spt) serf['f_spt'] = obj.f_spt;
      const params = new URLSearchParams(serf).toString();
      console.log(
        params
      );

      if (obj.page_num == 1) {
        console.log(url + '' + params);
        const res = await window._gh_fetch(url + '' + params, {
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
        if (doc.querySelector("#unext").getAttribute("href")) {
          const href = doc.querySelector("#unext").getAttribute("href");


          await window._gh_set_data(`${obj.page_num}_${window.btoa(params)}`, {
            href: href,
            page_num: obj.page_num
          })
        }
        const nodes = doc.querySelectorAll(".gltc tr");
        let list = [];
        for (let index = 1; index < nodes.length; index++) {
          const x = nodes[index];
          let obj = {}
          const src = x.querySelector(".glthumb img").getAttribute("src");
          obj["cover"] = src;
          if (obj["cover"].substring(0, 4) != "http") {
            const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
            obj["cover"] = datasrc;
          }
          const title = x.querySelector(".glname .glink").textContent.trim();
          obj["title"] = title;
          const id = x.querySelector(".glname a").href
          obj["id"] = window.btoa(encodeURIComponent(id));
          const subTitle = x.querySelector(".gl1c").textContent
          obj["subTitle"] = subTitle;
          list.push(obj)
        }
        return list
      } else {
        const obj22 = await window._gh_get_data(`${obj.page_num - 1}_${window.btoa(params)}`)

        if (obj22) {
          const res = await window._gh_fetch(obj22.href, {
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

          if (doc.querySelector("#unext").getAttribute("href")) {
            const href = doc.querySelector("#unext").getAttribute("href");

           await  window._gh_set_data(`${obj.page_num}_${window.btoa(params)}`, {
              href: href,
              page_num: obj.page_num
            })
          }
          const nodes = doc.querySelectorAll(".gltc tr");
          let list = [];
          for (let index = 1; index < nodes.length; index++) {
            const x = nodes[index];
            let obj = {}
            const src = x.querySelector(".glthumb img").getAttribute("src");
            obj["cover"] = src;
            if (obj["cover"].substring(0, 4) != "http") {
              const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
              obj["cover"] = datasrc;
            }
            const title = x.querySelector(".glname .glink").textContent.trim();
            obj["title"] = title;
            const id = x.querySelector(".glname a").href
            obj["id"] = window.btoa(encodeURIComponent(id));
            const subTitle = x.querySelector(".gl1c").textContent
            obj["subTitle"] = subTitle;
            list.push(obj)
          }
          return list
        }

      }
    } else if (obj.menu_id == "favorite") {

      let list = [];
      const getList = async (url) => {
        const res = await window._gh_fetch(url, {
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
        if (doc.querySelector("#unext").getAttribute("href")) {
          const href = doc.querySelector("#unext").getAttribute("href");
          window._gh_set_data(`${obj.page_num}_favorite`, {
            href: href,
            page_num: obj.page_num
          })
        }
        const nodes = doc.querySelectorAll(".gltc tr");
        for (let index = 1; index < nodes.length; index++) {
          const x = nodes[index];
          let obj = {}
          const src = x.querySelector(".glthumb img").getAttribute("src");
          obj["cover"] = src;
          if (obj["cover"].substring(0, 4) != "http") {
            const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
            obj["cover"] = datasrc;
          }
          const title = x.querySelector(".glname .glink").textContent.trim();
          obj["title"] = title;
          const id = x.querySelector(".glname a").href
          obj["id"] = window.btoa(encodeURIComponent(id));
          const subTitle = x.querySelector(".gl1c").textContent
          obj["subTitle"] = subTitle;
          list.push(obj)
        }
      }
      if (obj.page_num == 1) {
        await getList("https://e-hentai.org/favorites.php")
      } else {
        const obj22 = await window._gh_get_data(`${obj.page_num - 1}_favorite`)
        if (obj22) {
          await getList(obj22.href)
        }
      }


      return list

    }
    return []
  },
  getDetail: async (id) => {
    const b64_to_utf8 = (str) => {
      return decodeURIComponent(window.atob(str));
    }
    const res = await window._gh_fetch(b64_to_utf8(id), {
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
      href: b64_to_utf8(id),
      author: "",
      intro: "",
      chapters: [

      ],
      chapter_id: id
    }
    const utf8_to_b64 = (str) => {
      return window.btoa(encodeURIComponent(str));
    }
    obj.title = doc.querySelector("#gn").textContent.trim()
    obj.cover = doc.querySelector("#gd1 > div").style.background.split('"')[1];
    obj.chapters.push({
      id: obj.id,
      title: obj.title,
      cover: obj.cover,
    })

    const nodes = doc.querySelectorAll("#taglist tr");
    let list = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const nodes2 = node.querySelectorAll("a");
      const category = node.querySelector(".tc").textContent
      for (let j = 0; j < nodes2.length; j++) {
        const c = nodes2[j];
        list.push({
          category,
          name: c.textContent,
          href: c.href
        })
      }

    }
    obj.tags=list;
    obj.styles=list;
    obj.author=obj.styles.filter(x=>x.category=="artist:")
    obj.styles=obj.styles.filter(x=>x.category!="artist:")

    return obj
  },
  getPages: async (id) => {
    const b64_to_utf8 = (str) => {
      return decodeURIComponent(window.atob(str));
    }
    const res = await window._gh_fetch(b64_to_utf8(id), {
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
    let nodes = doc.querySelectorAll(".ptt a");
    let arr;
    if (nodes.length == 1) {
      arr = [nodes[nodes.length - 1].href, 0];
    } else {
      arr = nodes[nodes.length - 2].href.split("/?p=");
    }
    let length = parseInt(arr[1])
    let data1 = [];
    data1.push(arr[0])
    for (let index = 0; index < length; index++) {
      data1.push(`${arr[0]}/?p=${index + 1}`)
    }
    let arr2 = [];
    for (let i = 0; i < data1.length; i += 6) {
      const batch = data1.slice(i, i + 6);
      const pagesPromises = batch.map(x =>
         window._gh_fetch(x, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        })
      );
      const res = await Promise.all(pagesPromises);
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        const text = await element.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');
        const nodes = doc.querySelectorAll("#gdt a")

        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          arr2.push(element.href)
        }
      }
    }

    let data = [];
    for (let index = 0; index < arr2.length; index++) {
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
      obj["src"] = `${utf8_to_b64(arr2[index])}`
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
      const b64_to_utf8 = (str) => {
        return decodeURIComponent(window.atob(str));
      }
      const _id = b64_to_utf8(id);
      const getHtmlUrl = async (url) => {
        const res = await window._gh_fetch(url, {
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
        return doc.querySelector("#img").src
      }
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


      const url = await getHtmlUrl(_id)

      const blob = await getImageUrl(url);
      return blob
    }
  },
  UrlToList: async (id) => {
     try {
      const obj = new URL(id);
      if (obj.host == "e-hentai.org") {
        const res = await window._gh_fetch(id, {
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
        console.log(doc);

        const nodes = doc.querySelectorAll(".gltc tr");
        let list = [];
        for (let index = 1; index < nodes.length; index++) {
          const x = nodes[index];
          let obj = {}
          const src = x.querySelector(".glthumb img").getAttribute("src");
          obj["cover"] = src;
          if (obj["cover"].substring(0, 4) != "http") {
            const datasrc = x.querySelector(".glthumb img").getAttribute("data-src");
            obj["cover"] = datasrc;
          }
          const title = x.querySelector(".glname .glink").textContent.trim();
          obj["title"] = title;
          const id = x.querySelector(".glname a").href
          obj["id"] = window.btoa(encodeURIComponent(id));
          const subTitle = x.querySelector(".gl1c").textContent
          obj["subTitle"] = subTitle;
          list.push(obj)
        }
        return list
      }else{
        return []
      }

     } catch (error) {
      console.log(error);

      return []
     }
  },
  UrlToDetailId: async (id) => {
    if (id.substring(0,22)=="https://e-hentai.org/g") {
      return window.btoa(encodeURIComponent(id))
    } else {
      return null
    }
  }
});
