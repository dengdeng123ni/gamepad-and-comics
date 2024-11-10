import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @HostListener('window:beforeunload', ['$event'])
  beforeunload = (event: KeyboardEvent) => {
    var e:any = (window as any).event  || e;
    e.returnValue = ("确定离开当前页面吗？");
  }
}
