import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexListComponent } from './page/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { UploadSelectComponent } from './components/upload-select/upload-select.component';
import { UploadComponent } from './components/upload/upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { ListMode1Component } from './components/list-mode1/list-mode1.component';
import { ListMenuComponent } from './components/list-menu/list-menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ListSideComponent } from './components/list-side/list-side.component';
import { ListSortComponent } from './components/list-sort/list-sort.component';
import { ListSettingsComponent } from './components/list-settings/list-settings.component';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { ListEditComponent } from './components/list-edit/list-edit.component';
import { LanguageSettingsComponent } from './components/language-settings/language-settings.component';
import { SoftwareInformationComponent } from './components/software-information/software-information.component';
import { SponsorQrcodeComponent } from './components/sponsor-qrcode/sponsor-qrcode.component';
import { LoadingComponent } from './components/loading/loading.component';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';
import { GamepadLeftCircleToolbarComponent } from './components/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.component';


@NgModule({
  declarations: [
    IndexListComponent,
    UploadComponent,
    UploadSelectComponent,
    ListMode1Component,
    ListMenuComponent,
    ToolbarComponent,
    ListSideComponent,
    ListSortComponent,
    ListSettingsComponent,
    UploadListComponent,
    ListEditComponent,
    LanguageSettingsComponent,
    SoftwareInformationComponent,
    SponsorQrcodeComponent,
    LoadingComponent,
    GlobalSettingsComponent,
    GamepadLeftCircleToolbarComponent

  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class ListModule { }
