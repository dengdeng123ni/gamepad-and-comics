import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-local-module-page',
  templateUrl: './local-module-page.component.html',
  styleUrl: './local-module-page.component.scss'
})
export class LocalModulePageComponent {
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
      url: "https://github.com/dengdeng123ni/gamepad-and-comics/tree/main/js"
    }
  ]

  displayedColumns = [ 'enable','title',  'description'];
info=null;
is_subscribe=false;
  constructor(
    private zone: NgZone,
  ) {

    (window as any).electron.receiveMessage('steam_workshop_subscribe_module', async (event, message) => {
      if (message.type == "get_user_subscribe_items") {
        const res = message.data.items.map((x, i) => ({
          enable:false,
          title: x.title,
          description: x.description,
          index: i
        }));
        this.zone.run(()=>{
          this.list=res;
        })
      }
    })

    this.getPages();
  }

  change(n){

  }
  getPages() {
    this.sendMessage({ type: "get_user_subscribe_items" });
  }
  sendMessage = (data) => {
    (window as any).electron.sendMessage('steam_workshop_subscribe_module', data)
  }
  subscribe() {
    // this.is_subscribe=true;
    // this.sendMessage({ type: "subscribe", data: { publishedFileId: this.info.publishedFileId } });
  }

  unsubscribe(){
    // this.is_subscribe=false;
    // this.sendMessage({ type: "unsubscribe", data: { publishedFileId: this.info.publishedFileId } });

  }

}
