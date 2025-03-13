import { Component, NgZone } from '@angular/core';
import { UploadModulePageService } from '../upload-module-page/upload-module-page.service';
import { LocalModulePageService } from '../local-module-page/local-module-page.service';
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
  constructor(
    public LocalModulePage: LocalModulePageService,
    public UploadModulePage: UploadModulePageService,
     private zone: NgZone,
  ) {

    (window as any).electron.receiveMessage('steam_workshop_get_module', async (event, message) => {
      if (message.type == "get_all") {
        const res = message.data.items.map((x, i) => ({
          name: x.title,
          tag: "",
          count: Number(x.statistics.numSubscriptions),
          index: i,
          score: `${this.wilsonScore(x.numUpvotes, x.numDownvotes).toFixed(2)}%`
        }));

        this.data = message.data.items;
        this.dataSource = res;

      } else if (message.type == "state") {

        this.zone.run(()=>{
          this.is_subscribe = this.checkWorkshopItemState(message.data).is_subscribe;
        })

      }
    })

    this.getPages()
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
    this.is_subscribe=true;
    this.sendMessage({ type: "subscribe", data: { publishedFileId: this.info.publishedFileId } });
  }

  unsubscribe(){
    this.is_subscribe=false;
    this.sendMessage({ type: "unsubscribe", data: { publishedFileId: this.info.publishedFileId } });

  }
}
