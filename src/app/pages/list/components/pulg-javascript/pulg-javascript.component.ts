import { Component } from '@angular/core';
import { CacheControllerService, ContextMenuControllerService, ContextMenuEventService, IndexdbControllerService, NotifyService, PromptService, PulgService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentService } from '../../services/current.service';

declare let window: any;
@Component({
  selector: 'app-pulg-javascript',
  templateUrl: './pulg-javascript.component.html',
  styleUrl: './pulg-javascript.component.scss'
})
export class PulgJavascriptComponent {
  list = [];


  list2 = [];
  type = "load";

  text = "";


  bbb = [
    {
      type: "load",
      name: "已加载脚本"
    },
    {
      type: "github",
      name: "dengdeng123ni github",
      url: "https://github.com/dengdeng123ni/gamepad-and-comics-v3/tree/main/js"
    }
  ]

  displayedColumns = ['position', 'name',  'weight', 'update','operate'];

  constructor(public pulg: PulgService, public data: DataService,
    public current:CurrentService,
    private webCh: CacheControllerService,
    public webDb:IndexdbControllerService,
    public ContextMenuController: ContextMenuControllerService,
    private _snackBar: MatSnackBar,
    public prompt:PromptService,
    public Notify:NotifyService,
    public ContextMenuEvent: ContextMenuEventService
  ) {
    this.init();





    ContextMenuEvent.register('pulg_javascript_add',
      {
        on: async (e: any) => {
          e.click()
        },
        menu: [

          {
            id: "javasciprt",
            name: "本地文件",
            click: () => {
              this.add();
            }
          },
          {
            id: "github",
            name: "远程脚本",
            click: async () => {
              const url = await this.prompt.fire("请输入URL", "");
              if (url !== null) {
                if (url != "") {
                  const res = await window._gh_fetch(url)
                  const name = window.decodeURI(url.split("/").at(-1))
                  const blob = await res.blob();
                  await this.pulg.scriptCache(blob, name, {
                    'url': url
                  })
                  this.Notify.messageBox("加载脚本成功,页面刷新加载脚本", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
                  this.list = await this.getAll();
                }
              } else {

              }
            }
          },
          {
            id: "_javasciprt",
            name: "内置脚本",
            click: () => {

            }
          },

        ]
      })
  }
   restart=async(n)=> {
    const res = await window._gh_fetch(n.url)
    const blob = await res.blob();
    await this.webCh.put('script',n.src, new Response(blob));

    this.Notify.messageBox("更新成功", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }
  async change(n) {

    setTimeout(async () => {
       const res:any=await this.webDb.getByKey('script',n.id)
       res.is_enabled=n.is_enabled;
       await this.webDb.update('script',res)
    })
  }


  onMenu(e) {
    const node = document.querySelector("[menu_key=pulg_javascript_add]")
    const p = node.getBoundingClientRect();
    this.ContextMenuController.openMenu(node, p.left, p.bottom)
  }

  async getGitHubFile(url) {
    const list = await window._gh_execute_eval(url, `
      (async function () {
  const nodes=document.querySelectorAll(".react-directory-row [colspan='2'] a")
  let list=[];
  for (let index = 0; index < nodes.length; index++) {
    let obj={};
    const name = nodes[index].textContent
    if(name.substring(name.length-3,name.length)=='.js'){
        obj['name']=name
        obj['href']=nodes[index].href
        let arr=nodes[index].href.split("/")
        arr[2]= "raw.githubusercontent.com"
        arr[5]="refs/heads";
        obj['download']=arr.join("/")
        list.push(obj)
    }
  }
  return list
})()

      `)
    return list
  }
  async loadJs(url, name) {
    const res = await window._gh_fetch(url)
    const blob = await res.blob()
    await this.pulg.loadBlodJs(blob)
    await this.pulg.scriptCache(blob, name)
    this.Notify.messageBox("加载脚本成功,页面刷新加载脚本", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
    this.list = await this.getAll();
  }
  async getAll() {
    const list:any = await this.webDb.getAll('script')
    list.forEach((x,i)=>{
      x.index=i
    })
    return list.sort((a, b) => a.date - b.date)
  }

  async init() {

    this.list = await this.getAll();
  }

  async openFile() {
    const files = await (window as any).showOpenFilePicker()
    const blob = await files[0].getFile();
    await this.pulg.loadBlodJs(blob)
    await this.pulg.scriptCache(blob, blob.name)
    this.Notify.messageBox("加载脚本成功,页面刷新加载脚本", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }

  async del(n) {
    this.webCh.delete('script',n.src);
    this.webDb.deleteByKey('script',n.id)
    this.list = await this.getAll();
  }
  async add() {
    await this.openFile();
    this.data.menu = [];
    this.data.is_init_free = false;
    setTimeout(() => {
      this.data.is_init_free = true;
    }, 100)
    this.list = await this.getAll();
  }
  async on(e) {
    const url = await this.pulg.get(e.src);

    const download = (filename, url) => {
      let a = document.createElement('a');
      a.download = filename;
      a.href = url;
      document.body.appendChild(a);
      a.click(); // 触发a标签的click事件
      document.body.removeChild(a);
    }
    download(e.name, url)
  }

  open() {
  }
}
