import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WsControllerService {

  constructor() {

  }


  async init(url) {
    let _data = {};
    const socket = new WebSocket(url);
    window._gh_send_message = (e) => {
      const id = Math.random().toString(36).substring(2, 9)
      const jsonString = JSON.stringify({
        send_client_id: '_1733828819401',
        receiver_client_id: '_1733828966951',
        type: 'send',
        data: e,
        id
      });
      const blob = new Blob([jsonString], { type: "application/json" });
      socket.send(blob);
      let bool = true;
      return new Promise((r, j) => {
        const getData = () => {
          setTimeout(() => {
            if (_data[id]) {
              r(_data[id])
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
          _data[id] = undefined;
        }, 40000)

      })
    }
    // 监听连接打开事件
    socket.addEventListener('open', async () => {
      const jsonData = { type: "init", name: navigator.userAgent, id: document.body.getAttribute('client_id') };
      const jsonString = JSON.stringify(jsonData);
      const blob = new Blob([jsonString], { type: "application/json" });
      socket.send(blob);
    });
    // 监听消息事件
    socket.addEventListener('message', async (event) => {
      const text = await new Blob([event.data]).text();
      const c = JSON.parse(text);
      if (c.type == "send") {
        const res = await window._gh_receive_message(c.data)
        let obj = {
          id: c.id,
          receiver_client_id: c.send_client_id,
          send_client_id: c.receiver_client_id,
          type: "receive",
          data: res
        }
        const jsonString = JSON.stringify(obj);
        const blob = new Blob([jsonString], { type: "application/json" });
        socket.send(blob);
      } else if (c.type == "receive") {
        _data[c.id] = c.data;
      }
    });

    // 监听错误事件
    socket.addEventListener('error', (error) => {
      console.error('客户端错误', error);
    });

    // 监听连接关闭事件
    socket.addEventListener('close', () => {
      console.log('关闭客户端链接');
    });
  }
}
