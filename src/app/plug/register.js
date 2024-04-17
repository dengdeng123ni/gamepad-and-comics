
window._gh_register({
  name: "bilibili",
  tab: {
    url: "https://manga.bilibili.com/",
    host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
  },
  is_edit: false,
  is_locked: true,
  is_cache: true,
  is_offprint: false,
  is_tab: true
}, {
  List: async (obj) => {
    let list = [];
    if (obj.query_type == "type") {
      const res = await
        window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ClassPage?device=pc&platform=web", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": JSON.stringify(obj),
          "method": "POST"
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
    } else if (obj.query_type == "favorites") {
      const res = await
        window._gh_fetch("https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite?device=pc&platform=web", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": `{\"page_num\":${obj.page_num},\"page_size\":${obj.page_size},\"order\":${obj.order},\"wait_free\":${obj.wait_free}}`,
          "method": "POST"
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

    } else if (obj.query_type == "ranking") {
      const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetRankInfo?device=pc&platform=web", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8"
        },
        "body": `{\"id\":${obj.id}}`,
        "method": "POST"
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
      href:`https://manga.bilibili.com/detail/mc${x.id}`,
      cover: httpUrlToHttps(x.vertical_cover),
      title: x.title,
      author: x.author_name.toString(),
      intro: x.classic_lines,
      styles: x.styles2.map(x=>(
        {
          ...x,
          href:`https://manga.bilibili.com/classify?from=manga_detail&styles=${x.id}&areas=-1&status=-1&prices=-1&orders=0`
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
    if (id.substring(0,4)=="http") {
      const res = await window._gh_get(id)
      const blob = await res.blob();
      return blob
    }else{
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
          });
          const json = await res.json();
          return `${json.data[0].url}?token=${json.data[0].token}`
        } catch (error) {
          return await getImageUrl(id)
        }
      }
      const url = await getImageUrl(id);
      const res = await window._gh_get(url);
      const blob = await res.blob();
      return blob
    }
  }
});
window._gh_register({
  name: "hanime1",
  tab: {
    url: "https://hanime1.me/comic/",
    host_names: ["hanime1.me"],
  },
  is_edit: false,
  is_locked: false,
  is_cache: true,
  is_offprint: true,
  is_tab: true
}, {
  List: async (obj) => {
    let list = [];
    return list
  },
  Detail: async (id) => {
    const res = await window._gh_fetch_html(`https://hanime1.me/comic/${id}`, {
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
    const res = await window._gh_fetch_html(`https://hanime1.me/comic/${id}`, {
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
      const res = await window._gh_fetch_background(id, {
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
