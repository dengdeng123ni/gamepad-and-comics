import { Component } from '@angular/core';
import { ExportSettingsService } from './export-settings.service';
import { DataService } from '../../services/data.service';
import { DbComicsControllerService, DownloadService, Mp4Service } from 'src/app/library/public-api';
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
    public DbComicsController: DbComicsControllerService,
    public download: DownloadService,
    public data: DataService,
    public current: CurrentService,
    public mp4: Mp4Service,
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

  mp4_option={
    WIDTH:1920,
    HEIGHT:1080,
    image_duration:30,
    image_count:1,
    backdropClass:"#000000",
    is_insert_blank_page:true
  }
  change(e: string) {
    this.page = e;
    if(this.type=="MP4"){
       if(this.page=="one"){
        this.mp4_option={
          WIDTH:1080,
          HEIGHT:1920,
          image_duration:30,
          image_count:1,
          backdropClass:"#000000",
          is_insert_blank_page:true
        }
       }else if(this.page=="double"){
        this.mp4_option={
          WIDTH:1920,
          HEIGHT:1080,
          image_duration:30,
          image_count:1,
          backdropClass:"#000000",
          is_insert_blank_page:true
        }

       }
    }
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

    const chapters = this.data.chapters.filter(x => x.selected);

    if (chapters.length == 0) return
    for (let index = 0; index < chapters.length; index++) {
      const x = chapters[index]
      const pages = await this.DbComicsController.getPages(x.id);
      const isFirstPageCover = this.isFirstPageCover;
      if (this.type == "IMAGES") {
        await this.download.downloadTallImage(`${this.data.details.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), pages.map((x: { src: any; }) => x.src), this.direction)

      } else if (this.type == "MP4") {
        const blob = await this.mp4.createMp4(pages.map((x: { src: any; }) => x.src), {pageOrder: this.pageOrder, isFirstPageCover: isFirstPageCover, page: this.page },
      this.mp4_option
      )

        this.download.saveAs(blob, `${this.data.details.title}_${x.title}.mp4`)

      } else {

        const blob = await this.download.ImageToTypeBlob({ type: this.type, name: `${this.data.details.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: isFirstPageCover, page: this.page })

        this.download.saveAs(blob, `${this.data.details.title}_${x.title}`)
      }


    }
    this.exportSettings.close();
    this.loading.close();
  }
}
