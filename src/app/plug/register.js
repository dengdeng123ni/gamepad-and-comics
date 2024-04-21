
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
