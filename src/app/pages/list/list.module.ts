import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { MenuComponent } from './components/menu/menu.component';
import { ComicsSelectTypeComponent } from './components/comics-select-type/comics-select-type.component';
import { TemporaryFileComponent } from './components/temporary-file/temporary-file.component';
import { HistoryComponent } from './components/history/history.component';
import { DownloadOptionComponent } from './components/download-option/download-option.component';
import { LocalCacheComponent } from './components/local-cache/local-cache.component';
import { ComicsSearchComponent } from './components/comics-search/comics-search.component';
import { ComicsListComponent } from './components/comics-list/comics-list.component';
import { ComicsCustomChoiceComponent } from './components/comics-custom-choice/comics-custom-choice.component';
import { ComicsCustomMultipyComponent } from './components/comics-custom-multipy/comics-custom-multipy.component';
import { PulgJavascriptComponent } from './components/pulg-javascript/pulg-javascript.component';
import { IndexToolbarComponent } from './components/index-toolbar/index-toolbar.component';
import { KeyboardToolbarComponent } from './components/keyboard-toolbar/keyboard-toolbar.component';
import { ControllerSettingsComponent } from './components/controller-settings/controller-settings.component';
import { ComicsListV2Component } from './components/comics-list-v2/comics-list-v2.component';
import { GamepadToolbarComponent } from './components/gamepad-toolbar/gamepad-toolbar.component';
import { UrlToComicsIdComponent } from './components/url-to-comics-id/url-to-comics-id.component';
import { TabToolbarComponent } from './components/tab-toolbar/tab-toolbar.component';
import { DropDownMenuComponent } from './components/drop-down-menu/drop-down-menu.component';
import { ComicsListConfigComponent } from './components/comics-list-config/comics-list-config.component';
import { ImageCompressionComponent } from './components/image-compression/image-compression.component';
import { ImageToComponent } from './components/image-to/image-to.component';
import { CompositeModule } from 'src/app/composite/composite.module';
import { DownloadProgressComponent } from './components/download-progress/download-progress.component';
import { WhenInputtingComponent } from './components/when-inputting/when-inputting.component';
import { MenuSearchComponent } from './components/menu-search/menu-search.component';
import { ComicsListV3Component } from './components/comics-list-v3/comics-list-v3.component';
import { SoundEffectsComponent } from './components/sound-effects/sound-effects.component';
import { AboutSoftwareComponent } from './components/about-software/about-software.component';
import { PlugInInstructionsComponent } from './components/plug-in-instructions/plug-in-instructions.component';
import { CachePageComponent } from './components/cache-page/cache-page.component';
import { UrlUsageGuideComponent } from './components/url-usage-guide/url-usage-guide.component';
import { GetKeyboardKeyComponent } from './components/get-keyboard-key/get-keyboard-key.component';
import { NovelsListComponent } from './components/novels-list/novels-list.component';
import { NovelsDownloadComponent } from './components/novels-download/novels-download.component';
// import { ImageComponent } from 'src/app/library/public-api';


@NgModule({
  declarations: [
    IndexComponent,
    ComicsListComponent,
    MenuComponent,
    ComicsSelectTypeComponent,
    TemporaryFileComponent,
    HistoryComponent,
    DownloadOptionComponent,
    LocalCacheComponent,
    ComicsSearchComponent,
    ComicsCustomChoiceComponent,
    ComicsCustomMultipyComponent,
    PulgJavascriptComponent,
    IndexToolbarComponent,
    KeyboardToolbarComponent,
    ControllerSettingsComponent,
    ComicsListV2Component,
    GamepadToolbarComponent,
    UrlToComicsIdComponent,
    TabToolbarComponent,
    DropDownMenuComponent,
    ComicsListConfigComponent,
    ImageCompressionComponent,
    ImageToComponent,
    DownloadProgressComponent,
    WhenInputtingComponent,
    MenuSearchComponent,
    ComicsListV3Component,
    SoundEffectsComponent,
    AboutSoftwareComponent,
    PlugInInstructionsComponent,
    CachePageComponent,
    UrlUsageGuideComponent,
    GetKeyboardKeyComponent,
    NovelsListComponent,
    NovelsDownloadComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    CompositeModule,
    MaterialModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ListModule { }
