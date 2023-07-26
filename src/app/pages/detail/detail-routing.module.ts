import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexDetailComponent } from './page/index/index.component';
import { BilibiliDetailComponent } from './page/bilibili-detail/bilibili-detail.component';

const routes: Routes = [
  { path: "detail/:id", component: IndexDetailComponent,data: { animation: 'DetailPage' } },
  { path: "bilibili_detail/:id", component: BilibiliDetailComponent,data: { animation: 'BilibiliDetailPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailRoutingModule { }
