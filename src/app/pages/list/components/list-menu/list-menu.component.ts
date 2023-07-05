import { Component } from '@angular/core';
import { ContextMenuControllerService, ContextMenuEventService, I18nService, TemporaryFileService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { AddServerService } from '../add-server/add-server.service';
import { AddLocalServerPathService } from '../add-local-server-path/add-local-server-path.service';
import { CurrentListService } from '../../services/current.service';
import { UploadService } from '../../services/upload.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent {
  constructor(
    public i18n: I18nService,
    public AddServer: AddServerService,
    public config: ConfigListService,
    public current: CurrentListService,
    public upload: UploadService,
    public AddLocalServerPath: AddLocalServerPathService,
    public ContextMenuEvent: ContextMenuEventService,
    public ContextMenuController: ContextMenuControllerService,
    public loading: LoadingService,
    public temporaryFile:TemporaryFileService,
    public http: HttpClient
  ) {
    ContextMenuEvent.register('application', {
      close: e => {

      },
      on: async e => {
        if (e.id == "local_server") {
          this.AddServer.open()
        }

      },
      menu: [
        { name: "本地服务器", id: "local_server" },
        // { name: "export", id: "export" },
        // { name: "delete", id: "delete" },
      ]
    })
    ContextMenuEvent.register('local_server', {
      close: e => {

      },
      on: async e => {
        if (e.id == "delete") {
          const res = e.value.split("_");
          const indexc = parseInt(res[0]);
          for (let index = 0; index < this.config.list_menu_config.server[indexc].subscriptions.length; index++) {
            const n = this.config.list_menu_config.server[indexc].subscriptions[index];
            const id = n.id;
            const list = this.current.all_list.filter(x => x.config.id == id);
            list.forEach(x => this.current.delete(x.id))
          }
          this.config.list_menu_config.server = this.config.list_menu_config.server.filter((x, i) => i != indexc);
          this.config.save_list_menu_config();
        }
      },
      menu: [
        { name: "delete", id: "delete" },
        // { name: "export", id: "export" },
        // { name: "delete", id: "delete" },
      ]
    })
    ContextMenuEvent.register('local_server_item', {
      close: e => {

      },
      on: async e => {
        if (e.id == "update") {

        }
        if (e.id == "delete") {
          const res = e.value.split("_");
          const index = parseInt(res[0]);
          const id = res[1];
          this.config.list_menu_config.server[index].subscriptions = this.config.list_menu_config.server[index].subscriptions.filter(x => x.id != id);
          const list = this.current.all_list.filter(x => x.config.id == id);
          list.forEach(x => this.current.delete(x.id))
          this.config.save_list_menu_config();
        }
      },
      menu: [
        // { name: "更新", id: "update" },
        { name: "delete", id: "delete" },
        // { name: "delete", id: "delete" },
      ]
    })


    // n.id
    // local_server_item

  }
  local_server_item_delete() {

  }
  date = new Date().getTime();
  files_arr = [];
  async openTemporaryFile() {
    const out = {};
    const dirHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
    const id=window.btoa(encodeURI(dirHandle["name"]))
    await this.handleDirectoryEntry(dirHandle, out, dirHandle["name"]);
    await this.upload.subscribe_to_temporary_file_directory(this.files_arr,id)
    this.temporaryFile.files=[...this.temporaryFile.files,...this.files_arr];
    this.config.temporary.list.push({id,name:dirHandle["name"]})
    this.current.temporary_file_ids.push(id);
    await this.current.getComicsInfoAll();
  }
  async handleDirectoryEntry(dirHandle, out, path) {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        out[entry.name] = { id: this.date, blob: entry, path: `${path}/${entry.name}`.substring(1) };
        this.files_arr.push({ id: this.date, blob: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
        this.date++;
      }
      if (entry.kind === "directory") {
        const newOut = out[entry.name] = {};
        await this.handleDirectoryEntry(entry, newOut, `${path}/${entry.name}`);
      }
    }
  }
  openServer($event) {
    const node: any = document.querySelector("[content_menu_key=application]")
    const position = node.getBoundingClientRect();
    this.ContextMenuController.openContextMenu(node, position.left + 5, position.bottom + 5)

  }
  on(e, id) {
    this.current.change(id);
  }

  async on_local_server(e, api, id) {
    this.current.change(id);
    setTimeout(async () => {
      const files = (await firstValueFrom(
        this.http.get(`${api}/files/${id}`)
      ))
      const size = new Blob([JSON.stringify(files)]).size;
      // console.log(files,api,id);
      const index = this.config.list_menu_config.server.findIndex(x => x.src == api);
      if (index <= -1) {
        return
      }
      if (this.config.list_menu_config.server[index].subscriptions.find(x => x.id == id)) {
        if (this.config.list_menu_config.server[index].subscriptions.find(x => x.id == id).size == size) {

          return
        } else {
          this.loading.open();
          await this.upload.subscribe_to_file_directory(files, api, id);
          this.loading.close();
        }
      }
    }, 2000)
  }

  async on_temporary_file(e,id){
    this.current.change(id);
  }
}
