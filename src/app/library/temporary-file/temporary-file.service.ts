import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemporaryFileService {
  files = [];
  constructor() {
    setTimeout(()=>{
        this.init();
    },3000)
  }
  init(){
    navigator.serviceWorker.addEventListener('message', async (event) => {
      // 处理接收到的消息

      const type = event.data.type;
      if (type == "temporary_file") {
        const id = parseInt(event.data.id);
        const obj = this.files.find(x => x.id==id);
        const blob=await obj.blob.getFile();
        navigator.serviceWorker.controller.postMessage({id:event.data.id,type: "temporary_file", blob: blob });
      }

    });
  }

}
