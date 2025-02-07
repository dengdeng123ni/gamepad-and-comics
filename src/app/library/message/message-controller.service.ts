import { Injectable } from '@angular/core';
import { MessageEventService } from './message-event.service';
import { MessageFetchService } from './message-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class MessageControllerService {

  constructor(public MessageEvent: MessageEventService, public http: MessageFetchService) {

    MessageEvent.service_worker_register('proxy_request', (event: any) => {
      const data = event.data;
      window.postMessage(data, '*');
    })
    MessageEvent.service_worker_register('website_proxy_request', (event: any) => {
      const data = event.data;
      window.postMessage(data, '*');
    })
    navigator?.serviceWorker?.addEventListener('message', async (event) => {
      // 处理接收到的消息
      const type = event.data.type;
      if (this.MessageEvent.ServiceWorkerEvents[type]) {
        const data = await this.MessageEvent.ServiceWorkerEvents[type](event);
        if (data && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage(data);
      }
    });


    window.addEventListener("message", async (event) => {
      if (event.data.target == "page") {
        if (event.data.type == "proxy_response") {
          if (navigator?.serviceWorker?.controller) navigator.serviceWorker.controller.postMessage(event.data)
          let rsponse = event.data.data;
          const flatArray = rsponse.body.flat()
          const blob = new Blob([new Uint8Array(flatArray)]);
          delete rsponse.body;
          const headers = new Headers();
          rsponse.headers.forEach((x: { name: string; value: string; }) => {
            headers.append(x.name, x.value);
          })
          rsponse.headers = headers;
          http._data_proxy_response[event.data.id] = new Response(blob, rsponse)
          setTimeout(() => {
            http._data_proxy_response[event.data.id] = undefined;
            http._data_proxy_request[event.data.id] = undefined;
          }, 40000)
        } else if (event.data.type == "proxy_data") {
          http._data_proxy_response[event.data.id] = event.data.data;
          setTimeout(() => {
            http._data_proxy_response[event.data.id] = undefined;
          }, 40000)
        } else if (event.data.type == "specify_link") {
          MessageEvent.OtherEvents['specify_link'](event.data.data)
        } else if (event.data.type == "proxy_request_local") {
          const res = await window._gh_receive_message(event.data.data)
          const json  = {
            send_client_id: event.data.send_client_id,
            receiver_client_id: event.data.receiver_client_id,
            type: 'proxy_response_local',
            target: 'background',
            data: res,
            id: event.data.id
          };
          window.postMessage(json);
        } else if (event.data.type == "init") {
          this.init();
          this.ping();
        } else if(event.data.type=="eval"){
          const data = await this.executeEval(event.data.javascript);
          const json = {
            type: 'eval',
            target: 'background',
            data: data,
            id: event.data.id
          };
          window.postMessage(json);
        }
      }
    }, false);

  }
  async executeEval(code) {
    return window.eval(code)
  }

  init = async () => {
    this.http.init();

    window.postMessage({
      target: 'background',
      type: "add_browser_client",
      client: {
        id: document.body.getAttribute("client_id"),
        name: document.body.getAttribute("client_name")
      }
    });
  }

  ping(){
    // 插件销毁,每3秒上报数据
    setTimeout(()=>{
      window.postMessage({
        target: 'background',
        type: "add_browser_client",
        client: {
          id: document.body.getAttribute("client_id"),
          name: document.body.getAttribute("client_name")
        }
      });
    },6000)
  }


  // window.eval=
}
