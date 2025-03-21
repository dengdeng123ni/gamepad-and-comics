import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameSavesPageService } from '../../components/game-saves-page/game-saves-page.service';
import { ModulePageService } from '../../components/module-page/module-page.service';
import { LocalModulePageService } from '../../components/local-module-page/local-module-page.service';
import { UploadModulePageService } from '../../components/upload-module-page/upload-module-page.service';
import { ModuleDetailPageService } from '../../components/module-detail-page/module-detail-page.service';
import { SteamModuleService } from '../../services/steam-module.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  @ViewChild('inputField') inputField!: ElementRef;
  constructor(
    public GameSavesPage:GameSavesPageService,
    public LocalModulePage:LocalModulePageService,
    public UploadModulePage:UploadModulePageService,
    public ModuleDetailPage:ModuleDetailPageService,
    public SteamModule:SteamModuleService,
    public ModulePage:ModulePageService
  ) {





  }

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }

 // 开发者模式
 // 是否全屏 是否需要
 // 加载模组
 // 启动端口
 // ----------
 // 需要开发steam 云
 // steam 的联网功能

//




}
