import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { NovelsReaderRoutingModule } from './novels-reader-routing.module';
import { NovelsReaderComponent } from './components/novels-reader/novels-reader.component';
import { ChaptersListComponent } from './components/chapters-list/chapters-list.component';

@NgModule({
  declarations: [
    IndexComponent,
    NovelsReaderComponent,
    ChaptersListComponent,
  ],
  imports: [
    CommonModule,
    NovelsReaderRoutingModule,
    MaterialModule,
  ]
})
export class NovelsRdeaderModule { }
