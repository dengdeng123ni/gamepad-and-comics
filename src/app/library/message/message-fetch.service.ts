import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import CryptoJS from 'crypto-js'
import { DomSanitizer } from '@angular/platform-browser';
import { CacheControllerService, ReplaceChannelEventService } from '../public-api';
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class MessageFetchService {
  _data_proxy_response: any = {};
  _data_proxy_request: any = {};

  _blob_urls = {

  }
  constructor(private sanitizer: DomSanitizer,
    private webCh: CacheControllerService,
    public ReplaceChannelEvent: ReplaceChannelEventService
  ) {
    window._gh_fetch = this.fetch;
    window._gh_get_html = this.getHtml;
    window._gh_execute_eval = this.execute_eval;
    window.CryptoJS = CryptoJS;
    // window._gh_new_page = this.new_page;
    this.ReplaceChannelEvent.register({
      id: 'plugins',
      name: '插件'
    }, {
      sendMessage: this.getProxyRequestLocal,
      getAll: this.getAllBrowserClient
    })

    this.ReplaceChannelEvent.register({
      id: 'https',
      name: '插件'
    }, {
      sendMessage: async e => {
        const data = await fetch(`${window.location.origin}/api/local/send`, {
          method: 'POST', // 指定请求方法为 POST
          headers: {
            'Content-Type': 'application/json', // 指定请求体的格式为 JSON
          },
          body: JSON.stringify(e), // 将数据序列化为 JSON 字符串
        })
        const res = await data.json();
        return res
      },
      getAll: async e => {
        const data = await fetch(`${window.location.origin}/api/local/getAll`)
        const res = await data.json();
        return res
      },
    })

  }
  async init() {
  }
  fetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!init) {
      init = {
        "headers": {
        },
        "body": null,
        "method": "GET"
      }
    }

    const req = new Request(url, init);
    let body = null;
    if (req.body) body = await this.readStreamToString(req.body)
    const b64_to_utf8 = (str: string) => {
      return JSON.parse(decodeURIComponent(escape(window.atob(str))));
    }
    let id = ''

    if (init && (init as any).proxy) {

      id = CryptoJS.MD5(JSON.stringify({

        type: "website_proxy_request",
        target_website: (init as any).proxy,
        target: 'background',
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
        const send = () => {
          window.postMessage({
            id: id,
            type: "website_proxy_request",
            target: 'background',
            target_website: (init as any).proxy,
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
        setTimeout(() => {
          if (!this._data_proxy_response[id]) {
            send();
          }
        }, 10000)
        setTimeout(() => {
          if (!this._data_proxy_response[id]) {
            send();
          }
        }, 20000)
      }

    } else {
      id = CryptoJS.MD5(JSON.stringify({
        type: "pulg_proxy_request",
        target: 'background',
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
        const send = () => {
          window.postMessage({
            id: id,
            type: "pulg_proxy_request",
            target: 'background',
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
        setTimeout(() => {
          if (!this._data_proxy_response[id]) {
            send();
          }
        }, 20000)
      }

    }
    let bool = true;
    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            bool = false;
            r(this._data_proxy_response[id].clone())
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        if (bool) {
          bool = false;
          r(new Response())
          j(new Response())
        }
        this._data_proxy_request[id] = undefined;
      }, 40000)
    })
  }

  getHtml = async (url: RequestInfo | URL,
  ): Promise<Response> => {
    let id = ''
    id = CryptoJS.MD5(JSON.stringify({
      type: "get_website_request_html",
      target: 'background',
      target_website: url,
    })).toString().toLowerCase()
    if (!this._data_proxy_request[id]) {
      this._data_proxy_request[id] = true;

      window.postMessage({
        id: id,
        target: 'background',
        type: "get_website_request_html",
        target_website: url,
      });
    }


    let bool = true;
    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            bool = false;
            r(this._data_proxy_response[id].clone())
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        if (bool) {
          bool = false;
          r(new Response())
          j(new Response())
        }
        this._data_proxy_request[id] = undefined;
      }, 40000)
    })
  }

  getAllBrowserClient = async (
  ) => {
    let id = ''
    let bool = true;
    id = CryptoJS.MD5(JSON.stringify({
      type: "get_all_browser_client",
      target: 'background'
    })).toString().toLowerCase()
    if (!this._data_proxy_request[id]) {
      this._data_proxy_request[id] = true;

      window.postMessage({
        id: id,
        target: 'background',
        type: "get_all_browser_client"
      });
    }


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
      }, 30000)
    })
  }

  getProxyRequestLocal = async (e) => {
    const id = Math.random().toString(36).substring(2, 9)
    const jsonString = {
      send_client_id: e.send_client_id,
      receiver_client_id: e.receiver_client_id,
      type: 'proxy_request_local',
      target: 'background',
      data: e.data,
      id
    };
    window.postMessage(jsonString);
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
        r(null)
        j(null)
        this._data_proxy_response[id] = undefined;
      }, 40000)

    })
  }

  execute_eval = async (url, javascript) => {
    const id = CryptoJS.MD5(JSON.stringify({
      type: "website_request_execute_eval",
      target: 'background',
      target_website: url
    })).toString().toLowerCase()

    window.postMessage({
      id: id,
      target: 'background',
      type: "website_request_execute_script",
      target_website: url,
      javascript: javascript
    });
    let bool = true;
    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            bool = false;
            r(this._data_proxy_response[id])
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        if (bool) {
          bool = false;
          r(new Response())
          j(new Response())
        }
        this._data_proxy_request[id] = undefined;
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

  cacheFetch = async (url: URL | string): Promise<Response> => {
    if (!this.webCh.is_cache) return await fetch(url)
    const res = await this.webCh.match('assets', url)
    if (res) {
      return res
    } else {
      const response = await fetch(url)
      const request = url;
      if (response.ok) await this.webCh.put('assets', request, response);
      return await fetch(url)
    }
  }

  cacheFetchBlobUrl = async (url: string): Promise<string> => {
    const id = window.btoa(encodeURIComponent(url))
    if (this._blob_urls[id]) return this._blob_urls[id]
    if (!this.webCh.is_cache) {
      const res = await fetch(url)
      const blob = await res.blob();
      let bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      bloburl = bloburl.changingThisBreaksApplicationSecurity;
      this._blob_urls[id] = bloburl;
      return bloburl
    }
    const res = await this.webCh.match('assets', url)
    if (res) {
      const blob = await res.blob();
      let bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      bloburl = bloburl.changingThisBreaksApplicationSecurity;
      this._blob_urls[id] = bloburl;
      return bloburl
    } else {
      const response = await fetch(url)
      const request = url;
      if (response.ok) await this.webCh.put('assets', request, response);
      const res = await fetch(url)
      const blob = await res.blob();
      let bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      bloburl = bloburl.changingThisBreaksApplicationSecurity;
      this._blob_urls[id] = bloburl;
      return bloburl
    }
  }


}
