import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SteamRoutingModule } from './steam-routing.module';
import { MaterialModule } from 'src/app/library/material.module';
import { IndexComponent } from './pages/index/index.component';
import { GameSavesPageComponent } from './components/game-saves-page/game-saves-page.component';
import { ModulePageComponent } from './components/module-page/module-page.component';


@NgModule({
  declarations: [
    IndexComponent,
    GameSavesPageComponent,
    ModulePageComponent,
  ],
  imports: [
    CommonModule,
    SteamRoutingModule,
    MaterialModule,
  ]
})
export class SteamModule { }
