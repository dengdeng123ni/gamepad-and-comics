function loadCSSFromString(cssString) {
  // 创建 <style> 元素
  const style = document.createElement('style');
  style.type = 'text/css';

  // 检查浏览器支持性并插入 CSS 字符串
  if (style.styleSheet) {
    // 针对 IE 浏览器
    style.styleSheet.cssText = cssString;
  } else {
    // 针对现代浏览器
    style.appendChild(document.createTextNode(cssString));
  }

  // 将 <style> 元素添加到 <head> 中
  document.head.appendChild(style);
}

// 使用示例
const cssString =
  `
body[source=ehentai] app-comics-list-v2 [region=comics_item]{
    aspect-ratio: 162 / 262 !important
}
body[source=ehentai] app-comics-list-v2 .choice{
margin: 12px 18px 0 !important
}

@media screen and (min-width: 0px) and (max-width: 720px) {
body[source=ehentai] app-comics-list-v2 .choice{
margin: 12px 16px 0 !important
}
}
`;

loadCSSFromString(cssString);
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
            "id": "f_tag",
            "label": "标签",
            "type": "tag_multiple",
            "options": [
              {
                "title": "语言:",
                "tags": [
                  {
                    "name": "korean",
                    "id": "language:korean"
                  },
                  {
                    "name": "已翻译",
                    "id": "language:translated"
                  },
                  {
                    "name": "中文",
                    "id": "language:chinese"
                  },
                  {
                    "name": "重写",
                    "id": "language:rewrite"
                  },
                  {
                    "name": "泰国",
                    "id": "language:thai"
                  },
                  {
                    "name": "英语",
                    "id": "language:english"
                  },
                  {
                    "name": "西班牙语",
                    "id": "language:spanish"
                  }
                ]
              },
              {
                "title": "女:",
                "tags": [
                  {
                    "name": "领子",
                    "id": "female:collar"
                  },
                  {
                    "name": "皮带",
                    "id": "female:leash"
                  },
                  {
                    "name": "丝袜",
                    "id": "female:stockings"
                  },
                  {
                    "name": "ahegao",
                    "id": "female:ahegao"
                  },
                  {
                    "name": "巨乳",
                    "id": "female:\"big breasts$\""
                  },
                  {
                    "name": "口交",
                    "id": "female:blowjob"
                  },
                  {
                    "name": "舔阴",
                    "id": "female:cunnilingus"
                  },
                  {
                    "name": "亲吻",
                    "id": "female:kissing"
                  },
                  {
                    "name": "nakadashi",
                    "id": "female:nakadashi"
                  },
                  {
                    "name": "paizuri",
                    "id": "female:paizuri"
                  },
                  {
                    "name": "喷水",
                    "id": "female:squirting"
                  },
                  {
                    "name": "mesuiki",
                    "id": "female:mesuiki"
                  },
                  {
                    "name": "乳头刺激",
                    "id": "female:\"nipple stimulation$\""
                  },
                  {
                    "name": "马尾辫",
                    "id": "female:ponytail"
                  },
                  {
                    "name": "唯一女性",
                    "id": "female:\"sole female$\""
                  },
                  {
                    "name": "sumata",
                    "id": "female:sumata"
                  },
                  {
                    "name": "x-ray",
                    "id": "female:x-ray"
                  },
                  {
                    "name": "摘花",
                    "id": "female:defloration"
                  },
                  {
                    "name": "浸渍",
                    "id": "female:impregnation"
                  },
                  {
                    "name": "强奸",
                    "id": "female:rape"
                  },
                  {
                    "name": "女学生制服",
                    "id": "female:\"schoolgirl uniform$\""
                  },
                  {
                    "name": "露阴癖",
                    "id": "female:exhibitionism"
                  },
                  {
                    "name": "毛茸茸的",
                    "id": "female:hairy"
                  },
                  {
                    "name": "羞辱",
                    "id": "female:humiliation"
                  },
                  {
                    "name": "公共用途",
                    "id": "female:\"public use$\""
                  },
                  {
                    "name": "睡觉",
                    "id": "female:sleeping"
                  },
                  {
                    "name": "连裤袜",
                    "id": "female:pantyhose"
                  },
                  {
                    "name": "bbw",
                    "id": "female:bbw"
                  },
                  {
                    "name": "大屁股",
                    "id": "female:\"big ass$\""
                  },
                  {
                    "name": "精灵",
                    "id": "female:elf"
                  },
                  {
                    "name": "fishnets",
                    "id": "female:fishnets"
                  },
                  {
                    "name": "不寻常的牙齿",
                    "id": "female:\"unusual teeth$\""
                  },
                  {
                    "name": "醉酒",
                    "id": "female:drunk"
                  },
                  {
                    "name": "女性统治",
                    "id": "female:femdom"
                  },
                  {
                    "name": "指法",
                    "id": "female:fingering"
                  },
                  {
                    "name": "手淫",
                    "id": "female:masturbation"
                  },
                  {
                    "name": "大乳晕",
                    "id": "female:\"big areolae$\""
                  },
                  {
                    "name": "扶他那里",
                    "id": "female:futanari"
                  },
                  {
                    "name": "比基尼",
                    "id": "female:bikini"
                  },
                  {
                    "name": "后宫",
                    "id": "female:harem"
                  },
                  {
                    "name": "kemonomimi",
                    "id": "female:kemonomimi"
                  },
                  {
                    "name": "泳衣",
                    "id": "female:swimsuit"
                  },
                  {
                    "name": "尾巴",
                    "id": "female:tail"
                  },
                  {
                    "name": "美人痣",
                    "id": "female:\"beauty mark$\""
                  },
                  {
                    "name": "口交脸",
                    "id": "female:\"blowjob face$\""
                  },
                  {
                    "name": "bukkake",
                    "id": "female:bukkake"
                  },
                  {
                    "name": "双重渗透",
                    "id": "female:\"double penetration$\""
                  },
                  {
                    "name": "无情的性爱",
                    "id": "female:\"emotionless sex$\""
                  },
                  {
                    "name": "拍摄",
                    "id": "female:filming"
                  },
                  {
                    "name": "勒索",
                    "id": "female:blackmail"
                  },
                  {
                    "name": "netorare",
                    "id": "female:netorare"
                  },
                  {
                    "name": "正文",
                    "id": "female:\"body writing$\""
                  },
                  {
                    "name": "兔女郎",
                    "id": "female:\"bunny girl$\""
                  },
                  {
                    "name": "手套",
                    "id": "female:gloves"
                  },
                  {
                    "name": "gyaru",
                    "id": "female:gyaru"
                  },
                  {
                    "name": "哺乳",
                    "id": "female:lactation"
                  },
                  {
                    "name": "内衣",
                    "id": "female:lingerie"
                  },
                  {
                    "name": "shimaidon",
                    "id": "female:shimaidon"
                  },
                  {
                    "name": "不寻常的学生",
                    "id": "female:\"unusual pupils$\""
                  },
                  {
                    "name": "性玩具",
                    "id": "female:\"sex toys$\""
                  },
                  {
                    "name": "Yuri",
                    "id": "female:yuri"
                  },
                  {
                    "name": "遮眼刘海",
                    "id": "female:\"eye-covering bang$\""
                  },
                  {
                    "name": "巨乳",
                    "id": "female:\"huge breasts$\""
                  },
                  {
                    "name": "milf",
                    "id": "female:milf"
                  },
                  {
                    "name": "大乳头",
                    "id": "female:\"big nipples$\""
                  },
                  {
                    "name": "作弊",
                    "id": "female:cheating"
                  },
                  {
                    "name": "女牛仔",
                    "id": "female:cowgirl"
                  },
                  {
                    "name": "彩绘指甲",
                    "id": "female:\"painted nails$\""
                  },
                  {
                    "name": "发髻",
                    "id": "female:\"hair buns$\""
                  },
                  {
                    "name": "乳头内陷",
                    "id": "female:\"inverted nipples$\""
                  },
                  {
                    "name": "小乳房",
                    "id": "female:\"small breasts$\""
                  },
                  {
                    "name": "petplay",
                    "id": "female:petplay"
                  }
                ]
              },
              {
                "title": "其他:",
                "tags": [
                  {
                    "name": "马赛克审查",
                    "id": "other:\"mosaic censorship$\""
                  },
                  {
                    "name": "全彩",
                    "id": "other:\"full color$\""
                  },
                  {
                    "name": "未经审查",
                    "id": "other:uncensored"
                  },
                  {
                    "name": "多作品系列",
                    "id": "other:\"multi-work series$\""
                  },
                  {
                    "name": "故事情节",
                    "id": "other:\"story arc$\""
                  },
                  {
                    "name": "soushuuhen",
                    "id": "other:soushuuhen"
                  },
                  {
                    "name": "粗略翻译",
                    "id": "other:\"rough translation$\""
                  },
                  {
                    "name": "汇编",
                    "id": "other:compilation"
                  }
                ]
              },
              {
                "title": "男:",
                "tags": [
                  {
                    "name": "bbm",
                    "id": "male:bbm"
                  },
                  {
                    "name": "眼镜",
                    "id": "male:glasses"
                  },
                  {
                    "name": "肛门",
                    "id": "male:anal"
                  },
                  {
                    "name": "熊孩子",
                    "id": "male:\"bear boy$\""
                  },
                  {
                    "name": "大阴茎",
                    "id": "male:\"big penis$\""
                  },
                  {
                    "name": "catboy",
                    "id": "male:catboy"
                  },
                  {
                    "name": "狗男孩",
                    "id": "male:\"dog boy$\""
                  },
                  {
                    "name": "毛茸茸",
                    "id": "male:furry"
                  },
                  {
                    "name": "巨大的阴茎",
                    "id": "male:\"huge penis$\""
                  },
                  {
                    "name": "仅限男性",
                    "id": "male:\"males only$\""
                  },
                  {
                    "name": "多次性高潮",
                    "id": "male:\"multiple orgasms$\""
                  },
                  {
                    "name": "肌肉",
                    "id": "male:muscle"
                  },
                  {
                    "name": "狼孩",
                    "id": "male:\"wolf boy$\""
                  },
                  {
                    "name": "yaoi",
                    "id": "male:yaoi"
                  },
                  {
                    "name": "肛交",
                    "id": "male:\"anal intercourse$\""
                  },
                  {
                    "name": "避孕套",
                    "id": "male:condom"
                  },
                  {
                    "name": "唯一男性",
                    "id": "male:\"sole male$\""
                  },
                  {
                    "name": "dilf",
                    "id": "male:dilf"
                  },
                  {
                    "name": "cowman",
                    "id": "male:cowman"
                  },
                  {
                    "name": "角",
                    "id": "male:horns"
                  },
                  {
                    "name": "穿孔",
                    "id": "male:piercing"
                  },
                  {
                    "name": "深色皮肤",
                    "id": "male:\"dark skin$\""
                  },
                  {
                    "name": "束缚",
                    "id": "male:bondage"
                  },
                  {
                    "name": "onahole",
                    "id": "male:onahole"
                  },
                  {
                    "name": "摩擦法",
                    "id": "male:frottage"
                  },

                  {
                    "name": "tomgirl",
                    "id": "male:tomgirl"
                  },
                  {
                    "name": "校服",
                    "id": "male:\"schoolboy uniform$\""
                  },
                  {
                    "name": "双性恋",
                    "id": "male:bisexual"
                  },
                  {
                    "name": "crossdressing",
                    "id": "male:crossdressing"
                  },
                  {
                    "name": "嗯三人行",
                    "id": "male:\"mmm threesome$\""
                  },

                  {
                    "name": "出汗",
                    "id": "male:sweating"
                  },
                  {
                    "name": "卖淫",
                    "id": "male:prostitution"
                  },
                  {
                    "name": "大球",
                    "id": "male:\"big balls$\""
                  },
                  {
                    "name": "大肌肉",
                    "id": "male:\"big muscles$\""
                  },
                  {
                    "name": "疤痕",
                    "id": "male:scar"
                  },
                  {
                    "name": "精神控制",
                    "id": "male:\"mind control$\""
                  },
                  {
                    "name": "贞操带",
                    "id": "male:\"chastity belt$\""
                  }
                ]
              },
              {
                "title": "混合:",
                "tags": [
                  {
                    "name": "乱伦",
                    "id": "mixed:incest"
                  },
                  {
                    "name": "inseki",
                    "id": "mixed:inseki"
                  },
                  {
                    "name": "ffm 三人行",
                    "id": "mixed:\"ffm threesome$\""
                  },
                  {
                    "name": "组",
                    "id": "mixed:group"
                  },
                  {
                    "name": "mmf 三人行",
                    "id": "mixed:\"mmf threesome$\""
                  }
                ]
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
            min: 1,
            max: 300
          },
          {
            "id": "f_spt",
            "label": "最大页数",
            "type": "slider",
            min: 1,
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
    const getList = async (url, callbacks) => {
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
      if (callbacks) callbacks(doc)
      const nodes = doc.querySelectorAll(".gltc tr");

      let list = [];
      for (let index = 1; index < nodes.length; index++) {
        const x = nodes[index];
        let obj = {}
        const src = x.querySelector(".glthumb img")?.getAttribute("src");
        obj["cover"] = src;
        if (obj["cover"]?.substring(0, 4) != "http") {
          const datasrc = x.querySelector(".glthumb img")?.getAttribute("data-src");
          obj["cover"] = datasrc;
        }
        const title = x.querySelector(".glname .glink")?.textContent?.trim();
        obj["title"] = title;
        const id = x.querySelector(".glname a")?.href
        obj["href"] = id;
        obj["id"] = window.btoa(encodeURIComponent(id));
        const subTitle = x.querySelector(".gl1c")?.textContent
        obj["subTitle"] = subTitle;
        if (obj.cover) list.push(obj)
      }
      return list
    }
    if (obj.menu_id == "popular") {
      if (obj.page_num == 1) {
        const list = await getList("https://e-hentai.org/popular")
        return list
      } else {
        return []
      }

    } else if (obj.menu_id == "latest") {
      if (obj.page_num == 1) {
        const list = await getList("https://e-hentai.org/", doc => {
          if (doc?.querySelector("#unext")?.getAttribute("href")) {
            const href = doc?.querySelector("#unext")?.getAttribute("href");
            window._gh_set_data(`${obj.page_num}_latest`, {
              href: href,
              page_num: obj.page_num
            })
          }
        })
        return list
      } else {

        const obj22 = await window._gh_get_data(`${obj.page_num - 1}_latest`)
        if (obj22) {
          const list = await getList(obj22.href, doc => {
            if (doc?.querySelector("#unext")?.getAttribute("href")) {
              const href = doc?.querySelector("#unext")?.getAttribute("href");
              window._gh_set_data(`${obj.page_num}_latest`, {
                href: href,
                page_num: obj.page_num
              })
            }
          })
          return list
        }
      }
    } else if (obj.menu_id == "sort") {
      let tl;
      if (obj.order == 4) tl = 15;
      if (obj.order == 3) tl = 13;
      if (obj.order == 2) tl = 12;
      if (obj.order == 1) tl = 11;
      const list = await getList(`https://e-hentai.org/toplist.php?tl=${tl}&p=${obj.page_num - 1}`)
      return list
    } else if (obj.menu_id == "advanced_search") {
      let url = "https://e-hentai.org/?";
      if (obj.language && obj.f_search) obj.f_search = obj.f_search + " language:chinese"
      if (obj.language && !obj.f_search) obj.f_search = "language:chinese"
      if (obj.f_sh) obj.f_sh = "on"
      let serf = {};
      if (obj.f_tag && obj.f_tag.length) {
        if (!obj.f_search) obj.f_search = '';

        obj.f_tag.forEach(x => {
          obj.f_search = obj.f_search + ' ' + x.id

        })
      }

      if (obj.f_search) serf['f_search'] = obj.f_search;

      if (obj.f_cats) serf['f_cats'] = obj.f_cats;
      if (obj.f_srdd) serf['f_srdd'] = obj.f_srdd;
      if (obj.f_sh) serf['f_sh'] = obj.f_sh;
      if (obj.f_spf) serf['f_spf'] = obj.f_spf;
      if (obj.f_spt) serf['f_spt'] = obj.f_spt;
      const params = new URLSearchParams(serf).toString();

      if (obj.page_num == 1) {
        const list = await getList(url + '' + params, async doc => {
          if (doc?.querySelector("#unext")?.getAttribute("href")) {
            const href = doc?.querySelector("#unext")?.getAttribute("href");

            await window._gh_set_data(`${obj.page_num}_${window.btoa(params)}`, {
              href: href,
              page_num: obj.page_num
            })
          }
        })
        return list
      } else {
        const obj22 = await window._gh_get_data(`${obj.page_num - 1}_${window.btoa(params)}`)
        if (obj22) {
          const list = await getList(obj22.href, async doc => {
            if (doc?.querySelector("#unext")?.getAttribute("href")) {
              const href = doc?.querySelector("#unext")?.getAttribute("href");

              await window._gh_set_data(`${obj.page_num}_${window.btoa(params)}`, {
                href: href,
                page_num: obj.page_num
              })
            }
          })

          return list
        }

      }
    } else if (obj.menu_id == "favorite") {

      if (obj.page_num == 1) {
        const list = await getList("https://e-hentai.org/favorites.php", async doc => {
          if (doc?.querySelector("#unext")?.getAttribute("href")) {
            const href = doc?.querySelector("#unext")?.getAttribute("href");
            window._gh_set_data(`${obj.page_num}_favorite`, {
              href: href,
              page_num: obj.page_num
            })
          }
        })
        return list
      } else {
        const obj22 = await window._gh_get_data(`${obj.page_num - 1}_favorite`)
        if (obj22) {
          const list = await getList(obj22.href, async doc => {
            if (doc?.querySelector("#unext")?.getAttribute("href")) {
              const href = doc?.querySelector("#unext")?.getAttribute("href");
              window._gh_set_data(`${obj.page_num}_favorite`, {
                href: href,
                page_num: obj.page_num
              })
            }
          })
          return list
        }
      }



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
    obj.title = doc.querySelector("#gn")?.textContent?.trim()
    obj.cover = doc.querySelector("#gd1 > div")?.style?.background?.split('"')[1];
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
      const category = node.querySelector(".tc")?.textContent
      for (let j = 0; j < nodes2.length; j++) {
        const c = nodes2[j];
        let f_search = c.href.split("/").at(-1)
        const arr = f_search.split("+")
        if (arr.length > 1) {
          const arr2 = f_search.split(":")
          f_search = `${arr2[0]}:"${arr2[1].split("+").join(" ")}$"`
        }
        list.push({
          category,
          name: c.textContent,
          href: c.href,
          router: ['advanced_search', { f_search: f_search }]
        })
      }

    }
    obj.tags = list;
    obj.styles = list;
    obj.author = obj.styles.filter(x => x.category == "artist:")
    obj.styles = obj.styles.filter(x => x.category != "artist:")

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

    } catch (error) {
      console.log(error);

      return []
    }
  },
  UrlToDetailId: async (id) => {
    if (id.substring(0, 22) == "https://e-hentai.org/g") {
      return window.btoa(encodeURIComponent(id))
    } else {
      return null
    }
  }
});
