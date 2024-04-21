import { Injectable } from '@angular/core';
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class MessageFetchService {
  _data_proxy_response: any = {};
  constructor() {
    window._gh_fetch = this.fetch;
    window._gh_fetch_background =  this.fetch_background;
    window._gh_get = this.get;
  }

  async init() {
    const res = await this.fetch_background("https://i.nhentai.net/galleries/2820190/7.jpg", {
      method: "GET",
      headers: {
        "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
      },
      mode: "cors"
    });
    const blob = await res.blob();
    const base64 = await this.blobToBase64(blob)

  }
  async blobToBase64(blob) {
    return new Promise((r, j) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        r(reader.result as string)
      };
      reader.onerror = () => {
        j("")
      }
    })
  }
  fetch = async (url: RequestInfo | URL, init: RequestInit): Promise<Response> => {
    const req = new Request(url, init);
    let body = null;
    if (req.body) body = await this.readStreamToString(req.body)
    const b64_to_utf8 = (str: string) => {
      return JSON.parse(decodeURIComponent(escape(window.atob(str))));
    }
    const id = Math.round(Math.random() * 1000000000000);
    let bool = true;

    window.postMessage({
      id: id,
      type: "website_proxy_request",
      proxy_request_website_url: "https://manga.bilibili.com/",
      proxy_response_website_url: "http://localhost:4200/",
      http: {
        url: url,
        option: {
          "headers": init.headers,
          "body": body,
          "method": init.method
        }
      }
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
  fetch_background = async (url: RequestInfo | URL, init: RequestInit): Promise<Response> => {
    const req = new Request(url, init);
    let body = null;
    if (req.body) body = await this.readStreamToString(req.body)
    const b64_to_utf8 = (str: string) => {
      return JSON.parse(decodeURIComponent(escape(window.atob(str))));
    }
    const id = Math.round(Math.random() * 1000000000000);
    let bool = true;
    window.postMessage({
      id: id,
      type: "pulg_proxy_request",
      proxy_request_website_url: "https://hanime1.me/comic/",
      proxy_response_website_url: "http://localhost:4200/",
      http: {
        url: url,
        option: {
          "headers": init.headers,
          "body": body,
          "method": init.method
        }
      }
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
  async fetch_html(url: RequestInfo | URL, init: RequestInit): Promise<Response> {
    const id = Math.round(Math.random() * 1000000000000);
    let bool = true;
    window.postMessage({
      id: id,
      type: "website_proxy_request_html",
      proxy_request_website_url: url,
      proxy_response_website_url: "http://localhost:4200/"
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
  async fetch_image() {
  }

  async post(url: string, body: any): Promise<any> {
    try {
      const res = await this.fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8"
        },
        "body": JSON.stringify(body),
        mode: "cors"
      });
      const json = await res.json();
      return json
    } catch (error) {
      return null
    }
  }
  get_background = async (url: string): Promise<any> => {
    const res = await this.fetch_background((url), {
      method: "GET",
      headers: {
        "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
      },
      mode: "cors"
    });
    return res
  }
  get = async (url: string): Promise<any> => {
    const res = await this.fetch(url, {
      method: "GET",
      headers: {
        "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
      },
      mode: "cors"
    });
    return res
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
