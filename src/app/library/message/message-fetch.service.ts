import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import CryptoJS from 'crypto-js'
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class MessageFetchService {
  _data_proxy_response: any = {};
  _data_proxy_request: any = {};

  constructor() {
    window._gh_fetch = this.fetch;
    window._gh_getHtml = this.getHtml;
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
        this._data_proxy_request[id]=true;

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
        this._data_proxy_request[id]=true;
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
      }, 40000)
    })
  }

  getHtml = async (url: RequestInfo | URL): Promise<Response> => {
    const id = Math.round(Math.random() * 1000000000000);
    let bool = true;
    window.postMessage({
      id: id,
      type: "website_proxy_request_html",
      proxy_request_website_url: url,
      proxy_response_website_url: window.location.origin
    });
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
}
