import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import CryptoJS from 'crypto-js'
import { DomSanitizer } from '@angular/platform-browser';
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class MessageFetchService {
  _data_proxy_response: any = {};
  _data_proxy_request: any = {};
  caches!: Cache;

  _blob_urls={

  }
  constructor(private sanitizer: DomSanitizer) {
    window._gh_fetch = this.fetch;
    window._gh_getHtml = this.getHtml;
    window._gh_execute_eval = this.execute_eval;

  }
  async init() {
    this.caches = await caches.open('assets');
  }
  fetch = async (url: RequestInfo | URL, init: RequestInit, option?: {
    proxy?: string
  }): Promise<Response> => {
    const req = new Request(url, init);
    let body = null;
    if (req.body) body = await this.readStreamToString(req.body)
    const b64_to_utf8 = (str: string) => {
      return JSON.parse(decodeURIComponent(escape(window.atob(str))));
    }
    let id = ''
    let bool = true;
    if (option && option.proxy) {

      id = CryptoJS.MD5(JSON.stringify({
        type: "website_proxy_request",
        proxy_request_website_url: option.proxy,
        proxy_response_website_url: window.location.origin,
        http: {
          url: url,
          option: {
            "headers": init.headers,
            "body": body,
            "method": init.method
          }
        }
      })).toString().toLowerCase()
      if (!this._data_proxy_request[id]) {
        this._data_proxy_request[id] = true;
        const send=()=>{
          window.postMessage({
            id: id,
            type: "website_proxy_request",
            proxy_request_website_url: option.proxy,
            proxy_response_website_url: window.location.origin,
            http: {
              url: url,
              option: {
                "headers": init.headers,
                "body": body,
                "method": init.method
              }
            }
          });


        }
        send();
        setTimeout(()=>{
          if (!this._data_proxy_response[id]) {
            send();
          }
        },10000)
        setTimeout(()=>{
          if (!this._data_proxy_response[id]) {
            send();
          }
        },20000)
      }

    } else {
      id = CryptoJS.MD5(JSON.stringify({
        type: "pulg_proxy_request",
        proxy_response_website_url: window.location.origin,
        http: {
          url: url,
          option: {
            "headers": init.headers,
            "body": body,
            "method": init.method
          }
        }
      })).toString().toLowerCase()
      if (!this._data_proxy_request[id]) {
        this._data_proxy_request[id] = true;
        const send=()=>{
          window.postMessage({
            id: id,
            type: "pulg_proxy_request",
            proxy_response_website_url: window.location.origin,
            http: {
              url: url,
              option: {
                "headers": init.headers,
                "body": body,
                "method": init.method
              }
            }
          });
        }
        send();
        setTimeout(()=>{
          if (!this._data_proxy_response[id]) {
            send();
          }
        },20000)
      }

    }
    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            r(this._data_proxy_response[id].clone())
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        bool = false;
        r(new Response(""))
        j(new Response(""))
        this._data_proxy_request[id]=undefined;
      }, 40000)

    })
  }

  getHtml = async (url: RequestInfo | URL,
  ): Promise<Response> => {
    let id = ''
    let bool = true;
    id = CryptoJS.MD5(JSON.stringify({
      type: "website_proxy_request_html",
      proxy_request_website_url: url,
      proxy_response_website_url: window.location.origin
    })).toString().toLowerCase()
    if (!this._data_proxy_request[id]) {
      this._data_proxy_request[id] = true;

      window.postMessage({
        id: id,
        type: "website_proxy_request_html",
        proxy_request_website_url: url,
        proxy_response_website_url: window.location.origin
      });
    }


    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            r(this._data_proxy_response[id].clone())
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()
      setTimeout(() => {
        bool = false;
        r(new Response(""))
        j(new Response(""))
      }, 30000)
    })
  }

  execute_eval=async (url,javascript)=>{
    const id = CryptoJS.MD5(JSON.stringify({
      type: "website_request_execute_eval",
      proxy_request_website_url: url,
      proxy_response_website_url: window.location.origin
    })).toString().toLowerCase()

    window.postMessage({
      id: id,
      type: "website_request_execute_eval",
      proxy_request_website_url: url,
      proxy_response_website_url: window.location.origin,
      javascript:javascript
    });
    let bool = true;
    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            r(this._data_proxy_response[id])
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        bool = false;
        r(new Response(""))
        j(new Response(""))
        this._data_proxy_request[id]=undefined;
      }, 40000)

    })
  }


  async readStreamToString(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    let result = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result.push(Array.from(value));
    }
    return result;
  }

  cacheFetch = async (url: RequestInfo | URL): Promise<Response> => {
    if (!this.caches) return await fetch(url)
    const res = await this.caches.match(url)
    if (res) {
      return res
    } else {
      const response = await fetch(url)
      const request = new Request(url);
      if (response.ok) await this.caches.put(request, response);
      return await fetch(url)
    }
  }

  cacheFetchBlobUrl = async (url:string): Promise<string> => {
    const id=window.btoa(encodeURIComponent(url))
    if(this._blob_urls[id]) return this._blob_urls[id]
    if (!this.caches) {
      const res =await fetch(url)
      const blob = await res.blob();
      let bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      bloburl=bloburl.changingThisBreaksApplicationSecurity;
      this._blob_urls[id]=bloburl;
      return bloburl
    }
    const res = await this.caches.match(url)
    if (res) {
      const blob = await res.blob();
      let bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      bloburl=bloburl.changingThisBreaksApplicationSecurity;
      this._blob_urls[id]=bloburl;
      return bloburl
    } else {
      const response = await fetch(url)
      const request = new Request(url);
      if (response.ok) await this.caches.put(request, response);
      const res =await fetch(url)
      const blob = await res.blob();
      let bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      bloburl=bloburl.changingThisBreaksApplicationSecurity;
      this._blob_urls[id]=bloburl;
      return bloburl
    }
  }


}
