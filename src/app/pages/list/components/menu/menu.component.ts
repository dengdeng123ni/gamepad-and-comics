import { Component, NgZone } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UploadService } from './upload.service';
import { TemporaryFileService } from './temporary-file.service';
import { AppDataService, DbEventService, PulgService } from 'src/app/library/public-api';
import { LocalCachService } from './local-cach.service';
import { MenuService } from './menu.service';
declare const window: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  list = [
    {
      icon: "",
      name: "",
      component: ""
    }
  ];
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  panelOpenState = true;
  constructor(public data: DataService,
    public upload: UploadService,
    public temporaryFile: TemporaryFileService,
    public AppData: AppDataService,
    public DbEvent:DbEventService,
    public LocalCach: LocalCachService,
    public menu: MenuService,
    public pulg:PulgService,
    private zone: NgZone
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }
  cc(){
    this.pulg.openFile();
  }
  on(type: string) {

    this.zone.run(() => {
      this.data.qurye_page_type = "1"
      setTimeout(()=>{
        this.data.qurye_page_type = type;
      })
    })
    this.data.list = [];
    this.AppData.setOrigin('bilibili')
    if(type=='history'){
      this.DbEvent.Configs[this.AppData.origin].is_cache=true;
    }else{
      this.DbEvent.Configs[this.AppData.origin].is_cache=false;
    }
    this.menu.opened = !this.menu.opened;
  }
  on3(c,type: string) {
    this.zone.run(() => {
      this.data.qurye_page_type = "1"
      setTimeout(()=>{
        this.data.qurye_page_type = type;
      })
    })
    this.data.list = [];
    this.AppData.setOrigin(c)
    this.menu.opened = !this.menu.opened;
  }
  on2(id: string) {
    this.zone.run(() => {
      this.data.qurye_page_type = "1"
      setTimeout(()=>{
        this.data.qurye_page_type = 'temporary_file';
      })
    })
    this.data.list = [];
    this.AppData.setOrigin('temporary_file')
    window.comics_query_option.temporary_file_id = id;
    this.menu.opened = !this.menu.opened;
  }
  onLocalMenu(id: string) {
    this.data.list = [];
    this.AppData.setOrigin('local_cache')
    this.data.qurye_page_type = "local_cache";
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: string) => option.toLowerCase().includes(filterValue));
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
    this.temporaryFile.menu.push({ id, name: dirHandle["name"] })
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


    // this.config.temporary.list.push({ id, name: dirHandle["name"] })
    // this.current.temporary_file_ids.push(id);
    // await this.current.getComicsInfoAll();
  }
}
