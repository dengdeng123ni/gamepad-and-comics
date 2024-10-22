import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: "detail/:id", component: IndexComponent,data: { animation: 'DetailPage' } },
  { path: "detail/:source/:id", component: IndexComponent,data: { animation: 'DetailPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailRoutingModule { }
