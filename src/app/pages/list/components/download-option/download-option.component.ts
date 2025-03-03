import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DownloadOptionService } from './download-option.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DownloadEventService, NotifyService, WebFileService } from 'src/app/library/public-api';
import { DownloadProgressService } from '../download-progress/download-progress.service';
@Component({
  selector: 'app-download-option',
  templateUrl: './download-option.component.html',
  styleUrls: ['./download-option.component.scss']
})
export class DownloadOptionComponent {
  is_download = false;
  o123r = 0;

  paths = [];
  constructor(
    public DownloadOption: DownloadOptionService,
    public DownloadProgress: DownloadProgressService,
    public WebFile: WebFileService,
    public Notify:NotifyService,
    public DownloadEvent: DownloadEventService,
    @Inject(MAT_DIALOG_DATA) public _data,
    private _snackBar: MatSnackBar
  ) {
    this.list = _data;
    this.paths = Object.keys(DownloadEvent.Paths).map(x => ({...DownloadEvent.Paths[x] }))

  }
  option = {
    type: [],
    page: "double",
    isFirstPageCover: false,
    pageOrder: false,
    isOneFile: false
  }

  download_path = "默认";

  types = ['JPG', 'PDF', 'EPUB', 'PPT', 'ZIP'].map(x => ({ name: x, completed: false }))
  // MP4
  list = [];
  typeChange() {
    this.option.type = this.types.filter(x => x.completed).map(x => x.name)
  }
  async download() {
    const bool = await this.WebFile.open();
    const getPath = this.paths.find(x => x.id == this.download_path)?.event;

    if (bool) {
      this.DownloadProgress.open({ disableClose: true, panelClass: "_double_page_thumbnail", })

      this.WebFile.downloadComicsAll(
        {
          list: this.list,
          type: this.option.type,
          isFirstPageCover: this.option.isFirstPageCover,
          pageOrder: this.option.pageOrder,
          getPath: getPath,
          page: this.option.page
        }
      )
    } else {
      this.Notify.messageBox('打开文件夹失败', '', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
  async on() {

    const ids = this.list.map(x => x.id);
    this.is_download = true;
    if (this.option.isOneFile) {

    } else {

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        for (let index = 0; index < this.option.type.length; index++) {
          const type = this.option.type[index];

          await this.WebFile.downloadComics(id, {
            type,
            isFirstPageCover: this.option.isFirstPageCover,
            pageOrder: this.option.pageOrder,
            page: this.option.page,
            downloadChapterAtrer: x => {
              this.Notify.messageBox(x.title, '下载完成', {
                duration: 1500,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
              });
            }
          })
        }
        this.o123r = ((index + 1) / ids.length) * 100;

      }

    }
    this.is_download = false;
    this.DownloadOption.close();

  }
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  ngAfterViewInit() {
    const height = document.querySelector('#download_option .left').clientHeight;
    const node: any = document.querySelector('#download_option')

    node.style = `height:${height < 554 ? height : 554}px`;

  }
}
