import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { HistoryComponent } from './components/history/history.component';
import { LocalCacheComponent } from './components/local-cache/local-cache.component';
import { TemporaryFileComponent } from './components/temporary-file/temporary-file.component';
import { ComicsCustomChoiceComponent } from './components/comics-custom-choice/comics-custom-choice.component';
import { ComicsCustomMultipyComponent } from './components/comics-custom-multipy/comics-custom-multipy.component';
import { ComicsSearchComponent } from './components/comics-search/comics-search.component';
import { ComicsListV2Component } from './components/comics-list-v2/comics-list-v2.component';
import { DeveloperPageComponent } from './components/developer-page/developer-page.component';
import { NovelsListComponent } from './components/novels-list/novels-list.component';
import { PageStartComponent } from './components/page-start/page-start.component';

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    data: { animation: 'ListPage' },
    children: [
      {
        path: '', // child route path
        component: PageStartComponent, // child route component that the router renders
      },
      {
        path: 'query/:id/:sid/:pid', // child route path
        component: ComicsListV2Component, // child route component that the router renders
      },
      {
        path: 'query/:id/:sid', // child route path
        component: ComicsListV2Component, // child route component that the router renders
      },
      {
        path: 'query/:id', // child route path
        component: ComicsListV2Component, // child route component that the router renders
      },
      {
        path: 'novel_query/:id/:sid/:pid', // child route path
        component: NovelsListComponent, // child route component that the router renders
      },
      {
        path: 'novel_query/:id/:sid', // child route path
        component: NovelsListComponent, // child route component that the router renders
      },
      {
        path: 'novel_query/:id', // child route path
        component: NovelsListComponent, // child route component that the router renders
      },
      {
        path: 'history/:id', // child route path
        component: HistoryComponent, // child route component that the router renders
      },
      {
        path: 'local_cache', // child route path
        component: LocalCacheComponent, // child route component that the router renders
      },
      {
        path: 'temporary_file/:id', // child route path
        component: TemporaryFileComponent, // child route component that the router renders
      },
      {
        path: 'search/:id/:sid', // child route path
        component: ComicsSearchComponent, // child route component that the router renders
      },
      {
        path: 'search/:id', // child route path
        component: ComicsSearchComponent, // child route component that the router renders
      },
      {
        path: 'choice/:id/:sid', // child route path
        component: ComicsCustomChoiceComponent, // child route component that the router renders
      },
      {
        path: 'multipy/:id/:sid', // child route path
        component: ComicsCustomMultipyComponent, // child route component that the router renders
      },
      {
        path: 'developer/:id', // child route path
        component: DeveloperPageComponent, // child route component that the router renders
      },
    ]
  },
  { path: "specify_link/:id", component: IndexComponent, data: { animation: 'ListPage' } },
  { path: "list/:id/:sid", component: IndexComponent, data: { animation: 'ListPage' } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
