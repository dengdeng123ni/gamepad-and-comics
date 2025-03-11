import { Component } from '@angular/core';
import { GameSavesPageService } from '../../components/game-saves-page/game-saves-page.service';
import { ModulePageService } from '../../components/module-page/module-page.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(
    public GameSavesPage:GameSavesPageService,
    public ModulePage:ModulePageService
  ) {





  }




}
