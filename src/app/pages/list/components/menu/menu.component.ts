import { Component, NgZone } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UploadService } from './upload.service';
import { TemporaryFileService } from './temporary-file.service';
import { AppDataService, ContextMenuControllerService, ContextMenuEventService, DbEventService, DropDownMenuService, IndexdbControllerService, LocalCachService, PromptService, PulgService } from 'src/app/library/public-api';
import { MenuService } from './menu.service';
import { CurrentService } from '../../services/current.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Router } from '@angular/router';
import { PulgJavascriptService } from '../pulg-javascript/pulg-javascript.service';

import { ControllerSettingsService } from '../controller-settings/controller-settings.service';
import { UrlToComicsIdService } from '../url-to-comics-id/url-to-comics-id.service';
import { MenuSearchService } from '../menu-search/menu-search.service';
import { SoundEffectsService } from '../sound-effects/sound-effects.service';
import { AboutSoftwareService } from '../about-software/about-software.service';
import { PlugInInstructionsService } from '../plug-in-instructions/plug-in-instructions.service';
import { UrlUsageGuideService } from '../url-usage-guide/url-usage-guide.service';
import { GetKeyboardKeyService } from '../get-keyboard-key/get-keyboard-key.service';
import { PageThemeService } from '../page-theme/page-theme.service';
declare const window: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  _keyword = "";

  get keyword() { return this._keyword };
  set keyword(value: string) {
    this._keyword = value;
  }
  myControl = new FormControl('');

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  current_menu_id = null;

  on($event, data, parent: any = {}) {

    this.menu.current_menu_pid = parent.id ? `${parent.id}` : data.id;
    this.menu.current_menu_id = parent.id ? `${parent.id}_${data.id}` : data.id;
    this.menu.post();
    if (parent.id) this.AppData.setsource(parent.id)
    if (data.click) {
      data.click({
        ...data, $event: $event, parent
      })
      if (parent.id) this.AppData.setsource(parent.id)

    } else if (data.query) {
      if (parent.id) this.AppData.setsource(parent.id)
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
    public webDb: IndexdbControllerService,
    public menu: MenuService,
    public router: Router,
    public pulg: PulgService,
    public GetKeyboardKey: GetKeyboardKeyService,
    public PulgJavascript: PulgJavascriptService,
    public ContextMenuController: ContextMenuControllerService,
    public ContextMenuEvent: ContextMenuEventService,
    public ControllerSettings: ControllerSettingsService,
    public DropDownMenu: DropDownMenuService,
    public UrlToComicsId: UrlToComicsIdService,
    public MenuSearch: MenuSearchService,
    public route: ActivatedRoute,
    public SoundEffects: SoundEffectsService,
    public AboutSoftware: AboutSoftwareService,
    public PlugInInstructions: PlugInInstructionsService,
    public UrlUsageGuide: UrlUsageGuideService,
    public PageTheme: PageThemeService,
    public prompt:PromptService,
    private zone: NgZone
  ) {

    // this.ControllerSettings.open();
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {

      }
      if (event instanceof NavigationEnd) {
      }
    })
   current.updateMenu().subscribe(async (x)=>{

      await this.menu.get()
      this.data.menu=[];
      this.init();
   })

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
              this.PageTheme.open({
                position: {
                  left: "10px",
                  bottom: "100px"
                },
                panelClass: "_controller_settings",
                backdropClass: "_reader_config_bg",
              });
            }
          },
          // {
          //   id: "ope3",
          //   name: "蓝牙",
          //   click: () => {

          //   }
          // },
          {
            id: "ope3",
            name: "支持网站",
            click: () => {
              this.UrlUsageGuide.open({});
            }
          },
          {
            id: "ope3",
            name: "扩展安装说明",
            click: () => {
              this.PlugInInstructions.open({});

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
            name: "控制",
            click: () => {
              ControllerSettings.open()
            }
          },
          {
            id: "ope",
            name: "音频",
            click: () => {
              SoundEffects.open({
                position: {
                  left: "10px",
                  bottom: "10px"
                }
              })
            }
          },
          // {
          //   id: "ope3",
          //   name: "缓存",
          //   click: () => {

          //   }
          // },

          {
            id: "ope",
            name: "关于软件",
            click: () => {
              AboutSoftware.open({})
            }
          }
        ]
      })


    ContextMenuEvent.register('menu_item_v3',
      {
        send: ($event, data) => {
          const value = $event.getAttribute("content_menu_value")

          const obj = this.data.menu.find(x => x.id?.toString() == value.toString());

          if (obj.content_menu) {
            return obj.content_menu
          } else {
            return [...data, ...obj.submenu]
          }

        },
        on: async (e: any) => {

          e.click(e.value)
        },
        menu: [
          {
            id: "open_href",
            name: "打开网站",
            click: (e) => {
              window.open(this.DbEvent.Configs[e].href)
            }
          }
        ]
      })
    ContextMenuEvent.register('menu_item_v2',
      {
        send: ($event, data) => {
          const value = $event.getAttribute("content_menu_value")

          const obj = this.data.menu.find(x => x.id?.toString() == value.toString());

          if (obj.content_menu) {
            return obj.content_menu
          } else {
            return [...data, ...obj.submenu]
          }

        },
        on: async (e: any) => {

          e.click(e.value)
        },
        menu: [
          {
            id: "open_href",
            name: "打开网站",
            click: (e) => {
              window.open(this.DbEvent.Configs[e].href)
            }
          }
        ]
      })
    ContextMenuEvent.register('menu_item_v1',
      {

        on: async (e: any) => {
          e.click(e.value)
        },
        menu: [
          {
            id: "open_href",
            name: "打开网站",
            click: (e) => {
              window.open(this.DbEvent.Configs[e].href)
            }
          }
        ]
      })

    this.init();

  }
  init() {
    if (this.data.menu.length == 0) {
      Object.keys(this.DbEvent.Events).forEach((x) => {
        if (x == "temporary_file") return
        if (x == "local_cache") return
        if (x == "temporary_data") return

        let obj = {
          id: x,
          icon: "folder_open",
          name: this.DbEvent.Configs[x].name,
          submenu: [],
          expanded: true
        };
        if (this.DbEvent.Configs[x].menu) {
          for (let index = 0; index < this.DbEvent.Configs[x].menu.length; index++) {
            const j122 = this.DbEvent.Configs[x].menu[index]
            let obj1 = {
              ...j122,
              click: () => {
                this.menu.current_menu_pid = x ? `${x}` : j122.id;
                this.menu.current_menu_id = x ? `${x}_${j122.id}` : j122.id;
                if (x) this.AppData.setsource(x)


                if (j122.query.type == "choice") {

                  this.router.navigate(['/query', 'choice', x, j122.id]);
                }
                if (j122.query.type == "search") {
                  this.router.navigate(['/search', x, ""]);
                }
                if (j122.query.type == "multipy") {
                  this.router.navigate(['/query', 'multipy', x, j122.id]);
                }
                if (j122.query.type == "single") {
                  this.router.navigate(['/query', 'single', x, j122.id]);
                }
                if (j122.query.type == "advanced_search") {
                  this.router.navigate(['/query', 'advanced_search', x, j122.id]);
                }

              }
            }
            obj.submenu.push(obj1)
          }
        }
        if (this.DbEvent.Configs[x].type == "comics") {
          obj.submenu.push(
            {
              id: "history",
              icon: "history",
              name: "历史记录",
              click: () => {
                this.menu.current_menu_pid = `${x}`;
                this.menu.current_menu_id = `${x}_history`
                this.router.navigate(['query', 'history', x], {
                  queryParams: {
                    gh_data: 'reset',

                  }
                });
              }
            }
          )
        } else {

          obj.submenu.push(
            {
              id: "history",
              icon: "history",
              name: "历史记录",
              click: () => {

                this.menu.current_menu_pid = `${x}`;
                this.menu.current_menu_id = `${x}_history`
                this.router.navigate(['novel_query', 'history', x]);
              }
            }
          )
        }

        this.data.menu_2.push(obj)
        this.data.menu.push(obj)
      })
      if (['local_cache', 'temporary_file', 'temporary_data'].includes(this.AppData.source)) {
        this.data.menu_2_obj = this.data.menu_2[0]

      } else {
        this.data.menu_2_obj = this.data.menu_2.find(x => x.id == this.AppData.source)
        // const index= this.data.menu.findIndex(x=>x.id==this.AppData.source)
        // this.data.menu[index].expanded=true;
      }
      if(!this.data.menu_2_obj)  this.data.menu_2_obj = this.data.menu_2[0]
      if (this.menu.url_to_list.length) this.data.menu.push({ type: 'separator' })
      this.menu.url_to_list.forEach(x => {
        this.data.menu.push({
          id: x.id,
          icon: "link",
          name: x.name,
          content_menu: [
            {
              id: "delete",
              name: "删除",
              click: async () => {
                await this.webDb.deleteByKey('url_to_list', x.id)
                this.data.menu = this.data.menu.filter(c => c.id != x.id)
              }
            },

            {
              id: "ei39",
              name: "重命名",
              click: async () => {
                const name = await this.prompt.fire("请输入新名称", "");
                if (name !== null) {
                  if (name != "") {
                    const obj: any = await this.webDb.getByKey('url_to_list', x.id)
                    obj.name = name
                    await this.webDb.update('url_to_list', obj)
                    let index = this.data.menu.findIndex(c => c.id == x.id)
                    this.data.menu[index].name = name;
                  }
                } else {

                }
              }
            },
            {
              id: "data",
              name: "来源 URL",
              click: async () => {
                const obj: any = await this.webDb.getByKey('url_to_list', x.id)
                alert(
                  `${obj.url}`
                )
              }
            },
          ],

          click: async (e) => {
            this.router.navigate(['query', 'url_to_list', x.source, x.id]);
          }
        })
      })
      if (this.menu.query_fixed.length)this.data.menu.push({ type: 'separator' })
      this.menu.query_fixed.forEach(x => {
        this.data.menu.push({
          id: x.id,
          icon: "radio_button_unchecked",
          name: x.name,
          content_menu: [
            {
              id: "delete",
              name: "删除",
              click: async () => {
                await this.webDb.deleteByKey('query_fixed', x.id)
                this.data.menu = this.data.menu.filter(c => c.id != x.id)
              }
            },

            {
              id: "ei39",
              name: "重命名",
              click: async () => {
                const name = await this.prompt.fire("请输入新名称", "");
                if (name !== null) {
                  if (name != "") {
                    const obj: any = await this.webDb.getByKey('query_fixed', x.id)
                    obj.name = name
                    await this.webDb.update('query_fixed', obj)
                    let index = this.data.menu.findIndex(c => c.id == x.id)
                    this.data.menu[index].name = name;
                  }
                } else {

                }
              }
            },
          ],

          click: async (e) => {
            this.router.navigate(['query', 'query_fixed', x.source, x.id]);
          }
        })
      })



      this.data.menu.push({ type: 'separator' })
      this.data.menu.push({
        id: 'cached',
        icon: "cached",
        name: '缓存',
        click: (e) => {
          this.AppData.setsource('local_cache')
          this.router.navigate(['query', 'local_cache']);
        }
      })

      this.data.menu.push({
        id: 'temporary_data',
        icon: "source",
        name: '临时数据',
        click: (e) => {
          this.AppData.setsource('temporary_data')
          this.router.navigate(['query', 'temporary_data']);
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
  }
  async is_on(e) {

    // this.data.menu.forEach(x=>{
    //   if(x.id==e.id) {
    //     // x.expanded=true;
    //   }else{
    //     x.expanded=false;
    //   }
    // })
    // const index= this.data.menu.findIndex(x=>x.id==e.id)
    // this.data.menu[index].expanded=true;

  }

  async openMenuSearch() {
    this.MenuSearch.open({
      position: {
        left: "8px",
        top: "8px"
      }
    });
  }
  async opensource() {
    let list = [];
    Object.keys(this.DbEvent.Events).forEach(x => {
      if (x == "temporary_file") return
      if (x == "local_cache") return
      if (x == "temporary_data") return
      let obj = {
        id: x,
        name: this.DbEvent.Configs[x].name
      };
      list.push(obj)
    })

    let obj: any = await this.DropDownMenu.open(list);
    if (obj) {
      this.data.menu_2_obj = this.data.menu_2.find(x => x.id == obj.id)


    }
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
          if (t.substring(0, 4) == "http") {
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
    let files_arr;
    if(window.showDirectoryPicker){
      const getFiles2 =async ()=>{
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

        await handleDirectoryEntry(dirHandle, out, dirHandle["name"]);
        return files_arr
      }
      files_arr=await getFiles2();
    }else{
      const getFiles=():any=>{
        return new Promise((r,j)=>{
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.webkitdirectory = true;  // 允许选择目录
          fileInput.multiple = true;  // 允许选择多个文件

          // 触发文件选择框
          fileInput.click();

          // 处理文件选择
          fileInput.addEventListener('change', function (event) {
            const files = (event.target as any).files;

            let arr=[];
            Array.from(files).forEach(x=>{
               let obj={}
               if (["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(x['name'].split(".")[1])) {
                obj['name']=x['name'];
                obj['id']=x['lastModified'];
                obj['path']=x['webkitRelativePath']
                obj['blob']=x
                arr.push(obj)
               }
            })
            r(arr)
          });
        })
      }
      files_arr=await getFiles();
    }

    const id = new Date().getTime();

    let list = await this.upload.subscribe_to_temporary_file_directory(files_arr, id)

    list.forEach(x => x.temporary_file_id = id);
    this.temporaryFile.data = [...this.temporaryFile.data, ...list]
    let chapters: any[] = [];
    this.data.menu.push({
      id,
      icon: "subject",
      name: files_arr[0].path.split("/")[0],
      click: e => {
        this.AppData.setsource('temporary_file')
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
  on1() {
    if (this.menu.mode_1 == 1) this.menu.mode_1 = 2
    else if (this.menu.mode_1 == 2) this.menu.mode_1 = 2
    else if (this.menu.mode_1 == 3) this.menu.mode_1 = 2
    else this.menu.mode_1 = 2;
  }
  on3fee(e) {
    this.menu.current_menu_pid = `${e.id}`;
    this.menu.current_menu_id = `${e.id}_history`
    if (this.DbEvent.Configs[e.id].type == "comics") {
      this.router.navigate(['query', 'history', e.id], {
        queryParams: {
          gh_data: 'reset',

        }
      });
    } else {
      this.router.navigate(['novel_query', 'history', e.id], {
        queryParams: {
          gh_data: 'reset',

        }
      });
    }


  }

}
