import { Component } from '@angular/core';
import { ExportSettingsService } from './export-settings.service';
import { DataService } from '../../services/data.service';
import { DbControllerService, DownloadService, I18nService } from 'src/app/library/public-api';
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
    public current:CurrentService,
    public loading: LoadingService,
    public i18n: I18nService
  ) {
    this.pageOrder = this.data.comics_config.is_page_order;
  }
  isFirstPageCover=true;
  pageOrder = false;
  page = "double"; //  double one
  type = "PDF";
  change(e: string) {
    this.page = e;
  }
  onEpub() {
    const node: any = document.querySelector("#page_double");
    node.querySelector("button").click();
  }
  async on() {
    this.loading.open();
    const chapters = this.data.chapters.filter(x => x.selected);

    if (chapters.length == 0) return
    for (let index = 0; index < chapters.length; index++) {
      const x = chapters[index]
      const pages = await this.DbController.getPages(x.id);
      const isFirstPageCover=this.isFirstPageCover;
      await this.download.download({type:this.type, name: `${this.data.comics_info.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: isFirstPageCover, page: this.page })
    }
    this.exportSettings.close();
    this.loading.close();
  }
}
