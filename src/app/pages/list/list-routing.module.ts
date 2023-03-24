import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexListComponent } from './page/index/index.component';

const routes: Routes = [
  { path: "", component: IndexListComponent,data: { animation: 'ListPage' } },
  // { path: ":id", component: IndexListComponent,data: { animation: 'ListPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
