import { Component } from '@angular/core';
import { CacheControllerService, ContextMenuControllerService, ContextMenuEventService, PromptService, PulgService } from 'src/app/library/public-api';
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
    public ContextMenuController: ContextMenuControllerService,
    private _snackBar: MatSnackBar,
    public prompt:PromptService,
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
                  const name = url.split("/").at(-1)
                  const blob = await res.blob();
                  await this.scriptCache(blob, name, {
                    'Remote-Url': url
                  })
                  this._snackBar.open("加载脚本成功,页面刷新加载脚本", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
                  this.list = await this.getAll();
                }
              } else {

              }
            }
          },
          // {
          //   id: "_javasciprt",
          //   name: "内置脚本",
          //   click: () => {

          //   }
          // },

        ]
      })
  }
   restart=async(n)=> {
    const list = await this.webCh.keys('script')

    const r = list.find(x => x.url == n.url)
    const res = await window._gh_fetch(n.remote_url)
    const blob = await res.blob();

    await this.webCh.put('script',n.url, new Response(blob));
    this._snackBar.open("更新成功", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }
  async change(n) {

    setTimeout(async () => {
      const list = await this.webCh.keys('script')
      const r = list.find(x => x.url == n.url)
      r.headers.set('Disable', n.disable.toString())

      const response = await this.webCh.match('script',r.url)
      await this.webCh.put('script',n.url, response);
      if(n.disable){
        const res = await this.webCh.match('script',r.url)
        const blob=await res.blob()
        await this.pulg.loadBlodJs(blob)
        this.current._updateMenu();
      }
    })


  }
  async on3(e) {
    this.type = e.type;
    if (e.type == "github") {
      this._snackBar.open(`开始访问${e.url}`, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
      this.list2 = await this.getGitHubFile(e.url);
    }

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
    await this.scriptCache(blob, name)
    this._snackBar.open("加载脚本成功,页面刷新加载脚本", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
    this.list = await this.getAll();
  }
  async getAll() {
    const list = await this.webCh.keys('script')
    let arr = []
    for (let index = 0; index < list.length; index++) {
      const x = list[index];
      const name = decodeURIComponent(window.atob(x.headers.get('File-Name')))
      const date = x.headers.get('Cache-Timestamp')
      const disable = x.headers.get('Disable') == "true" ? true : false;
      const remote_url = x.headers.get('Remote-Url')

      const url = x.url
      arr.push({ index: index + 1, name, disable, url,remote_url, date: parseInt(date) })
    }
    return arr.sort((a, b) => a.date - b.date)
  }

  async init() {

    this.list = await this.getAll();
  }

  async openFile() {
    const files = await (window as any).showOpenFilePicker()
    const blob = await files[0].getFile();
    await this.pulg.loadBlodJs(blob)
    await this.scriptCache(blob, blob.name)
    this._snackBar.open("加载脚本成功,页面刷新加载脚本", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }
  async scriptCache(blob, name, obj = {}) {
    const response = new Response(blob,{
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Timestamp': new Date().getTime().toString(),
        'File-Name': window.btoa(encodeURIComponent(name)),
        'Disable': 'true',
        ...obj
      }
    });
    const request = `http://localhost:7700/script/${new Date().getTime()}`;
    await this.webCh.put('script',request, response);
  }



  async preview(url) {
    if (url.substring(7, 21) == "localhost:7700") {
      const res = await this.webCh.match('script',url)
      const text = await res.text();
      this.text = text;
      return
    }
    const res = await window._gh_fetch(url)
    const text = await res.text();
    this.text = text;

  }
  async del(url) {
    await this.pulg.delete(url)
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
    const url = await this.pulg.get(e.url);

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
