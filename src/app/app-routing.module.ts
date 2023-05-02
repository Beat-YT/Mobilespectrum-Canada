import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SpectrumPagesComponent } from './spectrum-pages/spectrum-pages.component';
import { MapPageComponent } from './map-page/map-page-page.component';
import { LocationPageComponent } from './location-page/location-page.component';
const routes: Routes = [
  { path: '404', component: NotFoundPageComponent },
  { path: 'map', component: MapPageComponent },
  { path: 'dynamic', component: SpectrumPagesComponent },
  { path: ':country', component: SpectrumPagesComponent },
  { path: '', component: HomePageComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
