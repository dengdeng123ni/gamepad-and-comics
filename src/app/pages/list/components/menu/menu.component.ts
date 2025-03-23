import { Component, NgZone } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UploadService } from './upload.service';
import { AppDataService, ArchiveControllerService, ContextMenuControllerService, ContextMenuEventService, DbComicsEventService, DropDownMenuService, IndexdbControllerService, ListMenuControllerService, ListMenuEventService, LocalCachService, NotifyService, PromptService, PulgService, TemporaryFileService } from 'src/app/library/public-api';
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
import { ReplaceChannelPageService } from '../replace-channel-page/replace-channel-page.service';
import { MobileWebQrcodeService } from '../mobile-web-qrcode/mobile-web-qrcode.service';
import { LanguageSettingsService } from '../language-settings/language-settings.service';
import { ArchivePageService } from '../archive-page/archive-page.service';
import { PdfToImageService } from '../../services/pdf-to-image.service';
import { WebpageOfflineService } from '../../services/webpage-offline.service';
import { ElectronService } from 'src/app/library/electron.service';
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
    this.data.currend_read_comics_id=null;
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

  sourceChange$ = null;

  constructor(
    public data: DataService,
    public current: CurrentService,
    public upload: UploadService,
    public temporaryFile: TemporaryFileService,
    public AppData: AppDataService,
    public DbComicsEvent: DbComicsEventService,
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
    public PdfToImage: PdfToImageService,
    public SoundEffects: SoundEffectsService,
    public AboutSoftware: AboutSoftwareService,
    public PlugInInstructions: PlugInInstructionsService,
    public ListMenuController: ListMenuControllerService,
    public ReplaceChannelPage: ReplaceChannelPageService,
    public ArchiveController: ArchiveControllerService,
    public LanguageSettings: LanguageSettingsService,
    public MobileWebQrcode: MobileWebQrcodeService,
    public UrlUsageGuide: UrlUsageGuideService,
    public ArchivePage: ArchivePageService,
    public PageTheme: PageThemeService,
    public Notify: NotifyService,
    public prompt: PromptService,
    public ListMenuEvent: ListMenuEventService,
    public WebpageOffline: WebpageOfflineService,
    public Electron:ElectronService,
    private zone: NgZone
  ) {

    // this.ControllerSettings.open();
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {

      }
      if (event instanceof NavigationEnd) {
      }
    })
    current.updateMenu().subscribe(async (x) => {

      await this.menu.get()
      this.data.menu = [];
      this.init();
    })

    ContextMenuEvent.register('_gh_settings',
      {
        on: async (e: any) => {
          e.click()
        },
        menu: [

          // {

          //   id: "ooeo",
          //   name: "离线",
          //   submenu: [
          //     {
          //       id: "javasciprt",
          //       name: "进入",
          //       click: () => {
          //         this.WebpageOffline.enter()
          //       }
          //     },
          //     {
          //       id: "ope3",
          //       name: "退出",
          //       click: () => {
          //         this.WebpageOffline.exit();
          //       }
          //     },

          //   ]
          // },
          {

            id: "ooeo",
            name: "其他",
            submenu: [
              {
                id: "ope3123",
                name: "PDF转图片",
                click: () => {
                  this.PdfToImage.to();
                }
              },
              // {
              //   id: "ope321",
              //   name: "手机版下载",
              //   click: () => {
              //     window.open(`https://github.com/dengdeng123ni/gamepad-and-comics/releases/tag/comics`, '_blank')
              //   }
              // },
              // {
              //   id: "ope321",
              //   name: "打开局域网连接",
              //   click: () => {
              //     if (AppData.local_network_url) {
              //       window.open(`${AppData.local_network_url}`, '_blank')
              //     } else {
              //       this.Notify.messageBox("ERROR")
              //     }
              //   }
              // },
              // {
              //   id: "ope321",
              //   name: "局域网二维码",
              //   click: () => {
              //     if (AppData.local_network_url) {
              //       this.MobileWebQrcode.open();
              //     } else {
              //       this.Notify.messageBox("ERROR")
              //     }
              //   }
              // },
              // {
              //   id: "ope321",
              //   name: "Github 在线链接",
              //   click: () => {
              //     window.open("https://dengdeng123ni.github.io/gamepad-and-comics/", '_blank')
              //   }
              // },
              // {
              //   id: "ope3",
              //   name: "专用浏览器扩展插件",
              //   click: () => {
              //     this.PlugInInstructions.open({});
              //   }
              // },
              // {
              //   id: "ope3123",
              //   name: "fetch添加请求头",
              //   click: () => {

              //   }
              // },
              // {

              //   id: "oo1eo",
              //   name: "功能设置",
              //   click: () => {

              //   }
              // },
            ]
          },
          {
            id: "ope3243241",
            name: "存档",
            click: () => {
              this.ArchivePage.open()
            }
          },
          {
            id: "ope",
            name: "language",
            click: () => {
              this.LanguageSettings.open()
            }
          },
          {
            id: "ope",
            name: "控制器设置",
            click: () => {
              ControllerSettings.open()
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
            id: "javasciprt",
            name: "返回主菜单",
            click: () => {
              Electron.close();
              Electron.openMainMenu();
            }
          },
          // {
          //   id: "ope32",
          //   name: "通道替换",
          //   click: () => {
          //     this.ReplaceChannelPage.open();
          //   }
          // },
          // {
          //   id: "ope",
          //   name: "关于软件",
          //   click: () => {
          //     AboutSoftware.open({})
          //   }
          // }
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
              window.open(this.DbComicsEvent.Configs[e].href)
            }
          }
        ]
      })

    this.init();

    this.sourceChange$ = this.AppData.sourceChange().subscribe((x: any) => {
      if (this.menu.is_init) return
      if (x.id == "temporary_file") return
      if (x.id == "local_cache") return
      if (x.id == "temporary_data") return
      this.data.menu_2_obj = this.data.menu_2.find(x => x.id == this.AppData.source)
      this.menu.is_init = true;

    })



  }
  isValidIPv4(ip) {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    return ipv4Regex.test(ip);
  }
  // favorite_border
  init(source?) {

    this.data.menu_2 = [];
    this.data.menu = [];
    if (!source) source = this.menu.source;
    if (!source) source = this.AppData.source;

    if (this.data.menu.length == 0) {
      Object.keys(this.DbComicsEvent.Events).forEach((x) => {
        if (x == "temporary_file") return
        if (x == "local_cache") return
        if (x == "temporary_data") return

        let obj = {
          id: x,
          icon: "folder_open",
          name: this.DbComicsEvent.Configs[x].name,
          submenu: [],
          expanded: true
        };
        if (this.DbComicsEvent.Configs[x].menu) {
          for (let index = 0; index < this.DbComicsEvent.Configs[x].menu.length; index++) {
            const j122 = this.DbComicsEvent.Configs[x].menu[index]
            let obj1 = {
              ...j122,
              click: () => {
                this.menu.current_menu_pid = x ? `${x}` : j122.id;
                this.menu.current_menu_id = x ? `${x}_${j122.id}` : j122.id;
                if (x) this.AppData.setsource(x)


                if (j122.query.type == "choice") {

                  this.router.navigate(['/query', 'choice', x, j122.id]);
                }
                if (j122.query.type == "double_choice") {
                  this.router.navigate(['/query', 'double_choice', x, j122.id]);
                }

                if (j122.query.type == "search") {
                  this.router.navigate(['/query', 'search', x, j122.id]);
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
        if (this.DbComicsEvent.Configs[x].type == "comics") {
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
      if (['local_cache', 'temporary_file', 'temporary_data'].includes(source)) {
        this.data.menu_2_obj = this.data.menu_2[0]

      } else {
        this.data.menu_2_obj = this.data.menu_2.find(x => x.id == this.menu.source)
        // const index= this.data.menu.findIndex(x=>x.id==this.AppData.source)
        // this.data.menu[index].expanded=true;
      }
      if (!this.data.menu_2_obj) this.data.menu_2_obj = this.data.menu_2[0]
      if (this.data.menu_2.length == 0) this.data.menu_2_obj = null

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
      let bool = true;
      this.menu.query_fixed.forEach(x => {
        if (this.data.menu_2_obj && x.source == this.data.menu_2_obj.id) {
          if (this.menu.query_fixed.length && bool) {
            bool = false;
            this.data.menu.push({ type: 'separator' })
          }
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
        }
      })
      let bool2 = true;
      this.menu.favorites_menu.forEach(x => {
        if (this.data.menu_2_obj && x.source == this.data.menu_2_obj.id) {
          if (this.menu.favorites_menu.length && bool2) {
            bool2 = false;
            this.data.menu.push({ type: 'separator' })
          }
          this.data.menu.push({
            id: x.id,
            icon: "favorite_border",
            name: x.name,
            content_menu: [
              {
                id: "delete",
                name: "删除",
                click: async () => {
                  await this.webDb.deleteByKey('favorites_menu', x.id)
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
                      const obj: any = await this.webDb.getByKey('favorites_menu', x.id)
                      obj.name = name
                      await this.webDb.update('favorites_menu', obj)
                      let index = this.data.menu.findIndex(c => c.id == x.id)
                      this.data.menu[index].name = name;
                    }
                  } else {

                  }
                }
              },
            ],

            click: async (e) => {
              this.router.navigate(['query', 'favorites', x.source, x.id], {
                queryParams: {
                  gh_data: 'reset',

                }
              });
            }
          })
        }
      })
      Object.keys(this.ListMenuEvent.Configs).forEach(x => {
        if (this.ListMenuEvent.Configs[x].target == "separate") {
          this.data.menu.push({ type: 'separator' })
          this.ListMenuEvent.Content[x].forEach(c => {
            this.data.menu.push(
              {
                ...c,
                click: () => {
                  this.menu.current_menu_pid = `${c.id}`;
                  this.menu.current_menu_id = `${c.id}_custom`
                  this.router.navigate(['query', 'custom',x, c.id], {
                    queryParams: {
                      gh_data: 'reset',
                    }
                  });
                }
              }
            )
          })
        }
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

      Object.keys(this.ListMenuEvent.Configs).forEach(x => {
        if (this.ListMenuEvent.Configs[x].target == "built_in") {
          this.ListMenuEvent.Content[x].forEach(c => {
            this.data.menu.push(
              {
                ...c,
                click: () => {
                  this.menu.current_menu_pid = `${c.id}`;
                  this.menu.current_menu_id = `${c.id}`
                  this.router.navigate(['query', 'custom',x, c.id]);
                }
              }
            )
          })
        }
      })


      this.data.menu.push({ type: 'separator' })
      this.data.menu.push({
        id: 'add',
        icon: "add",
        name: '打开文件夹',
        disabled: document.body.getAttribute('replace_channel') == 'true' ? true : false,
        click: (e) => {
          this.openTemporaryFile();
        }
      })
      if (this.menu.temporary_file.length) {
        this.menu.temporary_file.forEach(x => {
          this.data.menu.push({
            id: x.id,
            icon: "subject",
            name: x.name,
            click: e => {
              this.AppData.setsource('temporary_file')
              this.router.navigate(['query', 'temporary_file', 'temporary_file', e.id]);
            }
          })
        })
      }

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
    Object.keys(this.DbComicsEvent.Events).forEach(x => {
      if (x == "temporary_file") return
      if (x == "local_cache") return
      if (x == "temporary_data") return
      let obj = {
        id: x,
        name: this.DbComicsEvent.Configs[x].name
      };
      list.push(obj)
    })

    let obj: any = await this.DropDownMenu.open(list);
    if (obj) {
      this.data.menu_2_obj = this.data.menu_2.find(x => x.id == obj.id)
      this.menu.source=obj.id;
      this.init(obj.id)
      this.menu.post();

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
    if (this.sourceChange$) this.sourceChange$.unsubscribe();
  }
  cc() {
    this.pulg.openFile();

  }
  async openTemporaryFile() {
    let files_arr;
    if (window.showDirectoryPicker) {
      const getFiles2 = async () => {
        const dirHandle = await (window as any).showDirectoryPicker();
        let files_arr: { id: number; blob: any; path: string; name: any; }[] = []
        let date = new Date().getTime();
        const handleDirectoryEntry = async (dirHandle: any, out: { [x: string]: {}; }, path: any) => {
          if (dirHandle.kind === "directory") {
            for await (const entry of dirHandle.values()) {
              if (entry.kind === "file") {
                if (["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(entry.name.split(".")[1])) {
                  out[entry.name] = { id: date, blob: entry, path: `${path}/${entry.name}` };
                  files_arr.push({ id: date, blob: entry, path: `${path}/${entry.name}`, name: entry.name })
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
            out[entry.name] = { id: date, blob: entry, path: `${path}/${entry.name}` };
            files_arr.push({ id: date, blob: entry, path: `${path}/${entry.name}`, name: entry.name })
            date++;
          }
        }
        const out = {};

        await handleDirectoryEntry(dirHandle, out, dirHandle["name"]);
        return files_arr
      }
      files_arr = await getFiles2();
    } else {
      const getFiles = (): any => {
        return new Promise((r, j) => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.webkitdirectory = true;  // 允许选择目录
          fileInput.multiple = true;  // 允许选择多个文件

          // 触发文件选择框
          fileInput.click();

          // 处理文件选择
          fileInput.addEventListener('change', function (event) {
            const files = (event.target as any).files;

            let arr = [];
            Array.from(files).forEach(x => {
              let obj = {}
              if (["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(x['name'].split(".")[1])) {
                obj['name'] = x['name'];
                obj['id'] = x['lastModified'];
                obj['path'] = x['webkitRelativePath']
                obj['blob'] = x
                arr.push(obj)
              }
            })
            r(arr)
          });
        })
      }
      files_arr = await getFiles();
    }

    const id = new Date().getTime();

    let list = await this.upload.subscribe_to_temporary_file_directory(files_arr, id)

    list.forEach(x => x.temporary_file_id = id);
    this.temporaryFile.data = [...this.temporaryFile.data, ...list]
    // console.log(files_arr);

    let chapters: any[] = [];
    // this.data.menu.push({
    //   id,
    //   icon: "subject",
    //   name: files_arr[0].path.split("/")[0],
    //   click: e => {
    //     this.AppData.setsource('temporary_file')
    //     this.router.navigate(['query', 'temporary_file', 'temporary_file', e.id]);
    //   }
    // })
    this.webDb.update('temporary_file', {
      id: id,
      name: files_arr[0].path.split("/")[0]
    })
    for (let index = 0; index < this.temporaryFile.data.length; index++) {
      const x = this.temporaryFile.data[index];
      chapters = [...chapters, ...x.chapters];
    }
    this.temporaryFile.chapters = chapters;
    this.temporaryFile.files = [...this.temporaryFile.files, ...files_arr];
    window._gh_menu_update();
  }

  on3fee(e) {
    this.menu.current_menu_pid = `${e.id}`;
    this.menu.current_menu_id = `${e.id}_history`
    if (this.DbComicsEvent.Configs[e.id].type == "comics") {
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
