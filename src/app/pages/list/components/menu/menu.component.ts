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
import { Router } from '@angular/router';
import { SettingsService } from '../../settings/settings.service';
import { PulgJavascriptService } from '../pulg-javascript/pulg-javascript.service';
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

  on($event, data, parent: any = {}) {

    if(parent.id) this.AppData.setOrigin(parent.id)
    if (data.click) {
      data.click({
        ...data, $event: $event, parent
      })
      if (parent.id) this.AppData.setOrigin(parent.id)

    } else if (data.query) {
      if (parent.id) this.AppData.setOrigin(parent.id)
      if(data.query.type=="choice"){
        this.router.navigate(['/choice', parent.id, data.id]);
      }
      if(data.query.type=="search"){
        this.router.navigate(['/search', parent.id]);
      }
      if(data.query.type=="multipy"){
        this.router.navigate(['/multipy', parent.id, data.id]);
      }

    }
  }
  change$=null;
  constructor(public data: DataService,
    public current: CurrentService,
    public upload: UploadService,
    public temporaryFile: TemporaryFileService,
    public AppData: AppDataService,
    public DbEvent: DbEventService,
    public LocalCach: LocalCachService,
    public menu: MenuService,
    public router: Router,
    public pulg: PulgService,
    public Settings:SettingsService,
    public PulgJavascript:PulgJavascriptService,
    private zone: NgZone
  ) {

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
              this.router.navigate(['/history', e.parent.id]);
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
          this.router.navigate(['/local_cache']);
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
      this.change$= this.DbEvent.change().subscribe((x:any)=>{
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
              this.router.navigate(['/history', e.parent.id]);
            }
          }
        )
        this.data.menu.push(obj)
      })
    }

  }
  ngOnDestroy() {
    this.change$.unsubscribe();
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
        this.AppData.setOrigin('temporary_file')
        this.router.navigate(['/temporary_file', e.id], { queryParams: { name: e.name } });
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
