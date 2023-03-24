import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './components/info/info.component';
import { SectionComponent } from './components/section/section.component';
import { IndexDetailComponent } from './page/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { DetailRoutingModule } from './detail-routing.module';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { DetailSideComponent } from './components/detail-side/detail-side.component';
import { DetailToolbarComponent } from './components/detail-toolbar/detail-toolbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { HandleLeftCircleToolbarComponent } from './components/handle-left-circle-toolbar/handle-left-circle-toolbar.component';
import { InfoShortComponent } from './components/info-short/info-short.component';



@NgModule({
  declarations: [
    IndexDetailComponent,
    InfoComponent,
    SectionComponent,
    ThumbnailComponent,
    DetailSideComponent,
    DetailToolbarComponent,
    LoadingComponent,
    ExportSettingsComponent,
    HandleLeftCircleToolbarComponent,
    InfoShortComponent
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    MaterialModule
  ]
})
export class DetailModule { }
