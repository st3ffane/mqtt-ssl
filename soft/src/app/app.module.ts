import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { MaterialCustomModule } from "./material.custom.module";
import { AppRoutingModule } from "./app.routing.module";
import { NvD3Module } from 'ng2-nvd3';


import { AppComponent } from './app.component';

import {MainPageComponent} from "./pages/main.page.component";
import {ConfigComponent} from "./pages/config.component";


const connectOptions = {
    host: "127.0.0.1",
    port: 9883,
    protocol: "mqtts",
    keepalive: 10,
    clientId: "ng2-app-0001",
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    /*reconnectPeriod: 2000,
    connectTimeout: 2000,
    key: fs.readFileSync("./keys/key.pem"),
    cert: fs.readFileSync("./keys/cert.pem"),*/
    rejectUnauthorized: false,//a cause du certificat auto-signé!!!
};


@NgModule({
  declarations: [
    AppComponent,
    
    MainPageComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NvD3Module,
    CoreModule.forRoot({
      options: connectOptions,
      subscribes:['hrdw/state','hrdw/hello','hrdw/speed','hrdw/temp','hrdw/mem','hrdw/config_set']
    }),
    MaterialCustomModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
