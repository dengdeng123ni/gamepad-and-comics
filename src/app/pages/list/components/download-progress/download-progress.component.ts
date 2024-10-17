import { Component } from '@angular/core';
import { WebFileService } from 'src/app/library/public-api';
import { DownloadProgressService } from './download-progress.service';

@Component({
  selector: 'app-download-progress',
  templateUrl: './download-progress.component.html',
  styleUrl: './download-progress.component.scss'
})
export class DownloadProgressComponent {

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
