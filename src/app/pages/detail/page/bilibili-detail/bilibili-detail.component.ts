import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';

@Component({
  selector: 'app-bilibili-detail',
  templateUrl: './bilibili-detail.component.html',
  styleUrls: ['./bilibili-detail.component.scss']
})
export class BilibiliDetailComponent {
  constructor(public i18n:I18nService){
setTimeout(() => {
  this.init();
}, 3000);
  }
  comics:any = {
    cover:{
      src:""
    },
    title:"",
    chapter:{
      title:""
    },
    chapters:[]
  };
  async init() {
    const b: any = await this.getDetail();
    const json = await b.json();
    console.log(json.data);

    const data=json.data;
    const comics = {
      cover:data.vertical_cover,
      title:data.title,
      author:data.author_name.toString(),
      intro:data.evaluate,
      chapters:data.ep_list.reverse()
    };
    this.comics=comics;
   console.log(json);


  }
//   <div class="img" (click)="continue($event)" >
//   <img loading="lazy" [src]="comics.cover" alt="">
// </div>
// <div class="info">
//   <div class="title">{{comics.title}}</div>
//   <div class="author">{{comics.author}}</div>
//   <div class="intro">
//     {{comics.intro}}
//   </div>
// </div>
back() {
  // this.router.navigate(['/'])
}
continue(e) {
  // this.router.navigate(['/reader', this.comics.id])
}
on($event,n){

}
  getDetail() {

    return new Promise((r, j) => {


      window.addEventListener("message", function (event) {
        if (event.data.type == "proxy_response") {
          let rsponse = event.data.data;
          const readableStream = new ReadableStream({
            start(controller) {
              for (const data of rsponse.body) {
                controller.enqueue(Uint8Array.from(data));
              }
              controller.close();
            },
          });
          delete rsponse.body;
          const headers = new Headers();
          rsponse.headers.forEach(x => {
            headers.append(x.name, x.value);
          })
          rsponse.headers = headers;
          // readableStream.json()
          r(new Response(readableStream, rsponse))
        }
      }, false);
      window.postMessage({
        type: "website_proxy_request",
        proxy_request_website_url: "https://manga.bilibili.com/",
        proxy_response_website_url: "http://localhost:3200/bilibili_detail/5647710",
        http: {
          url: "https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web",
          option: {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": JSON.stringify({ comic_id: 25966 }),
            "method": "POST"
          }
        }
      }, '*')
    })

  }
}

