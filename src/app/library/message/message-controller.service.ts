import { Injectable } from '@angular/core';
import { MessageEventService } from './message-event.service';
import { MessageFetchService } from './message-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class MessageControllerService {

  constructor(public MessageEvent: MessageEventService, public http:MessageFetchService) {

    MessageEvent.service_worker_register('proxy_request', (event:any) => {
      const data = event.data;
      window.postMessage(data, '*');
    })
    MessageEvent.service_worker_register('website_proxy_request', (event:any) => {
      const data = event.data;
      window.postMessage(data, '*');
    })
    navigator.serviceWorker.addEventListener('message', async (event) => {
      // 处理接收到的消息
      const type = event.data.type;
      if (this.MessageEvent.ServiceWorkerEvents[type]) {
        const data = await this.MessageEvent.ServiceWorkerEvents[type](event);
        if (data && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage(data);
      }
    });


    window.addEventListener("message", function (event) {

      if (event.data.type == "proxy_response") {
        if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage(event.data)
        let rsponse = event.data.data;
        const flatArray = rsponse.body.flat()
        const blob = new Blob([new Uint8Array(flatArray)]);
        delete rsponse.body;
        const headers = new Headers();
        rsponse.headers.forEach((x: { name: string; value: string; }) => {
          headers.append(x.name, x.value);
        })
        rsponse.headers = headers;
        http._data_proxy_response[event.data.id]= new Response(blob, rsponse)
        setTimeout(()=>{
          http._data_proxy_response[event.data.id]=undefined;
          http._data_proxy_request[event.data.id]=undefined;
        },40000)
      }else if (event.data.type == "specify_link") {
        MessageEvent.OtherEvents['specify_link'](event.data.data)
      }
    }, false);

  }
}
