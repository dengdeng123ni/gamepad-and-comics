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
import { InfoShortComponent } from './components/info-short/info-short.component';
import { DetailSettingsComponent } from './components/detail-settings/detail-settings.component';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';
import { GamepadThumbnailComponent } from './components/gamepad-thumbnail/gamepad-thumbnail.component';
import { OnePageThumbnailComponent } from './components/one-page-thumbnail/one-page-thumbnail.component';
import { ResetReadingProgressComponent } from './components/reset-reading-progress/reset-reading-progress.component';
import { GamepadLeftCircleToolbarComponent } from './components/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.component';
import { Section2Component } from './components/section2/section2.component';



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
    InfoShortComponent,
    DetailSettingsComponent,
    DoublePageThumbnailComponent,
    GamepadThumbnailComponent,
    OnePageThumbnailComponent,
    ResetReadingProgressComponent,
    GamepadLeftCircleToolbarComponent,
    Section2Component
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    MaterialModule
  ]
})
export class DetailModule { }
