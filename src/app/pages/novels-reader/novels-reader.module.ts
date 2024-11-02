import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { NovelsReaderRoutingModule } from './novels-reader-routing.module';

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    NovelsReaderRoutingModule,
    MaterialModule,
  ]
})
export class NovelsRdeaderModule { }
