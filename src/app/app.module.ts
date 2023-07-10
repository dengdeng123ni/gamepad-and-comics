import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListModule } from './pages/list/list.module';
import { MaterialModule } from './library/material.module';
import { AppRoutingModule } from './app-routing.module';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './configs/db.config';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContextMenuComponent, GamepadExplanationComponent, GamepadVioceComponent } from './library/public-api';
import { ReaderModule } from './pages/reader/reader.module';
import { DetailModule } from './pages/detail/detail.module';
import { ServiceWorkerModule } from '@angular/service-worker';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');
@NgModule({
  declarations: [
    ContextMenuComponent,
    GamepadExplanationComponent,
    GamepadVioceComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ListModule,
    MaterialModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ReaderModule,
    DetailModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),

      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),


  ],

  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Added for custom elements support
  ]
})
export class AppModule { }
