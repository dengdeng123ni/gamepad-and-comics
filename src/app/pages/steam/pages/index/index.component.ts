import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameSavesPageService } from '../../components/game-saves-page/game-saves-page.service';
import { ModulePageService } from '../../components/module-page/module-page.service';
import { LocalModulePageService } from '../../components/local-module-page/local-module-page.service';
import { UploadModulePageService } from '../../components/upload-module-page/upload-module-page.service';
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
    public ModulePage:ModulePageService
  ) {





  }

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }




}
