import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: "reader/:id", component: IndexComponent,data: { animation: 'ReaderPage' } },
  { path: ":id/:sid", component: IndexComponent,data: { animation: 'ReaderPage' } },
  { path: "comics/:source/:id/:sid", component: IndexComponent,data: { animation: 'ReaderPage' } },
  { path: "comics/:source/:id/:sid/:pid", component: IndexComponent,data: { animation: 'ReaderPage' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReaderRoutingModule { }
