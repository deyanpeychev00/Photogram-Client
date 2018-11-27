import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExportComponentsObj} from './export/components/export-components-obj';

const routes: Routes = [
  {path: '', component: ExportComponentsObj.Homepage},
  {path: 'login', component: ExportComponentsObj.Login},
  {path: 'register', component: ExportComponentsObj.Register},
  {path: 'journeys/discover', component: ExportComponentsObj.JourneyDiscover},
  {path: 'journeys/create', component: ExportComponentsObj.CreateJourney},
  {path: 'journeys/myjourneys', component: ExportComponentsObj.MyJourneys},
  {path: 'journeys/show/:id', component: ExportComponentsObj.JourneyDetails},
  {path: 'journeys/edit/:id', component: ExportComponentsObj.EditJourney},
  {path: 'admin', component: ExportComponentsObj.AdminPanel},
  {path: 'profile', component: ExportComponentsObj.Profile},
  {path: 'users/:username', component: ExportComponentsObj.UserPage},
  {path: 'page-not-found', component: ExportComponentsObj.Page404 },
  { path: '**', redirectTo: 'page-not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

