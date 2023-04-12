import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexReaderComponent } from './page/index/index.component';
import { Mode1Component } from './components/mode1/mode1.component';
import { ReaderSideComponent } from './components/reader-side/reader-side.component';
import { MaterialModule } from 'src/app/library/material.module';
import { SwiperModule } from 'swiper/angular';
import { ReaderNavbarBarComponent } from './components/reader-navbar-bar/reader-navbar-bar.component';
import { ReaderSectionComponent } from './components/reader-section/reader-section.component';
import { ReaderToolbarComponent } from './components/reader-toolbar/reader-toolbar.component';
import { PopupToolbarComponent } from './components/popup-toolbar/popup-toolbar.component';
import { ThumbnailListComponent } from './components/thumbnail-list/thumbnail-list.component';
import { SlideBottomComponent } from './components/slide-bottom/slide-bottom.component';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { ModeChangeComponent } from './components/mode-change/mode-change.component';
import { SectionComponent } from './components/section/section.component';
import { ThumbnailBottomComponent } from './components/thumbnail-bottom/thumbnail-bottom.component';
import { Mode2Component } from './components/mode2/mode2.component';
import { Mode3Component } from './components/mode3/mode3.component';
import { Mode4Component } from './components/mode4/mode4.component';
import { HandleLeftCircleToolbarComponent } from './components/handle-left-circle-toolbar/handle-left-circle-toolbar.component';
import { ReaderSettingsComponent } from './components/reader-settings/reader-settings.component';
import { ReadTimeComponent } from './components/read-time/read-time.component';
import { GamepadThumbnailComponent } from './components/gamepad-thumbnail/gamepad-thumbnail.component';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';
import { Mode5Component } from './components/mode5/mode5.component';
import { Mode6Component } from './components/mode6/mode6.component';
import { Mode7Component } from './components/mode7/mode7.component';
import { ReaderAutoComponent } from './components/reader-auto/reader-auto.component';

@NgModule({
  declarations: [
    IndexReaderComponent,
    Mode1Component,
    ReaderSideComponent,
    ReaderNavbarBarComponent,
    ReaderSectionComponent,
    ReaderToolbarComponent,
    PopupToolbarComponent,
    ThumbnailListComponent,
    SlideBottomComponent,
    SidebarLeftComponent,
    ModeChangeComponent,
    SectionComponent,
    ThumbnailBottomComponent,
    Mode2Component,
    Mode3Component,
    Mode4Component,
    HandleLeftCircleToolbarComponent,
    ReaderSettingsComponent,
    ReadTimeComponent,
    GamepadThumbnailComponent,
    DoublePageThumbnailComponent,
    Mode5Component,
    Mode6Component,
    Mode7Component,
    ReaderAutoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReaderRoutingModule,
    SwiperModule
  ]
})
export class ReaderModule { }
