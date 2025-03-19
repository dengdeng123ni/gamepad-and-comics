import { Component, NgZone } from '@angular/core';
import { UploadModulePageService } from '../upload-module-page/upload-module-page.service';
import { LocalModulePageService } from '../local-module-page/local-module-page.service';
import { CreateModulePageService } from '../create-module-page/create-module-page.service';
import { ModulePageService } from './module-page.service';
import { SteamModuleService } from '../../services/steam-module.service';
import { ModuleDetailPageService } from '../module-detail-page/module-detail-page.service';
const ELEMENT_DATA = [
];

@Component({
  selector: 'app-module-page',
  templateUrl: './module-page.component.html',
  styleUrl: './module-page.component.scss'
})
export class ModulePageComponent {
  page = 1;
  data = [];

  info = null;

  is_disabled = false;
  is_subscribe = false;

  list = [];

  loacl_list = [];
  query_list = [
    {
      "id": "text",
      "type": "search"
    },
    {
      "id": "queryType",
      "name": "查询类型",
      "type": "select",
      "options": [
        {
          "label": "按用户投票的评分",
          "value": 0
        },
        {
          "label": "按发布时间从新到旧排序",
          "value": 1
        },
        {
          "label": "按短期热度",
          "value": 3
        },
        {
          "label": "按订阅用户数从多到少排序。",
          "value": 12
        },
        {
          "label": "按近期游玩时长增长趋势从高到低排序",
          "value": 13
        },
        {
          "label": "按总游玩时长从多到少排序",
          "value": 14
        },
      ],
      value: 3
    }
  ];
  constructor(
    public LocalModulePage: LocalModulePageService,
    public UploadModulePage: UploadModulePageService,
    public CreateModulePage: CreateModulePageService,
    public ModulePage: ModulePageService,
    public SteamModule: SteamModuleService,
    public ModuleDetailPage: ModuleDetailPageService,
    private zone: NgZone,
  ) {

    this.init();

  }
  async init(){

    const res:any= await this.SteamModule.getUserSubscribeItems();
    this.loacl_list=res.items.map((x, i) => ({

      title: x.title,
      tag: "",
      author: x.title,
      index: i,
      cover: x.previewUrl,
      score: `${this.wilsonScore(x.numUpvotes, x.numDownvotes).toFixed(2)}%`,
      ...x
    }));
  }
  displayedColumns: string[] = ['name', 'tag', 'count'];
  dataSource = ELEMENT_DATA;
  wilsonScore(upvotes, downvotes, confidence = 1.96) {
    const n = upvotes + downvotes;
    if (n === 0) return 0; // 无点赞数时返回 0

    const p = upvotes / n;
    const z = confidence;
    const z2 = z * z;

    const lowerBound = (p + z2 / (2 * n) - z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) / (1 + z2 / n);
    return lowerBound * 100; // 转换为百分比
  }
  getPages() {
    this.sendMessage({ type: "get_all", data: { page: this.page } });
  }
  sendMessage = (data) => {
    (window as any).electron.sendMessage('steam_workshop_get_module', data)
  }

  getInfo(index) {
    this.is_disabled = false;
    this.is_subscribe = false;
    const res = this.data[index];
    this.info = res;
    this.sendMessage({ type: "state", data: { publishedFileId: res.publishedFileId } });
  }
  checkWorkshopItemState(state) {
    let obj = {
      is_subscribe: false
    };
    if (state & 1) {
      obj.is_subscribe = true
      console.log("✅ 用户已订阅");
    }
    if (state & 2) {
      console.log("🔄 物品是旧版 (Legacy Item)");
    }
    if (state & 4) {
      console.log("📂 物品已安装");
    }
    if (state & 8) {
      console.log("⚠️ 物品需要更新");
    }
    if (state & 16) {
      console.log("⏳ 物品正在下载");
    }
    if (state & 32) {
      console.log("📥 物品下载待处理 (队列中)");
    }
    return obj

  }

  subscribe() {
    this.is_subscribe = true;
    this.sendMessage({ type: "subscribe", data: { publishedFileId: this.info.publishedFileId } });
  }

  unsubscribe() {
    this.is_subscribe = false;
    this.sendMessage({ type: "unsubscribe", data: { publishedFileId: this.info.publishedFileId } });

  }

  on_135 = async (e) => {

    let res = [] as any;
    res = await this.SteamModule.getAllItems(1, e.queryType ?? 1, {
      cachedResponseMaxAge: 0,
      searchText: e.text ?? undefined,
    })

    this.list = res.items.map((x, i) => ({

      title: x.title,
      tag: "",
      author: x.title,
      index: i,
      cover: x.previewUrl,
      score: `${this.wilsonScore(x.numUpvotes, x.numDownvotes).toFixed(2)}%`,
      ...x
    }));
  }

  on(e) {
    this.ModuleDetailPage.open();

  }
}
