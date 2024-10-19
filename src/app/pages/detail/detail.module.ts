import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ComicsInfoComponent } from './components/comics-info/comics-info.component';
import { ChapterListMode1Component } from './components/chapter-list-mode1/chapter-list-mode1.component';
import { MaterialModule } from 'src/app/library/material.module';
import { ChapterListMode2Component } from './components/chapter-list-mode2/chapter-list-mode2.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { EditToolbarComponent } from './components/edit-toolbar/edit-toolbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { UnlockComponent } from './components/unlock/unlock.component';
import { ComicsOffprintDetailComponent } from './components/comics-offprint-detail/comics-offprint-detail.component';
import { ComicsOffprintThumbnailComponent } from './components/comics-offprint-thumbnail/comics-offprint-thumbnail.component';
import { IndexToolbarComponent } from './components/index-toolbar/index-toolbar.component';
import { KeyboardToolbarComponent } from './components/keyboard-toolbar/keyboard-toolbar.component';
import { ComicsToolbarComponent } from './components/comics-toolbar/comics-toolbar.component';
import { GamepadToolbarComponent } from './components/gamepad-toolbar/gamepad-toolbar.component';
import { DropDownMenuComponent } from './components/drop-down-menu/drop-down-menu.component';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';


@NgModule({
  declarations: [
    IndexComponent,
    ComicsInfoComponent,
    ChapterListMode1Component,
    ChapterListMode2Component,
    ToolbarComponent,
    ExportSettingsComponent,
    EditToolbarComponent,
    LoadingComponent,
    DoublePageThumbnailComponent,
    UnlockComponent,
    ComicsOffprintDetailComponent,
    ComicsOffprintThumbnailComponent,
    IndexToolbarComponent,
    KeyboardToolbarComponent,
    ComicsToolbarComponent,
    GamepadToolbarComponent,
    DropDownMenuComponent
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    MaterialModule
  ]
})
export class DetailModule { }
