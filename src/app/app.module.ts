import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageComponent } from './home-page/home-page.component';
import { SpectrumPagesComponent } from './spectrum-pages/spectrum-pages.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FrequenciesBarComponent } from './components/frequencies-bar.component';

import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SpectrumPagesComponent,
    NotFoundPageComponent,
    FrequenciesBarComponent,
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB2DEvP5onyNzw9BfmYXTqgFU0k1e1x1nw' 
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
