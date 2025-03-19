import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SteamRoutingModule } from './steam-routing.module';
import { MaterialModule } from 'src/app/library/material.module';
import { IndexComponent } from './pages/index/index.component';
import { GameSavesPageComponent } from './components/game-saves-page/game-saves-page.component';
import { ModulePageComponent } from './components/module-page/module-page.component';
import { UploadModulePageComponent } from './components/upload-module-page/upload-module-page.component';
import { LocalModulePageComponent } from './components/local-module-page/local-module-page.component';
import { CreateModulePageComponent } from './components/create-module-page/create-module-page.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { SelectInputNumberComponent } from './components/select-input-number/select-input-number.component';
import { SelectTagMultipleComponent } from './components/select-tag-multiple/select-tag-multiple.component';
import { SelectTagSingleComponent } from './components/select-tag-single/select-tag-single.component';
import { SelectTimeRangeComponent } from './components/select-time-range/select-time-range.component';
import { SelectTimeComponent } from './components/select-time/select-time.component';
import { WhenInputtingComponent } from './components/when-inputting/when-inputting.component';
import { SelectDateComponent } from './components/select-date/select-date.component';
import { ModuleDetailPageComponent } from './components/module-detail-page/module-detail-page.component';


@NgModule({
  declarations: [
    IndexComponent,
    GameSavesPageComponent,
    ModulePageComponent,
    UploadModulePageComponent,
    LocalModulePageComponent,
    CreateModulePageComponent,

    WhenInputtingComponent,
    AdvancedSearchComponent,
    SelectInputNumberComponent,
    SelectTagMultipleComponent,
    SelectDateComponent,
    SelectTagSingleComponent,
    SelectTimeRangeComponent,
    SelectTimeComponent,
    ModuleDetailPageComponent
  ],
  imports: [
    CommonModule,
    SteamRoutingModule,
    MaterialModule,
  ]
})
export class SteamModule { }
