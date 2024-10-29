import { Injectable } from '@angular/core';
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class MessageFetchService {
  _data_proxy_response: any = {};
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
    const id = Math.round(Math.random() * 1000000000000);
    let bool = true;
    if (option&&option.proxy) {
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
    } else {
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

    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            let rsponse = this._data_proxy_response[id].data;
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
            rsponse.headers.forEach((x: { name: string; value: string; }) => {
              headers.append(x.name, x.value);
            })
            rsponse.headers = headers
            delete this._data_proxy_response[id]
            r(new Response(readableStream, rsponse))
          } else {
            if (bool) getData()
          }
        }, 66)
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
      const getFile = () => {
        setTimeout(() => {
          if (this._data_proxy_response[id]) {
            let rsponse = this._data_proxy_response[id].data;
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
            rsponse.headers.forEach((x: { name: string; value: string; }) => {
              headers.append(x.name, x.value);
            })
            rsponse.headers = headers
            delete this._data_proxy_response[id]
            r(new Response(readableStream, rsponse))
          } else {
            if (bool) getFile()
          }
        }, 0)
      }
      getFile()
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
