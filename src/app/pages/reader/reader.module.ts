import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ReaderToolbarComponent } from './components/reader-toolbar/reader-toolbar.component';
import { MaterialModule } from 'src/app/library/material.module';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';
import { ChaptersThumbnailComponent } from './components/chapters-thumbnail/chapters-thumbnail.component';
import { OnePageThumbnailMode1Component } from './components/one-page-thumbnail-mode1/one-page-thumbnail-mode1.component';
import { OnePageThumbnailMode2Component } from './components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.component';
import { OnePageThumbnailMode3Component } from './components/one-page-thumbnail-mode3/one-page-thumbnail-mode3.component';
import { OnePageThumbnailMode4Component } from './components/one-page-thumbnail-mode4/one-page-thumbnail-mode4.component';
import { ReaderNavbarBarComponent } from './components/reader-navbar-bar/reader-navbar-bar.component';
import { ReaderSectionComponent } from './components/reader-section/reader-section.component';
import { OnePageReaderComponent } from './components/one-page-reader/one-page-reader.component';
import { MultiplePageReaderMode1Component } from './components/multiple-page-reader-mode1/multiple-page-reader-mode1.component';
import { MultiplePageReaderMode3Component } from './components/multiple-page-reader-mode3/multiple-page-reader-mode3.component';
import { MultiplePageReaderMode2Component } from './components/multiple-page-reader-mode2/multiple-page-reader-mode2.component';
import { ReaderChangeComponent } from './components/reader-change/reader-change.component';
import { CustomGridComponent } from './components/custom-grid/custom-grid.component';
import { ToolbarOptionComponent } from './components/toolbar-option/toolbar-option.component';
import { SetChapterFirstPageCoverComponent } from './components/set-chapter-first-page-cover/set-chapter-first-page-cover.component';
import { ChaptersListComponent } from './components/chapters-list/chapters-list.component';
import { CanvasImage1Component } from './components/canvas-image1/canvas-image1.component';
import { DoublePageReaderV2Component } from './components/double-page-reader-v2/double-page-reader-v2.component';
import { DoublePageReaderV2DefaultComponent } from './components/double-page-reader-v2-default/double-page-reader-v2-default.component';
import { ReaderConfigComponent } from './components/reader-config/reader-config.component';
import { LoadingCoverComponent } from './components/loading-cover/loading-cover.component';
import { ComicsDetailComponent } from './components/comics-detail/comics-detail.component';
import { KeyboardToolbarComponent } from './components/keyboard-toolbar/keyboard-toolbar.component';
import { OnePageReaderV2Component } from './components/one-page-reader-v2/one-page-reader-v2.component';
import { OnePageReaderV2DefaultComponent } from './components/one-page-reader-v2-default/one-page-reader-v2-default.component';
import { UnlockComponent } from './components/unlock/unlock.component';
import { GamepadToolbarComponent } from './components/gamepad-toolbar/gamepad-toolbar.component';
import { ChaptersFirstCoverSettingsComponent } from './components/chapters-first-cover-settings/chapters-first-cover-settings.component';
import { ComicsSettingsComponent } from './components/comics-settings/comics-settings.component';
import { ResetReadingProgressComponent } from './components/reset-reading-progress/reset-reading-progress.component';
import { FilterComponent } from './components/filter/filter.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ReaderBackgroundSettingsComponent } from './components/reader-background-settings/reader-background-settings.component';

@NgModule({
  declarations: [
    IndexComponent,
    ReaderToolbarComponent,
    DoublePageThumbnailComponent,
    ChaptersThumbnailComponent,
    OnePageThumbnailMode1Component,
    OnePageThumbnailMode2Component,
    OnePageThumbnailMode3Component,
    OnePageThumbnailMode4Component,
    ReaderNavbarBarComponent,
    ReaderSectionComponent,
    OnePageReaderComponent,
    MultiplePageReaderMode1Component,
    MultiplePageReaderMode3Component,
    MultiplePageReaderMode2Component,
    ReaderChangeComponent,
    CustomGridComponent,
    ToolbarOptionComponent,
    SetChapterFirstPageCoverComponent,
    ChaptersListComponent,
    CanvasImage1Component,
    DoublePageReaderV2Component,
    DoublePageReaderV2DefaultComponent,
    ReaderConfigComponent,
    LoadingCoverComponent,
    KeyboardToolbarComponent,
    ComicsDetailComponent,
    OnePageReaderV2Component,
    OnePageReaderV2DefaultComponent,
    UnlockComponent,
    GamepadToolbarComponent,
    ChaptersFirstCoverSettingsComponent,
    ComicsSettingsComponent,
    ResetReadingProgressComponent,
    FilterComponent,
    LoadingComponent,
    ExportSettingsComponent,
    ReaderBackgroundSettingsComponent
  ],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    MaterialModule,
  ]
})
export class ReaderModule { }
