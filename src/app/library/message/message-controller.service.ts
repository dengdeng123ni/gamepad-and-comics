import { Injectable } from '@angular/core';
import { MessageEventService } from './message-event.service';

@Injectable({
  providedIn: 'root'
})
export class MessageControllerService {

  constructor(public MessageEvent: MessageEventService) {

    MessageEvent.service_worker_register('proxy_request', event => {
      const data = event.data;
      window.postMessage(data, '*');
    })
    MessageEvent.service_worker_register('website_proxy_request', event => {
      const data = event.data;
      window.postMessage(data, '*');
    })
    navigator.serviceWorker.addEventListener('message', async (event) => {
      // 处理接收到的消息
      const type = event.data.type;
      console.log(event);

      if (this.MessageEvent.ServiceWorkerEvents[type]) {
        const data = await this.MessageEvent.ServiceWorkerEvents[type](event);
        if(data) navigator.serviceWorker.controller.postMessage(data);
      }
    });

    window.addEventListener("message", function (event) {
      if (event.data.type == "proxy_response") {
        navigator.serviceWorker.controller.postMessage(event.data)
      }
    }, false);

  }
}
