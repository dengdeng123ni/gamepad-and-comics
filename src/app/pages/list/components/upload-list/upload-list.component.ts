import { Component } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { CurrentListService } from '../../services/current.service';
import { UploadService } from '../../services/upload.service';
import { LoadingService } from '../loading/loading.service';
import { UploadSelectService } from '../upload-select/upload-select.service';
import { UploadListService } from './upload-list.service';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent {

  urls = [];
  list = [];
  progress = false;
  all = true;
  compress = false;
  constructor(
    public upload: UploadService,
    public uploadList: UploadListService,
    public uploadSelect: UploadSelectService,
    public current: CurrentListService,
    public sanitizer: DomSanitizer,
    public i18n: I18nService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public loading:LoadingService
  ) {
    this.list = upload.list.map(x => ({
      id: x.comics.id,
      title: x.comics.title,
      cover: x.comics.cover,
    }))
    this.list.forEach(x => {
      if (x.cover["upload_type"] == "github_pages") {
        x.cover = { src: `/assets/${x.cover["relativePath"]}` };
        x.upload_type = "github_pages";
      } else {
        x.cover = { src: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(x.cover)) }
        this.urls.push(x.cover)
      }

      x.select = true;

    })
    GamepadEvent.registerAreaEvent("list_upload_list", {
      "B": () => this.close(),
      "A": () => {
        const node = this.GamepadController.getCurrentNode();
        const type = node.getAttribute("type")
        if (type) {
          node.querySelector("[type=checkbox]").click();
        } else {
          GamepadController.leftKey();
        }
      }
    })
    GamepadEvent.registerAreaEvent("list_upload_list_item", {
      "B": () => this.close(),
    })

  }
  async add() {
    const list = this.list.filter(x => x.select);
    this.loading.open();
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      const id = x.id;
      const obj = this.upload.list.find(x => x.id == id);
      if (x.upload_type == "github_pages") {
        for (let j = 0; j < obj.comics.chapters.length; j++) {
          const c = obj.comics.chapters[j];
          for (let p = 0; p < c.images.length; p++) {
            const l = obj.comics.chapters[j].images[p];
            const req = await fetch(`/assets/${l["relativePath"]}`);
            const blob = await req.blob();
            obj.comics.chapters[j].images[p] = new File([blob], l["name"], { type: blob.type });
          }
        }
      }
      await this.upload.add(obj.comics, obj.state, this.compress);
    }
    this.close();
    this.current.getComicsInfoAll();
  }
  updateAll() {
    if (this.all) {
      this.list.forEach(x => x.select = this.all)

    }
    else {
      this.list.forEach(x => x.select = this.all)
    }
  }

  close() {
    this.loading.close();
    this.upload.list = [];
    this.uploadList.close();
    this.uploadSelect.close();
    this.urls.forEach(x => URL.revokeObjectURL(x))
  }
}
