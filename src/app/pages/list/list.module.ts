import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { ComicsListComponent } from './components/comics-list/comics-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { ComicsSelectTypeComponent } from './components/comics-select-type/comics-select-type.component';
import { TemporaryFileComponent } from './components/temporary-file/temporary-file.component';
import { HistoryComponent } from './components/history/history.component';
import { DownloadOptionComponent } from './components/download-option/download-option.component';
import { ComicsQueryComponent } from './components/comics-query/comics-query.component';
import { LocalCacheComponent } from './components/local-cache/local-cache.component';
import { ComicsSearchComponent } from './components/comics-search/comics-search.component';
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
    ComicsQueryComponent,
    LocalCacheComponent,
    ComicsSearchComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MaterialModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ListModule { }
