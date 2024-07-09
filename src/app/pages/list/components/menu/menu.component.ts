import { Component, NgZone } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UploadService } from './upload.service';
import { TemporaryFileService } from './temporary-file.service';
import { AppDataService, ContextMenuControllerService, ContextMenuEventService, DbEventService, LocalCachService, PulgService } from 'src/app/library/public-api';
import { MenuService } from './menu.service';
import { CurrentService } from '../../services/current.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Router } from '@angular/router';
import { PulgJavascriptService } from '../pulg-javascript/pulg-javascript.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ControllerSettingsService } from '../controller-settings/controller-settings.service';
import { UrlToComicsIdService } from '../url-to-comics-id/url-to-comics-id.service';
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


  current_menu_id = null;
  on($event, data, parent: any = {}) {
    this.menu.current_menu_id = parent.id?`${parent.id}_${data.id}`:data.id;

    if (parent.id) this.AppData.setOrigin(parent.id)
    if (data.click) {
      data.click({
        ...data, $event: $event, parent
      })
      if (parent.id) this.AppData.setOrigin(parent.id)

    } else if (data.query) {
      if (parent.id) this.AppData.setOrigin(parent.id)
      if (data.query.type == "choice") {

        this.router.navigate(['/query', 'choice', parent.id, data.id]);
      }
      if (data.query.type == "search") {
        this.router.navigate(['/search', parent.id, ""]);
      }
      if (data.query.type == "multipy") {
        this.router.navigate(['/query', 'multipy', parent.id, data.id]);
      }
      if (data.query.type == "single") {
        this.router.navigate(['/query', 'single', parent.id, data.id]);
      }



    }
  }
  change$ = null;
  constructor(
    public data: DataService,
    public current: CurrentService,
    public upload: UploadService,
    public temporaryFile: TemporaryFileService,
    public AppData: AppDataService,
    public DbEvent: DbEventService,
    public LocalCach: LocalCachService,
    public webDb: NgxIndexedDBService,
    public menu: MenuService,
    public router: Router,
    public pulg: PulgService,
    public PulgJavascript: PulgJavascriptService,
    public ContextMenuController: ContextMenuControllerService,
    public ContextMenuEvent: ContextMenuEventService,
    public ControllerSettings: ControllerSettingsService,

    public UrlToComicsId: UrlToComicsIdService,
    public route: ActivatedRoute,
    private zone: NgZone
  ) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {

      }
      if (event instanceof NavigationEnd) {
      }
    })

    if (this.data.menu.length == 0) {
      Object.keys(this.DbEvent.Events).forEach(x => {
        if (x == "temporary_file") return
        if (x == "local_cache") return
        let obj = {
          id: x,
          icon: "home",
          name: this.DbEvent.Configs[x].name,
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
              this.router.navigate(['query', 'history', e.parent.id]);
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
          this.AppData.setOrigin('local_cache')
          this.router.navigate(['query', 'local_cache']);
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
      this.change$ = this.DbEvent.change().subscribe((x: any) => {
        let obj = {
          id: x,
          icon: "home",
          name: x.name,
          submenu: [],
        };
        if (x.menu) {
          for (let index = 0; index < x.menu.length; index++) {
            obj.submenu.push(x.menu[index])
          }
        }
        obj.submenu.push(
          {
            id: "history",
            icon: "history",
            name: "历史记录",
            click: (e) => {
              this.router.navigate(['query', 'history', e.parent.id]);
            }
          }
        )
        this.data.menu.push(obj)
      })
    }
    ContextMenuEvent.register('_gh_settings',
      {
        on: async (e: any) => {
          e.click()
        },
        menu: [
          {
            id: "javasciprt",
            name: "主题",
            click: () => {
            }
          },
          {
            id: "javasciprt",
            name: "脚本",
            click: () => {
              PulgJavascript.open()
            }
          },
          {
            id: "ope",
            name: "按键说明",
            click: () => {
              ControllerSettings.open()
            }
          },
          // {
          //   id: "ope1",
          //   name: "链接",
          //   click: () => {

          //   }
          // },
          {
            id: "ope3",
            name: "清理全部缓存",
            click: () => {

            }
          },
        ]
      })


  }

  onMenu(e) {
    const node = document.querySelector("[menu_key=_gh_settings]")
    const p = node.getBoundingClientRect();
    this.ContextMenuController.openMenu(node, p.left, p.top)
  }
  async getClipboardContents() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          const f = await fetch(URL.createObjectURL(blob))
          const t = await f.text()
          if(t.substring(0,4)=="http"){
            this.UrlToComicsId.UrlToDetailIdAll(t)
          }
        }
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
  ngOnDestroy() {

    if (this.change$) this.change$.unsubscribe();
  }
  cc() {
    this.pulg.openFile();

  }
  async openTemporaryFile() {
    const dirHandle = await (window as any).showDirectoryPicker();
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
    const id = new Date().getTime();


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
        this.AppData.setOrigin('temporary_file')
        this.router.navigate(['query', 'temporary_file', 'temporary_file', e.id]);
      }
    })
    for (let index = 0; index < this.temporaryFile.data.length; index++) {
      const x = this.temporaryFile.data[index];
      chapters = [...chapters, ...x.chapters];
    }
    this.temporaryFile.chapters = chapters;
    this.temporaryFile.files = [...this.temporaryFile.files, ...files_arr];

  }
}
