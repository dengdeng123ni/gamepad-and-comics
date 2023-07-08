import { Injectable } from '@angular/core';
import { MessageEventService } from '../message/message-event.service';

@Injectable({
  providedIn: 'root'
})
export class TemporaryFileService {
  files = [];
  constructor(public MessageEvent: MessageEventService) {
    MessageEvent.service_worker_register('temporary_file', async event => {
      const id = parseInt(event.data.id);
      const obj = this.files.find(x => x.id == id);
      const blob = await obj.blob.getFile();
      return { id: event.data.id, type: "temporary_file", blob: blob }
    })
  }
  init() {
  }

}
