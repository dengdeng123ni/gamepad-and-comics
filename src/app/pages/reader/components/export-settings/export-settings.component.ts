import { Component } from '@angular/core';
import { ExportSettingsService } from './export-settings.service';
import { DataService } from '../../services/data.service';
import { DbControllerService, DownloadService } from 'src/app/library/public-api';
import { LoadingService } from '../loading/loading.service';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent {
  constructor(
    public exportSettings: ExportSettingsService,
    public DbController: DbControllerService,
    public download: DownloadService,
    public data: DataService,
    public current: CurrentService,
    public loading: LoadingService
  ) {
    this.pageOrder = this.data.comics_config.is_page_order;
  }
  isFirstPageCover = true;
  isFirstPageCoverEPUB = true;
  pageOrder = false;
  page = "double"; //  double one
  type = "PDF";
  direction = 'down'
  change(e: string) {
    this.page = e;
  }
  onEpub() {
    const node: any = document.querySelector("#page_double");
    node.querySelector("button").click();
  }
  onImage() {
    const node: any = document.querySelector("#page_one");
    node.querySelector("button").click();
  }
  async on($event) {
    this.loading.open();

    const chapters = this.data.chapters.filter(x => x.id==this.data.chapter_id);

    if (chapters.length == 0) return
    for (let index = 0; index < chapters.length; index++) {
      const x = chapters[index]
      const pages = await this.DbController.getPages(x.id);
      const isFirstPageCover = this.isFirstPageCover;
      if (this.type == "IMAGES") {
        await this.download.downloadTallImage(`${this.data.details.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), pages.map((x: { src: any; }) => x.src), this.direction)

      } else {
        const blob = await this.download.ImageToTypeBlob({ type: this.type, name: `${this.data.details.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: isFirstPageCover, page: this.page })
        this.download.saveAs(blob, `${this.data.details.title}_${x.title}`)
      }


    }
    this.exportSettings.close();
    this.loading.close();
  }
}
