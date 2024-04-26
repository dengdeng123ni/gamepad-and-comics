import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebFileService } from 'src/app/library/web-file/web-file.service';
import { DownloadOptionService } from './download-option.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-download-option',
  templateUrl: './download-option.component.html',
  styleUrls: ['./download-option.component.scss']
})
export class DownloadOptionComponent {
  constructor(
    public DownloadOption:DownloadOptionService,
    public WebFile: WebFileService,
    @Inject(MAT_DIALOG_DATA) public _data,
    private _snackBar: MatSnackBar
  ) {
    this.list = _data;
  }
  option = {
    type: [],
    page: "double",
    isFirstPageCover: false,
    pageOrder: false,
    isOneFile: false
  }
  types = ['JPG', 'PDF', 'EPUB', 'PPT', 'ZIP'].map(x => ({ name: x, completed: false }))
  list = [];
  typeChange() {
    this.option.type = this.types.filter(x => x.completed).map(x => x.name)
  }
  async on() {
    const ids = this.list.map(x => x.id);

    if (this.option.isOneFile) {

    } else {

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        for (let index = 0; index < this.option.type.length; index++) {
          const type = this.option.type[index];
          console.log(this.option,type);

          await this.WebFile.downloadComics(id, {
            type,
            isFirstPageCover: this.option.isFirstPageCover,
            pageOrder: this.option.pageOrder,
            page: this.option.page,
            downloadChapterAtrer:x=>{
              this._snackBar.open(x.title, '下载完成', {
                duration:1500,
                horizontalPosition:'end',
                verticalPosition:'bottom',
              });
            }
          })
        }
      }
      // this.DownloadOption.close();
    }

  }
  ngAfterViewInit() {
    const height = document.querySelector('#download_option .left').clientHeight;
    const node: any = document.querySelector('#download_option')

    node.style = `height:${height < 554 ? height : 554}px`;

  }
}
