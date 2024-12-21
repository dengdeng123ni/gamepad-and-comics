import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { GamepadControllerService, GamepadEventService, TouchmoveEventService } from 'src/app/library/public-api';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ReaderConfigService } from './reader-config.service';
@Component({
  selector: 'app-reader-config',
  templateUrl: './reader-config.component.html',
  styleUrls: ['./reader-config.component.scss']
})
export class ReaderConfigComponent {

  cut_pages = [
    "无",
    "平滑",
    "淡出淡入",
    "封面流",
    "翻转",
    "近大远小",
    "覆盖",
    "卡片",
    "旋转"
  ]
  is_open=false
  constructor(public data: DataService, public current: CurrentService,
    public GamepadController: GamepadControllerService,
    public focusMonitor: FocusMonitor,
    public TouchmoveEvent:TouchmoveEventService,
    public ReaderConfig:ReaderConfigService,
    public GamepadEvent: GamepadEventService
  ) {
    TouchmoveEvent.register('reader_config',{
      LEFT:()=>{
        this.ReaderConfig.close();
        this.ReaderConfig.close_bottom_sheet();
      },
      RIGHT:()=>{
        this.ReaderConfig.close();
        this.ReaderConfig.close_bottom_sheet();
      },
    })
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
setTimeout(()=>{
  this.is_open=true;
},300)
  }
  change(e) { if(!this.is_open) return
    this.data.comics_config.reader_mode = e;
  }
  change1(e) { if(!this.is_open) return
    this.data.comics_config.is_double_page = e;
  }
  change2(e) { if(!this.is_open) return
    this.data.comics_config.is_page_order = e;
  }
  change3(e) { if(!this.is_open) return
    this.data.comics_config.background_color = e;
    document.documentElement.style.setProperty('--reader-background-color', this.data.comics_config.background_color)
  }
  change6(e) { if(!this.is_open) return
    this.data.comics_config.border_radius = e;
  }

  change5(e) {
    if(!this.is_open) return
    this.data.comics_config.page_height = e;
    this.data.is_init_free=false;
    setTimeout(()=>{
      this.data.is_init_free=true;
    })
  }
  change4(e) {
    if(!this.is_open) return
    this.data.comics_config.first_cover_background_color = e;
    this.data.is_init_free=false;
    setTimeout(()=>{
      this.data.is_init_free=true;
    })
  }
  on_switch(n){ if(!this.is_open) return
    this.data.comics_config.page_switching_effect=n;
    this.data.is_init_free=false;
    setTimeout(()=>{
      this.data.is_init_free=true;
    })

  }
  ngOnDestroy() {


    this.current._setWebDbComicsConfig(this.data.comics_id);
  }
}
