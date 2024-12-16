import { Component } from '@angular/core';
import { ArchiveControllerService, NotifyService } from 'src/app/library/public-api';

@Component({
  selector: 'app-archive-page',
  templateUrl: './archive-page.component.html',
  styleUrl: './archive-page.component.scss'
})
export class ArchivePageComponent {
  log$

  list=[]
  constructor(
    public ArchiveController: ArchiveControllerService,
    public Notify:NotifyService
  ) {
    this.log$=this.ArchiveController.log$.subscribe(x=>{
       this.list.unshift(x)
    })
  }

  async on() {
    const bool = await this.ArchiveController.open();
    if (bool) {
      this.ArchiveController.export();
    } else {
      this.Notify.messageBox('打开文件夹失败', '', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
  async on2() {
    const bool = await this.ArchiveController.open();
    if (bool) {
      this.ArchiveController.import();
    } else {
      this.Notify.messageBox('打开文件夹失败', '', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
