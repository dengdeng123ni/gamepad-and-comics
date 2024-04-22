import { Component, NgZone } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UploadService } from './upload.service';
import { TemporaryFileService } from './temporary-file.service';
import { AppDataService, DbEventService, PulgService } from 'src/app/library/public-api';
import { LocalCachService } from './local-cach.service';
import { MenuService } from './menu.service';
import { CurrentService } from '../../services/current.service';
declare const window: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  myControl = new FormControl('');

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  query_type = [
    {
      id: 'type',
      icon: 'class',
      name: '分类',
      query: {
        type: 'multipy',
        list: [
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
      id: 'update',
      name: '更新',
      icon: 'update',
      query: {
        type: '',
        list: []
      }
    },
    {
      id: 'ranking',
      icon: 'sort',
      name: '排行榜',
      query: {
        type: 'choice',
        list: [
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
      query: {
        type: 'choice',
        name: '我的追漫',
        list: [
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
  ]

  on($event, data, parent: any = {}) {
    if (data.click) {
      data.click({
        ...data, $event: $event, parent
      })
      if (parent.id) this.AppData.setOrigin(parent.id)

    } else if (data.query) {
      if (parent.id) this.AppData.setOrigin(parent.id)
      this.data.list = [];
      this.zone.run(() => {
        this.data.qurye_page_type = "1"
        setTimeout(() => {
          this.data.qurye_page_type = 'query';
          setTimeout(() => {
            this.current._query(data)
          })
        })
      })

    }
  }
  constructor(public data: DataService,
    public current: CurrentService,
    public upload: UploadService,
    public temporaryFile: TemporaryFileService,
    public AppData: AppDataService,
    public DbEvent: DbEventService,
    public LocalCach: LocalCachService,
    public menu: MenuService,
    public pulg: PulgService,
    private zone: NgZone
  ) {

    if (this.data.menu.length == 0) {
      this.DbEvent.Configs['bilibili'].menu = this.query_type;
      Object.keys(this.DbEvent.Events).forEach(x => {
        if (x == "temporary_file") return
        if (x == "local_cache") return
        let obj = {
          id: x,
          icon: "home",
          name: x,
          submenu: [],
        };
        if (this.DbEvent.Configs[x].menu) {
          for (let index = 0; index < this.DbEvent.Configs[x].menu.length; index++) {
            obj.submenu.push(this.DbEvent.Configs[x].menu[index])
          }
        }
        obj.submenu.push(
          {
            id: "history",
            icon: "history",
            name: "历史记录",
            click: (e) => {
              this.zone.run(() => {
                this.data.qurye_page_type = "1"
                setTimeout(() => {
                  this.data.qurye_page_type = 'history';
                })
              })
              this.data.list = [];
              this.AppData.setOrigin(e.parent.id)
              this.DbEvent.Configs[this.AppData.origin].is_cache = true;
            }
          }
        )
        this.data.menu.push(obj)
      })
      this.data.menu.push({
        id: 'cached',
        icon: "cached",
        name: '缓存',
        click: (e) => {
          window.comics_query_option.origin="local_cache"
          this.zone.run(() => {
            this.data.qurye_page_type = "1"
            setTimeout(() => {
              this.data.list = [];
              this.data.qurye_page_type = 'local_cache';
            })
          })

          this.AppData.setOrigin('local_cache')

        }
      })
      this.data.menu.push({ type: 'separator' })
      this.data.menu.push({
        id: 'add',
        icon: "add",
        name: '打开文件夹',
        click: (e) => {
          this.openTemporaryFile();
        }
      })
    }

  }
  ngOnDestroy() {

  }
  cc() {
    this.pulg.openFile();

  }
  async openTemporaryFile() {
    const dirHandle = await (window as any).showDirectoryPicker({ mode: "read" });
    let files_arr: { id: number; blob: any; path: string; name: any; }[] = []
    let date = new Date().getTime();
    const handleDirectoryEntry = async (dirHandle: any, out: { [x: string]: {}; }, path: any) => {
      if (dirHandle.kind === "directory") {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file") {
            if (["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(entry.name.split(".")[1])) {
              out[entry.name] = { id: date, blob: entry, path: `${path}/${entry.name}`.substring(1) };
              files_arr.push({ id: date, blob: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
              date++;
            }
          }
          if (entry.kind === "directory") {
            const newOut = out[entry.name] = {};
            await handleDirectoryEntry(entry, newOut, `${path}/${entry.name}`);
          }
        }
      }
      if (dirHandle.kind === "file") {
        const entry = dirHandle;
        if (!["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(entry.name.split(".")[1])) return
        out[entry.name] = { id: date, blob: entry, path: `${path}/${entry.name}`.substring(1) };
        files_arr.push({ id: date, blob: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
        date++;
      }
    }
    const out = {};
    const id = window.btoa(encodeURI(dirHandle["name"]))
    await handleDirectoryEntry(dirHandle, out, dirHandle["name"]);
    let list = await this.upload.subscribe_to_temporary_file_directory(files_arr, id)
    list.forEach(x => x.temporary_file_id = id);
    this.temporaryFile.data = [...this.temporaryFile.data, ...list]
    let chapters: any[] = [];
    this.data.menu.push({
      id,
      icon: "subject",
      name: dirHandle["name"],
      click: e => {
        this.zone.run(() => {
          window.comics_query_option.temporary_file_id = e.id;
          this.AppData.origin = "temporary_file";
          window.comics_query_option.origin="temporary_file"
          this.zone.run(() => {
            this.data.qurye_page_type = "1"
            setTimeout(() => {
              this.data.qurye_page_type = "temporary_file"
            })
          })
        })
      }
    })
    for (let index = 0; index < this.temporaryFile.data.length; index++) {
      const x = this.temporaryFile.data[index];
      chapters = [...chapters, ...x.chapters];
    }
    this.temporaryFile.chapters = chapters;
    this.temporaryFile.files = [...this.temporaryFile.files, ...files_arr];

    this.zone.run(() => {
      window.comics_query_option.temporary_file_id = id;
      this.AppData.origin = "temporary_file";
      this.data.qurye_page_type = "temporary_file"
    })
  }
}
