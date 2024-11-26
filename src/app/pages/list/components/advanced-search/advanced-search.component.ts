import { Component } from '@angular/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent {
   list:any= [
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
            "value": "Doujinshi"
        },
        {
            "label": "漫画",
            "value": "Manga"
        },
        {
            "label": "艺术家 CG",
            "value": "Artist CG"
        },
        {
            "label": "游戏 CG",
            "value": "Game CG"
        },
        {
            "label": "西方",
            "value": "Western"
        },
        {
            "label": "非 H",
            "value": "Non-H"
        },
        {
            "label": "图像集",
            "value": "Image Set"
        },
        {
            "label": "角色扮演",
            "value": "Cosplay"
        },
        {
            "label": "亚洲色情",
            "value": "Asian Porn"
        },
        {
            "label": "杂项",
            "value": "Misc"
        }
    ]
    },
    {
      "id": "f_srddf_srdd",
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
      "type": "slider"
    },
    {
      "id": "f_spt",
      "label": "最大页数",
      "type": "slider"
    },

  ]
}
