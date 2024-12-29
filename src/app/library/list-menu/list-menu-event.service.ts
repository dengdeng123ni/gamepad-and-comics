import { Injectable } from '@angular/core';
interface MenuItem {
  id?: string;
  name: string;
  getList: Function,
  qeury?: MenuItem[];
}
interface Config {
  id: string,
  type: string,
}

// source built_in separate

@Injectable({
  providedIn: 'root'
})
export class ListMenuEventService {

  constructor() { }

  register = (content: Array<MenuItem>) => {
    // if (type == "source") {

    // } else if (type == "built_in") {

    // } else {
    //   type = "separate";
    // }
  }
}

// menu: [
//   {
//     id: 'advanced_search',
//     icon: 'search',
//     name: '历史记录',
//     type: "separate",
//     query: {
//       type: 'advanced_search',
//       conditions: [
//         {
//           "id": "f_search",
//           "type": "search"
//         },
//         {
//           "id": "f_cats",
//           "name": "类别",
//           "type": "tag",
//           "options": [
//             {
//               "label": "同人志",
//               "value": "1021"
//             },
//             {
//               "label": "漫画",
//               "value": "1019"
//             },
//             {
//               "label": "艺术家 CG",
//               "value": "1015"
//             },
//             {
//               "label": "游戏 CG",
//               "value": "1007"
//             },
//             {
//               "label": "西方",
//               "value": "511"
//             },
//             {
//               "label": "非 H",
//               "value": "767"
//             },
//             {
//               "label": "图像集",
//               "value": "991"
//             },
//             {
//               "label": "角色扮演",
//               "value": "959"
//             },
//             {
//               "label": "亚洲色情",
//               "value": "895"
//             },
//             {
//               "label": "杂项",
//               "value": "1022"
//             }
//           ]
//         },
//         {
//           "id": "f_srdd",
//           "name": "最低评分",
//           "type": "select",
//           "options": [
//             { "label": "1", "value": 1 },
//             { "label": "2", "value": 2 },
//             { "label": "3", "value": 3 },
//             { "label": "4", "value": 4 },
//             { "label": "5", "value": 5 }
//           ]
//         },
//         {
//           "id": "language",
//           "name": "语言",
//           "type": "select",
//           "options": [
//             {
//               "label": "中文",
//               "value": "language:chinese"
//             },
//             {
//               "label": "英语",
//               "value": "language:english"
//             },
//             {
//               "label": "韩语",
//               "value": "language:korean"
//             },
//             {
//               "label": "泰国",
//               "value": "language:thai"
//             },
//             {
//               "label": "西班牙语",
//               "value": "language:spanish"
//             },
//             {
//               "label": "已翻译",
//               "value": "language:translated"
//             },
//             {
//               "label": "重写",
//               "value": "language:rewrite"
//             },
//           ]
//         },
//         {
//           "id": "f_sh",
//           "name": "浏览已删除画廊",
//           "type": "toggle"
//         },
//         {
//           "id": "f_spf",
//           "name": "最小页数",
//           "type": "slider",
//           min: 1,
//           max: 300
//         },
//         {
//           "id": "f_spt",
//           "name": "最大页数",
//           "type": "slider",
//           min: 1,
//           max: 2000
//         },
//       ]
//     },
//     getList: (e) => {
//       return
//     }
//   },
// ]
