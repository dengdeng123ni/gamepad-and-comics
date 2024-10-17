import { Component, HostListener } from '@angular/core';
import { WebFileService } from 'src/app/library/public-api';
import { DownloadProgressService } from './download-progress.service';

@Component({
  selector: 'app-download-progress',
  templateUrl: './download-progress.component.html',
  styleUrl: './download-progress.component.scss'
})
export class DownloadProgressComponent {
  @HostListener('window:beforeunload', ['$event'])
  beforeunload = (event: KeyboardEvent) => {
    var e:any = (window as any).event  || e;
    e.returnValue = ("确定离开当前页面吗？");
  }
  list = [
  ];
  is_edit = false;
  constructor(
    public WebFile: WebFileService,
    public DownloadProgress:DownloadProgressService
  ) {

  }
  close(){
     this.DownloadProgress.close();
  }
}
