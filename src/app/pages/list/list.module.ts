import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { ComicsListComponent } from './components/comics-list/comics-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { QueryComponent } from './components/query/query.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EditToolbarComponent } from './components/edit-toolbar/edit-toolbar.component';
import { ComicsOptionComponent } from './components/comics-option/comics-option.component';
import { ComicsQueryTypeComponent } from './components/comics-query-type/comics-query-type.component';
import { ComicsFavoritesComponent } from './components/comics-favorites/comics-favorites.component';
import { ComicsSelectTypeComponent } from './components/comics-select-type/comics-select-type.component';
import { ComicsUpdateComponent } from './components/comics-update/comics-update.component';
import { ComicsRankingComponent } from './components/comics-ranking/comics-ranking.component';
import { ComicsHomeComponent } from './components/comics-home/comics-home.component';
import { MenuTopToolbarComponent } from './components/menu-top-toolbar/menu-top-toolbar.component';
import { ComicsCacheComponent } from './components/comics-cache/comics-cache.component';
import { TemporaryFileComponent } from './components/temporary-file/temporary-file.component';
import { HistoryComponent } from './components/history/history.component';
import { DownloadOptionComponent } from './components/download-option/download-option.component';
import { ComicsListV2Component } from './components/comics-list-v2/comics-list-v2.component';
// import { ImageComponent } from 'src/app/library/public-api';


@NgModule({
  declarations: [
    IndexComponent,
    ComicsListComponent,
    MenuComponent,
    QueryComponent,
    BookmarksComponent,
    ToolbarComponent,
    EditToolbarComponent,
    ComicsOptionComponent,
    ComicsQueryTypeComponent,
    ComicsFavoritesComponent,
    ComicsSelectTypeComponent,
    ComicsUpdateComponent,
    ComicsRankingComponent,
    ComicsHomeComponent,
    MenuTopToolbarComponent,
    ComicsCacheComponent,
    TemporaryFileComponent,
    HistoryComponent,
    DownloadOptionComponent,
    ComicsListV2Component
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MaterialModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ListModule { }
