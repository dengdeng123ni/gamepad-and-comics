import { Component, OnInit } from '@angular/core';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { ModeChangeService } from './mode-change.service';
//  declare const document: any;
@Component({
  selector: 'app-mode-change',
  templateUrl: './mode-change.component.html',
  styleUrls: ['./mode-change.component.scss']
})
export class ModeChangeComponent implements OnInit {

  constructor(public mode: ModeChangeService,public config:ConfigReaderService,public current: CurrentReaderService) { }

  ngOnInit(): void {
//  document.querySelector(" .cdk-global-overlay-wrapper").style.alignItems="center";
  }

  ngAfterViewInit() {
    const node:any=document.querySelector(`.mode_${this.current.comics.mode}`);
    setTimeout(()=>{
     node.focus()
    },0)
   }
}
