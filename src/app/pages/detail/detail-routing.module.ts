import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexDetailComponent } from './page/index/index.component';

const routes: Routes = [
  { path: "detail/:id", component: IndexDetailComponent,data: { animation: 'DetailPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailRoutingModule { }
