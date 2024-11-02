import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: "novels_comics/:source/:id/:sid", component: IndexComponent,data: { animation: 'NovelsReaderPage' } },
  { path: "novels_comics/:source/:id/:sid/:pid", component: IndexComponent,data: { animation: 'NovelsReaderPage' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovelsReaderRoutingModule { }
