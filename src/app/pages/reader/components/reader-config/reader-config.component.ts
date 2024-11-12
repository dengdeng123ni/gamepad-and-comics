import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import {FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
@Component({
  selector: 'app-reader-config',
  templateUrl: './reader-config.component.html',
  styleUrls: ['./reader-config.component.scss']
})
export class ReaderConfigComponent {
  constructor(public data:DataService,public current:CurrentService,
    public GamepadController:GamepadControllerService,
    public focusMonitor: FocusMonitor,
    public GamepadEvent:GamepadEventService
  ){
  // this.GamepadEvent.registerAreaEvent("reader_config_item", {
  //   "UP": e => {
  //     this.GamepadController.setCurrentTarget("UP")
  //     e.focus();
  //     focusMonitor.focusVia(e,'keyboard')
  //   },
  //   "DOWN": e =>  {
  //     this.GamepadController.setCurrentTarget("DOWN");
  //     focusMonitor.focusVia(e,'keyboard')
  //     e.focus();
  //   },
  //   "RIGHT": e =>  {
  //     this.GamepadController.setCurrentTarget("RIGHT")
  //     focusMonitor.focusVia(e,'keyboard')
  //     e.focus();
  //   },
  //   "LEFT": e =>  {
  //     this.GamepadController.setCurrentTarget("LEFT");
  //     focusMonitor.focusVia(e,'keyboard')
  //     e.focus();

  //   },
  //   })
  }
  change(e){
    this.data.comics_config.reader_mode=e;
  }
  change1(e){
    this.data.comics_config.is_double_page=e;
  }
  change2(e){
    this.data.comics_config.is_page_order=e;
  }
  change3(e){
    this.data.comics_config.background_color=e;
    document.documentElement.style.setProperty('--reader-background-color',this.data.comics_config.background_color)
  }
  // reader_mode = "";
  // is_double_page = true;
  // is_page_order = true;

  //
  ngOnDestroy() {
    this.current._setWebDbComicsConfig(this.data.comics_id);
  }
}
