import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from '../../app-routing.module';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {HttpModule} from '@angular/http';


export const ModulesExport= [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  AppRoutingModule,
  InfiniteScrollModule,
  HttpModule
];
