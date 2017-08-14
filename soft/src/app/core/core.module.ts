import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf }       from '@angular/core';
import { CommonModule }      from '@angular/common';
import { HttpModule } from '@angular/http';

import { MQTTService }       from './mqtt.service';
import { MQTTServiceConfig } from './mqtt.config.service';




@NgModule({
  imports:      [ CommonModule, HttpModule ],
  providers:    [ MQTTService ]
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config?: MQTTServiceConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        {provide: MQTTServiceConfig, useValue: config }
      ]
    };
  }
}