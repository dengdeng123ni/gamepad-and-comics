import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexReaderComponent } from './page/index/index.component';

const routes: Routes = [
  { path: "reader/:id", component: IndexReaderComponent,data: { animation: 'ReaderPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReaderRoutingModule { }
