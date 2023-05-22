import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { ModeChangeService } from '../mode-change/mode-change.service';
import { ReadTimeService } from '../read-time/read-time.service';
import { ReaderAutoSettingsService } from '../reader-auto-settings/reader-auto-settings.service';
import { ReaderSettingsService } from '../reader-settings/reader-settings.service';
import { ThumbnailBottomService } from '../thumbnail-bottom/thumbnail-bottom.service';
import { ReaderAutoService } from '../reader-auto/reader-auto.service';
import { ToolSelectService } from './tool-select.service';

@Component({
  selector: 'app-tool-select',
  templateUrl: './tool-select.component.html',
  styleUrls: ['./tool-select.component.scss']
})
export class ToolSelectComponent {
  constructor(
    public ModeChange: ModeChangeService,
    public thumbnailBottom: ThumbnailBottomService,
    public readerSettings:ReaderSettingsService,
    public i18n:I18nService,
    public current: CurrentReaderService,
    public config:ConfigReaderService,
    public readTime:ReadTimeService,
    public readerAuto:ReaderAutoService,
    public toolSelect:ToolSelectService,
    public readerAutoSettings:ReaderAutoSettingsService
  ) { }
  on($event) {
    if(this.toolSelect._bool){
      this.ModeChange.open(null, "gamepad_mode_change")
      return
    }
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y =( window.innerHeight-512)/2;
    // this.uploadSelect.open({ x, y });
    this.ModeChange.open({ top:`${y}px`, right:`${x}px` })
  }

  openSettings($event){

    if(this.toolSelect._bool){
      this.readerSettings.open({
        panelClass: "reader_settings_center"
      })
      return
    }
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (position.y + (position.height / 2)) - (openTargetHeight / 2);
     this.readerSettings.open({
      position:{ top:`${y}px`, right:`${x}px` },
      delayFocusTrap:false,
      panelClass:"reader_settings_right",
      backdropClass:"reader_settings_right_backdrop",
     })

  }
  openReaderAutoSettings($event) {
    if(this.readerAuto.opened){
     this.readerAuto.close();
     return
    }
    if(this.toolSelect._bool){
      this.readerAutoSettings.open()
      return
    }
    // readerSettings.open_bottom_sheet({});
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = window.innerWidth-x+8;
    y = (window.innerHeight) - (y+height/2) -54;
    this.readerAutoSettings.open({
      position: {
        bottom: `${y}px`,
        right: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }
  close(){
    this.toolSelect.close();
  }
}
