// @ts-nocheck
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbNovelsEventService {
  // window._gh_novels_register({
  //   id: "biquge",
  //   name: "笔趣阁[小说]",
  //   href: "https://www.biqgg.cc",
  //   is_cache: true,
  //   is_download: true,
  //   menu: [
  //     {
  //       id: 'search',
  //       icon: 'search',
  //       name: '搜索',
  //       query: {
  //         type: 'search',
  //         page_size: 30
  //       }
  //     }
  //   ],
  // }, {

  //   getDetail: async (novel_id) => {

  //     const res = await window._gh_get_html(decodeURIComponent(window.atob(novel_id)), {
  //       "headers": {
  //         "accept": "application/json, text/plain, */*",
  //         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  //         "content-type": "application/json;charset=UTF-8"
  //       },
  //       "body": null,
  //       "method": "GET"
  //     });
  //     const text = await res.text();
  //     var parser = new DOMParser();
  //     var doc = parser.parseFromString(text, 'text/html');

  //     let obj = {
  //       id: novel_id,
  //       cover: "",
  //       title: "",
  //       author: "",
  //       intro: "",
  //       href: decodeURIComponent(window.atob(novel_id)),
  //       category: "",
  //       chapters: [

  //       ],
  //     }

  //     obj.cover = doc.querySelector("body .cover img").src;
  //     obj.title = doc.querySelector(".info h1").textContent.trim();
  //     obj.intro = doc.querySelector(".info dd").textContent.trim();
  //     obj.author = doc.querySelector(".info > div.small > span:nth-child(1)").textContent.trim();
  //     const nodes = doc.querySelectorAll(".listmain dd");
  //     for (let index = 0; index < nodes.length; index++) {
  //       const x = nodes[index];
  //       if (!x.className) {
  //         obj.chapters.push(
  //           {
  //             id: window.btoa(encodeURIComponent(`https://www.biqgg.cc` + x.children[0].getAttribute("href"))),
  //             title: x.children[0].textContent.trim()
  //           }
  //         )
  //       }

  //     }

  //     return obj
  //   },
  //   getPages: async (chapter_id) => {

  //     const res = await window._gh_fetch(decodeURIComponent(window.atob(chapter_id)), {
  //       "headers": {
  //         "accept": "application/json, text/plain, */*",
  //         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  //         "content-type": "application/json;charset=UTF-8"
  //       },
  //       "body": null,
  //       "method": "GET"
  //     });
  //     const text = await res.text();

  //     var parser = new DOMParser();
  //     var doc = parser.parseFromString(text, 'text/html');
  //     const text1 = doc.querySelector("#chaptercontent").innerHTML
  //     let arr = text1.split("<br><br>");
  //     arr.pop();
  //     arr.pop();

  //     return arr.map(x => ({ content: x }))
  //   },
  //   UrlToDetailId: async (id) => {
  //     const obj = new URL(id);
  //     if (obj.host == "www.biqgg.cc") {
  //       return window.btoa(encodeURIComponent(id))
  //     } else {
  //       return null
  //     }
  //   },
  //   Search: async (obj) => {
  //     const res = await window._gh_fetch(`https://www.biqgg.cc/user/search.html?q=${obj.keyword}`, {
  //       "headers": {
  //         "accept": "application/json, text/plain, */*",
  //         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  //         "content-type": "application/json;charset=UTF-8"
  //       },
  //       "body": null,
  //       "method": "GET"
  //     });
  //     const json = await res.json();
  //     let data = [];
  //     for (let index = 0; index < json.length; index++) {
  //       const x = json[index];
  //       data.push({
  //         id: window.btoa(encodeURIComponent(`https://www.biqgg.cc` + x.url_list)),
  //         title: x.articlename,
  //         cover: x.url_img
  //       })
  //     }
  //     return data
  //   },
  // });
  constructor() { }
}
