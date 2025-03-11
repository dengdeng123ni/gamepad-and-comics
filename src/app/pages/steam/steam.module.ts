import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SteamRoutingModule } from './steam-routing.module';
import { MaterialModule } from 'src/app/library/material.module';
import { IndexComponent } from './pages/index/index.component';
import { GameSavesPageComponent } from './components/game-saves-page/game-saves-page.component';
import { ModulePageComponent } from './components/module-page/module-page.component';
import { UploadModulePageComponent } from './components/upload-module-page/upload-module-page.component';
import { LocalModulePageComponent } from './components/local-module-page/local-module-page.component';


@NgModule({
  declarations: [
    IndexComponent,
    GameSavesPageComponent,
    ModulePageComponent,
    UploadModulePageComponent,
    LocalModulePageComponent,
  ],
  imports: [
    CommonModule,
    SteamRoutingModule,
    MaterialModule,
  ]
})
export class SteamModule { }
