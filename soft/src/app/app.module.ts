import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { MaterialCustomModule } from "./material.custom.module";
import { AppRoutingModule } from "./app.routing.module";
import { NvD3Module } from 'ng2-nvd3';


import { AppComponent } from './app.component';

import {MainPageComponent} from "./pages/main.page.component";
import {ConfigComponent} from "./pages/config.component";

@NgModule({
  declarations: [
    AppComponent,
    
    MainPageComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NvD3Module,
    CoreModule.forRoot({
      host:"localhost",
      port:1884  //port pour le WS
    }),
    MaterialCustomModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
