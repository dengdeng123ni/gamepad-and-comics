import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../library/material.module';
import { TestComponent } from './test/test.component';
import { ComicsListV10Component } from './comics-list-v10/comics-list-v10.component';
import { MatrixComponent } from './matrix/matrix.component';
import { ComicsListV11Component } from './comics-list-v11/comics-list-v11.component';



@NgModule({
  declarations: [
    TestComponent,
    ComicsListV10Component,
    MatrixComponent,
    ComicsListV11Component
  ],
  exports: [
    TestComponent,
    MatrixComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class CompositeModule { }
