import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { GamepadVioceComponent } from './library/gamepad/gamepad-vioce/gamepad-vioce.component';
import { MaterialModule } from './library/material.module';
import { ContextMenuComponent } from './library/public-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailModule } from './pages/detail/detail.module';
import { ListModule } from './pages/list/list.module';
import { ReaderModule } from './pages/reader/reader.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CompositeModule } from './composite/composite.module';
import { NovelsDetailModule } from './pages/novels-detail/novels-detail.module';
import { NovelsRdeaderModule } from './pages/novels-reader/novels-reader.module';

const dbConfig: DBConfig = {
  name: 'db',
  version: 32,
  objectStoresMeta: [
    {
      store: 'data',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'list',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'details',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'pages',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'novels_list',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'novels_details',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'novels_pages',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'read_novels',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },

    {
      store: 'history',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'preload_comics',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'preload_pages',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'read_record',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },

    {
      store: 'local_details',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'local_comics',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'local_chapters',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'local_pages',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'read_comics_chapter',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'read_comics',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'comics_config',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'last_read_comics',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'last_read_chapter_page',
      storeConfig: { keyPath: 'chapter_id', autoIncrement: false },
      storeSchema: [
        { name: 'chapter_id', keypath: 'chapter_id', options: { unique: false } },
      ]
    },
    {
      store: 'chapter_first_page_cover',
      storeConfig: { keyPath: 'chapter_id', autoIncrement: false },
      storeSchema: [
        { name: 'chapter_id', keypath: 'chapter_id', options: { unique: false } },
      ]
    },
    {
      store: 'image',
      storeConfig: { keyPath: 'image_id', autoIncrement: false },
      storeSchema: [
        { name: 'image_id', keypath: 'image_id', options: { unique: false } },
      ]
    },
    {
      store: 'imageHW',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'image_info',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'script',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'router',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },

  ]
};



@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    GamepadVioceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    HttpClientModule,
    MaterialModule,
    ListModule,
    DetailModule,
    ReaderModule,
    CompositeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NovelsDetailModule,
    NovelsRdeaderModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
