// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndexdbControllerService, MessageFetchService } from '../public-api';
import { Subject } from 'rxjs';
interface Events {
  Unlock?: Function;
  getList?: Function;
  getDetail: Function;
  getPages: Function;
  getImage?: Function;
  Search?: Function;
  getReplies?: Function;
  UrlToList?: Function;
  UrlToDetailId?: Function;
}
interface Config {
  id: string,
  type?: string,
  name?: string,
  menu?: Array<any>;
  href?: string,
  is_visible?: boolean,
  is_locked?: boolean;
  is_download?: boolean;
  is_cache?: boolean;
  is_preloading?: boolean;
  images_concurrency_limit?: number
}
interface Tab {
  url: string,
  host_names: Array<string>,
}

@Injectable({
  providedIn: 'root'
})
export class DbComicsEventService {
  public Events: { [key: string]: Events } = {};


  public Configs: { [key: string]: Config } = {};

  public add() {
    return this.add$
  }
  add$ = new Subject();

  private _data = {
    original: {}
  };
  constructor(
    public http: HttpClient,
    private webDb: IndexdbControllerService,
    public _http: MessageFetchService,
  ) {
    window._gh_comics_register = this.comics_register;
    window._gh_novels_register = this.novels_register;
    window._gh_set_data = this.set_data;
    window._gh_get_data = this.get_data;
    window._gh_source_get_all_name = () => {
      return Object.keys(this.Configs).map(x => x)
    }
    window._gh_source_get_config = (x) => {
      return this.Configs[x]
    }
    window._gh_source_get_event = (x) => {
      return this.Events[x]
    }
    if (window.location.port == "4200") {
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
      setTimeout(() => {
        window._gh_context_menu_register('comics_item', [
          {
            name: "打开网站对应链接",
            source: "ehentai",
            click: (e) => {
              const b64_to_utf8 = (str) => {
                return decodeURIComponent(window.atob(str));
              }
              const url = b64_to_utf8(e[0].id)
              window.open(url)
            }
          }
        ])
      }, 0)


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
                  "type": "search"
                },
                {
                  "id": "f_cats",
                  "name": "类别",
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
                  "name": "标签",
                  "type": "tag_multiple",
                  "options": [
                    {
                      "title": "语言:",
                      "tags": [
                        {
                          "label": "korean",
                          "value": "language:korean"
                        },
                        {
                          "label": "已翻译",
                          "value": "language:translated"
                        },
                        {
                          "label": "中文",
                          "value": "language:chinese"
                        },
                        {
                          "label": "重写",
                          "value": "language:rewrite"
                        },
                        {
                          "label": "泰国",
                          "value": "language:thai"
                        },
                        {
                          "label": "英语",
                          "value": "language:english"
                        },
                        {
                          "label": "西班牙语",
                          "value": "language:spanish"
                        }
                      ]
                    },
                    {
                      "title": "女:",
                      "tags": [
                        {
                          "label": "领子",
                          "value": "female:collar"
                        },
                        {
                          "label": "皮带",
                          "value": "female:leash"
                        },
                        {
                          "label": "丝袜",
                          "value": "female:stockings"
                        },
                        {
                          "label": "ahegao",
                          "value": "female:ahegao"
                        },
                        {
                          "label": "巨乳",
                          "value": "female:\"big breasts$\""
                        },
                        {
                          "label": "口交",
                          "value": "female:blowjob"
                        },
                        {
                          "label": "舔阴",
                          "value": "female:cunnilingus"
                        },
                        {
                          "label": "亲吻",
                          "value": "female:kissing"
                        },
                        {
                          "label": "nakadashi",
                          "value": "female:nakadashi"
                        },
                        {
                          "label": "paizuri",
                          "value": "female:paizuri"
                        },
                        {
                          "label": "喷水",
                          "value": "female:squirting"
                        },
                        {
                          "label": "mesuiki",
                          "value": "female:mesuiki"
                        },
                        {
                          "label": "乳头刺激",
                          "value": "female:\"nipple stimulation$\""
                        },
                        {
                          "label": "马尾辫",
                          "value": "female:ponytail"
                        },
                        {
                          "label": "唯一女性",
                          "value": "female:\"sole female$\""
                        },
                        {
                          "label": "sumata",
                          "value": "female:sumata"
                        },
                        {
                          "label": "x-ray",
                          "value": "female:x-ray"
                        },
                        {
                          "label": "摘花",
                          "value": "female:defloration"
                        },
                        {
                          "label": "浸渍",
                          "value": "female:impregnation"
                        },
                        {
                          "label": "强奸",
                          "value": "female:rape"
                        },
                        {
                          "label": "女学生制服",
                          "value": "female:\"schoolgirl uniform$\""
                        },
                        {
                          "label": "露阴癖",
                          "value": "female:exhibitionism"
                        },
                        {
                          "label": "毛茸茸的",
                          "value": "female:hairy"
                        },
                        {
                          "label": "羞辱",
                          "value": "female:humiliation"
                        },
                        {
                          "label": "公共用途",
                          "value": "female:\"public use$\""
                        },
                        {
                          "label": "睡觉",
                          "value": "female:sleeping"
                        },
                        {
                          "label": "连裤袜",
                          "value": "female:pantyhose"
                        },
                        {
                          "label": "bbw",
                          "value": "female:bbw"
                        },
                        {
                          "label": "大屁股",
                          "value": "female:\"big ass$\""
                        },
                        {
                          "label": "精灵",
                          "value": "female:elf"
                        },
                        {
                          "label": "fishnets",
                          "value": "female:fishnets"
                        },
                        {
                          "label": "不寻常的牙齿",
                          "value": "female:\"unusual teeth$\""
                        },
                        {
                          "label": "醉酒",
                          "value": "female:drunk"
                        },
                        {
                          "label": "女性统治",
                          "value": "female:femdom"
                        },
                        {
                          "label": "指法",
                          "value": "female:fingering"
                        },
                        {
                          "label": "手淫",
                          "value": "female:masturbation"
                        },
                        {
                          "label": "大乳晕",
                          "value": "female:\"big areolae$\""
                        },
                        {
                          "label": "扶他那里",
                          "value": "female:futanari"
                        },
                        {
                          "label": "比基尼",
                          "value": "female:bikini"
                        },
                        {
                          "label": "后宫",
                          "value": "female:harem"
                        },
                        {
                          "label": "kemonomimi",
                          "value": "female:kemonomimi"
                        },
                        {
                          "label": "泳衣",
                          "value": "female:swimsuit"
                        },
                        {
                          "label": "尾巴",
                          "value": "female:tail"
                        },
                        {
                          "label": "美人痣",
                          "value": "female:\"beauty mark$\""
                        },
                        {
                          "label": "口交脸",
                          "value": "female:\"blowjob face$\""
                        },
                        {
                          "label": "bukkake",
                          "value": "female:bukkake"
                        },
                        {
                          "label": "双重渗透",
                          "value": "female:\"double penetration$\""
                        },
                        {
                          "label": "无情的性爱",
                          "value": "female:\"emotionless sex$\""
                        },
                        {
                          "label": "拍摄",
                          "value": "female:filming"
                        },
                        {
                          "label": "勒索",
                          "value": "female:blackmail"
                        },
                        {
                          "label": "netorare",
                          "value": "female:netorare"
                        },
                        {
                          "label": "正文",
                          "value": "female:\"body writing$\""
                        },
                        {
                          "label": "兔女郎",
                          "value": "female:\"bunny girl$\""
                        },
                        {
                          "label": "手套",
                          "value": "female:gloves"
                        },
                        {
                          "label": "gyaru",
                          "value": "female:gyaru"
                        },
                        {
                          "label": "哺乳",
                          "value": "female:lactation"
                        },
                        {
                          "label": "内衣",
                          "value": "female:lingerie"
                        },
                        {
                          "label": "shimaidon",
                          "value": "female:shimaidon"
                        },
                        {
                          "label": "不寻常的学生",
                          "value": "female:\"unusual pupils$\""
                        },
                        {
                          "label": "性玩具",
                          "value": "female:\"sex toys$\""
                        },
                        {
                          "label": "Yuri",
                          "value": "female:yuri"
                        },
                        {
                          "label": "遮眼刘海",
                          "value": "female:\"eye-covering bang$\""
                        },
                        {
                          "label": "巨乳",
                          "value": "female:\"huge breasts$\""
                        },
                        {
                          "label": "milf",
                          "value": "female:milf"
                        },
                        {
                          "label": "大乳头",
                          "value": "female:\"big nipples$\""
                        },
                        {
                          "label": "作弊",
                          "value": "female:cheating"
                        },
                        {
                          "label": "女牛仔",
                          "value": "female:cowgirl"
                        },
                        {
                          "label": "彩绘指甲",
                          "value": "female:\"painted nails$\""
                        },
                        {
                          "label": "发髻",
                          "value": "female:\"hair buns$\""
                        },
                        {
                          "label": "乳头内陷",
                          "value": "female:\"inverted nipples$\""
                        },
                        {
                          "label": "小乳房",
                          "value": "female:\"small breasts$\""
                        },
                        {
                          "label": "petplay",
                          "value": "female:petplay"
                        }
                      ]
                    },
                    {
                      "title": "其他:",
                      "tags": [
                        {
                          "label": "马赛克审查",
                          "value": "other:\"mosaic censorship$\""
                        },
                        {
                          "label": "全彩",
                          "value": "other:\"full color$\""
                        },
                        {
                          "label": "未经审查",
                          "value": "other:uncensored"
                        },
                        {
                          "label": "多作品系列",
                          "value": "other:\"multi-work series$\""
                        },
                        {
                          "label": "故事情节",
                          "value": "other:\"story arc$\""
                        },
                        {
                          "label": "soushuuhen",
                          "value": "other:soushuuhen"
                        },
                        {
                          "label": "粗略翻译",
                          "value": "other:\"rough translation$\""
                        },
                        {
                          "label": "汇编",
                          "value": "other:compilation"
                        }
                      ]
                    },
                    {
                      "title": "男:",
                      "tags": [
                        {
                          "label": "bbm",
                          "value": "male:bbm"
                        },
                        {
                          "label": "眼镜",
                          "value": "male:glasses"
                        },
                        {
                          "label": "肛门",
                          "value": "male:anal"
                        },
                        {
                          "label": "熊孩子",
                          "value": "male:\"bear boy$\""
                        },
                        {
                          "label": "大阴茎",
                          "value": "male:\"big penis$\""
                        },
                        {
                          "label": "catboy",
                          "value": "male:catboy"
                        },
                        {
                          "label": "狗男孩",
                          "value": "male:\"dog boy$\""
                        },
                        {
                          "label": "毛茸茸",
                          "value": "male:furry"
                        },
                        {
                          "label": "巨大的阴茎",
                          "value": "male:\"huge penis$\""
                        },
                        {
                          "label": "仅限男性",
                          "value": "male:\"males only$\""
                        },
                        {
                          "label": "多次性高潮",
                          "value": "male:\"multiple orgasms$\""
                        },
                        {
                          "label": "肌肉",
                          "value": "male:muscle"
                        },
                        {
                          "label": "狼孩",
                          "value": "male:\"wolf boy$\""
                        },
                        {
                          "label": "yaoi",
                          "value": "male:yaoi"
                        },
                        {
                          "label": "肛交",
                          "value": "male:\"anal intercourse$\""
                        },
                        {
                          "label": "避孕套",
                          "value": "male:condom"
                        },
                        {
                          "label": "唯一男性",
                          "value": "male:\"sole male$\""
                        },
                        {
                          "label": "dilf",
                          "value": "male:dilf"
                        },
                        {
                          "label": "cowman",
                          "value": "male:cowman"
                        },
                        {
                          "label": "角",
                          "value": "male:horns"
                        },
                        {
                          "label": "穿孔",
                          "value": "male:piercing"
                        },
                        {
                          "label": "深色皮肤",
                          "value": "male:\"dark skin$\""
                        },
                        {
                          "label": "束缚",
                          "value": "male:bondage"
                        },
                        {
                          "label": "onahole",
                          "value": "male:onahole"
                        },
                        {
                          "label": "摩擦法",
                          "value": "male:frottage"
                        },
                        {
                          "label": "tomgirl",
                          "value": "male:tomgirl"
                        },
                        {
                          "label": "校服",
                          "value": "male:\"schoolboy uniform$\""
                        },
                        {
                          "label": "双性恋",
                          "value": "male:bisexual"
                        },
                        {
                          "label": "crossdressing",
                          "value": "male:crossdressing"
                        },
                        {
                          "label": "嗯三人行",
                          "value": "male:\"mmm threesome$\""
                        },
                        {
                          "label": "出汗",
                          "value": "male:sweating"
                        },
                        {
                          "label": "卖淫",
                          "value": "male:prostitution"
                        },
                        {
                          "label": "大球",
                          "value": "male:\"big balls$\""
                        },
                        {
                          "label": "大肌肉",
                          "value": "male:\"big muscles$\""
                        },
                        {
                          "label": "疤痕",
                          "value": "male:scar"
                        },
                        {
                          "label": "精神控制",
                          "value": "male:\"mind control$\""
                        },
                        {
                          "label": "贞操带",
                          "value": "male:\"chastity belt$\""
                        }
                      ]
                    },
                    {
                      "title": "混合:",
                      "tags": [
                        {
                          "label": "乱伦",
                          "value": "mixed:incest"
                        },
                        {
                          "label": "inseki",
                          "value": "mixed:inseki"
                        },
                        {
                          "label": "ffm 三人行",
                          "value": "mixed:\"ffm threesome$\""
                        },
                        {
                          "label": "组",
                          "value": "mixed:group"
                        },
                        {
                          "label": "mmf 三人行",
                          "value": "mixed:\"mmf threesome$\""
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "f_srdd",
                  "name": "最低评分",
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
                  "name": "语言",
                  "type": "select",
                  "options": [
                    {
                      "label": "中文",
                      "value": "language:chinese"
                    },
                    {
                      "label": "英语",
                      "value": "language:english"
                    },
                    {
                      "label": "韩语",
                      "value": "language:korean"
                    },
                    {
                      "label": "泰国",
                      "value": "language:thai"
                    },
                    {
                      "label": "西班牙语",
                      "value": "language:spanish"
                    },
                    {
                      "label": "已翻译",
                      "value": "language:translated"
                    },
                    {
                      "label": "重写",
                      "value": "language:rewrite"
                    },
                  ]
                },
                {
                  "id": "f_sh",
                  "name": "浏览已删除画廊",
                  "type": "toggle"
                },
                {
                  "id": "f_spf",
                  "name": "最小页数",
                  "type": "slider",
                  min: 1,
                  max: 300
                },
                {
                  "id": "f_spt",
                  "name": "最大页数",
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
                  label: "日"
                },
                {
                  order: 3,
                  label: "月"
                },
                {
                  order: 2,
                  label: "年"
                },
                {
                  order: 1,
                  label: "总"
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
                obj.f_search = obj.f_search + ' ' + x.value

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
              page_size: 20
            },

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
              conditions: [
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
              conditions: [
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
        is_locked: true
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
                "method": "POST",
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
                "method": "POST",
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
              return { id: x.comics_id, cover: httpUrlToHttps(x.vcover), title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` }
            });
          } else if (obj.query_type == "update") {
            const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetDailyPush?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"date\":\"${obj.date}\",\"page_num\":1,\"page_size\":50}`,
              "method": "POST", proxy: "https://manga.bilibili.com/"
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
              return { id: x.comics_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.short_title} 话` }
            });

          } else if (obj.menu_id == "ranking") {
            const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetRankInfo?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"id\":${obj.id}}`,
              "method": "POST",
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
              return { id: x.comics_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.total} 话` }
            });
          } else if (obj.query_type == "home") {
            const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetClassPageSixComics?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"id\":${obj.id},\"isAll\":0,\"page_num\":${obj.page_num},\"page_size\":${obj.page_size}}`,
              "method": "POST",
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
              return { id: x.comics_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `${x.recommendation}` }
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
            "body": `{\"comics_id\":${id}}`,
            "method": "POST",
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
            "method": "POST",
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
                  proxy: "https://manga.bilibili.com/"
                });
                const json = await res.json();

                return `${json.data[0].complete_url}`
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
              mode: "cors",
              proxy: "https://manga.bilibili.com/"
            });
            const blob = await res.blob();
            return blob
          }
        },
        UrlToList: async (id) => {
          //


          return []
        },
        Search: async (obj) => {
          const res = await window._gh_fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/Search?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": JSON.stringify({ key_word: obj.keyword, page_num: obj.page_num, page_size: obj.page_size }),
            "method": "POST",
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
        getReplies: async (obj) => {
          const href = `https://manga.bilibili.com/detail/mc${obj.comics_id}`;
          const arr = await window._gh_execute_eval(href,
            `(async function () {
              const meta = document.createElement('meta');
              meta.httpEquiv = "Content-Security-Policy";
              meta.content = "img-src 'none'";
              document.head.appendChild(meta);
              const nodes = document.querySelectorAll(".reply-item")
              let arr = [];
              for (let index = 0; index < nodes.length; index++) {
                const node = nodes[index];
                let obj = {};
                const name = node.querySelector(".user-name").textContent;
                const message = node.querySelector(".reply-content").textContent;
                const date = node.querySelector(".reply-time").textContent;
                obj["name"] = name;
                obj["message"] = message;
                obj["date"] = date;
                arr.push(obj)
              }
              return arr
            })()
            `
          )
          return arr
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
        href: "https://hanime1.me/comics",
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
        // i18n: {
        //   cn: {

        //   }
        // }
      }, {
        getList: async (obj) => {
          const res = await window._gh_get_html(`https://hanime1.me/comics?page=${obj.page_num}`, {
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

          const res = await window._gh_get_html(`https://hanime1.me/comic/${id}`, {
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
            id: utf8_to_b64(`https://hanime1.me/comic/${obj.id}/1`),
            title: obj.title,
            cover: obj.cover,
          })
          return obj
        },
        getPages: async (id) => {

          const arr = await window._gh_execute_eval(decodeURIComponent(window.atob(id)),
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
        `)
          return arr



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
              const res = await window._gh_get_html(url, {
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
          const res = await window._gh_get_html(`https://hanime1.me/comics/search?query=${obj.keyword}&page=${obj.page_num}`, {
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
        id: "baozimhw",
        href: "https://www.baozimhw.com/",
        is_cache: true,
        is_download: true
      }, {
        getDetail: async (id) => {
          const res = await window._gh_get_html(`https://www.baozimhw.com/manhua/${id}.html`, {
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
            href: `https://www.baozimhw.com/manhua/${id}.html`,
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
          obj.title = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > div.pt-novel > h1 > a").textContent.trim()
          obj.cover = doc.querySelector("body > section.ptm-content.ptm-card.pt-infopage > div.s71.d905 > div.baseinfo > img").src
          const nodes = doc.querySelectorAll("#chapterlist a")
          // const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
          // const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
          let styles = []

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
            obj.styles.push({ name: nodes[index].textContent, href: nodes[index].parentNode.href })
            obj.chapters.push({
              id: nodes[index].getAttribute("href").split("/").at(-1),
              title: nodes[index].textContent,
            })
          }

          return obj
        },
        getPages: async (id) => {
          const res = await window._gh_get_html(`https://www.baozimhw.com/manhua/capter/${id}`, {
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
          let nodes = doc.querySelectorAll(".padding5 img")
          for (let index = 0; index < nodes.length; index++) {
            let obj = {
              id: "",
              src: "",
              width: 0,
              height: 0
            };

            obj["id"] = `123123${index}`;
            obj["src"] = `${nodes[index].src}`
            data.push(obj)
          }

          return data
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "www.baozimhw.com") {
            return obj.pathname.split("/").at(-1).split(".")[0]
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
        ],
      }, {
        getDetail: async (id) => {
          const b64_to_utf8 = (str) => {
            return decodeURIComponent(window.atob(str));
          }
          const res = await window._gh_get_html(b64_to_utf8(id), {
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
          const res = await window._gh_get_html(b64_to_utf8(id), {
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

              const res = await window._gh_get_html(url, {
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
          const res = await window._gh_get_html(`https://hanime1.me/comics/search?query=${obj.keyword}&page=${obj.page_num}`, {
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
        id: "nhentai_xxx",
        href: "https://nhentai.xxx/",
        is_cache: true,
        is_download: true,
        is_preloading: true,
        menu: [
        ],
      }, {
        getDetail: async (id) => {
          const b64_to_utf8 = (str) => {
            return decodeURIComponent(window.atob(str));
          }
          const res = await window._gh_get_html(b64_to_utf8(id));
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

          obj.title = doc.querySelector(".info > h1").textContent.trim()
          obj.cover = doc.querySelector(".cover > a > img").src;


          obj.chapters.push({
            id: utf8_to_b64(`https://nhentai.xxx${doc.querySelectorAll(".gt_th a")[0].getAttribute("href")}`),
            title: obj.title,
            cover: obj.cover,
          })
          return obj
        },
        getPages: async (id) => {
          const arr = await window._gh_execute_eval(decodeURIComponent(window.atob(id)),
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
  return arr
})()
        `)

          return arr
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "nhentai.xxx") {
            return window.btoa(encodeURIComponent(id))
          } else {
            return null
          }
        }
      });
      window._gh_comics_register({
        id: "yabai",
        href: "https://yabai.si/g",
        is_cache: true,
        is_download: true,
        is_preloading: true,
        menu: [
        ],
      }, {
        getDetail: async (id) => {


          const b64_to_utf8 = (str) => {
            return decodeURIComponent(window.atob(str));
          }
          const res = await window._gh_get_html(b64_to_utf8(id));

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

          obj.title = doc.querySelector("#app header > h1").textContent.trim()
          obj.cover = doc.querySelector("#app img").src;


          obj.chapters.push({
            id: utf8_to_b64(`${(b64_to_utf8(id))}/read`),
            title: obj.title,
            cover: obj.cover,
          })
          return obj
        },
        getPages: async (id) => {
          const arr = await window._gh_execute_eval(decodeURIComponent(window.atob(id)),
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
})()`)


          return arr
        },
        UrlToDetailId: async (id) => {
          const obj = new URL(id);
          if (obj.host == "yabai.si") {
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
          const res = await window._gh_get_html(decodeURIComponent(window.atob(novel_id)), {
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
            href: decodeURIComponent(window.atob(novel_id)),
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

        getDetail: async (novel_id) => {

          const res = await window._gh_get_html(decodeURIComponent(window.atob(novel_id)), {
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
            href: decodeURIComponent(window.atob(novel_id)),
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
  comics_register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      name: key,
      type: 'comics',
      is_cache: false,
      is_download: false,
      is_preloading: false,
      is_load_free: false,
      images_concurrency_limit: 3,
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

    this.add$.next(config)
  }
  novels_register = (config: Config, events: Events) => {
    const key = config.id;

    config = {
      name: key,
      type: 'novels',
      is_visible: true,
      is_cache: false,
      is_download: false,
      images_concurrency_limit: 3,
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

    this.add$.next(config)
  }

  get_data = async (key: string) => {
    const res = await this.webDb.getByKey('data_v2', key)
    if (res) return res.data
    else return null
  }
  set_data = async (key: string, data: any) => {
    const res = await this.webDb.update('data_v2', {
      id: key,
      data: data
    })
    return res
  }




}
