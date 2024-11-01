import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: "novels_detail/:id", component: IndexComponent,data: { animation: 'NovelsDetailPage' } },
  { path: "novels_detail/:source/:id", component: IndexComponent,data: { animation: 'NovelsDetailPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovelsDetailRoutingModule { }
