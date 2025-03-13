import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-module-page',
  templateUrl: './upload-module-page.component.html',
  styleUrl: './upload-module-page.component.scss'
})
export class UploadModulePageComponent {

  data = {
    title: "",
    description: "",
    previewPath: "",
    contentPath: "",
    changeNote: "",
    visibility: 1,
    tags: [],
  }
  constructor() {
    (window as any).electron.receiveMessage('steam_workshop_upload_module', async (event, message) => {
      if (message.type == "openFile") {
        this.data.previewPath = message.path;

      } else if (message.type == "openDirectory") {
        this.data.contentPath = message.path;
      }
    })
  }
  openFile() {
    this.sendMessage({ type: "openFile" });
  }
  openDirectory() {
    this.sendMessage({
      type: "openDirectory"
    });
  }
  save() {
    this.sendMessage({
      type: "upload_module",
      data: this.data
    });

  }
  sendMessage = (data) => {
    (window as any).electron.sendMessage('steam_workshop_upload_module', data)
  }
}
