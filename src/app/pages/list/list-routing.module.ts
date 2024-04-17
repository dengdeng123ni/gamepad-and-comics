import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: "", component: IndexComponent,data: { animation: 'ListPage' } },
  { path: "specify_link/:id", component: IndexComponent,data: { animation: 'ListPage' } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
