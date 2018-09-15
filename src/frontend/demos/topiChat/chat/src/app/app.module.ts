import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HttpClientModule }    from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MaterialModule} from './materialModule';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { GetMapComponent } from './get-map/get-map.component';

// Puzzle Modules
import { RimaAaaModule } from '@colabo-rima/rima_aaa/module';
import {TopiChatCoreModule} from '@colabo-topiChat/core';

var moduleDeclarations = [
  AppComponent,
  GetMapComponent,
];

var moduleImports = [
  BrowserModule,
  HttpClientModule,
  FormsModule,
  RouterModule,

  FlexLayoutModule,

  // Material
  BrowserAnimationsModule,
  MaterialModule,

  AppRoutingModule, 

// Puzzle Modules
  RimaAaaModule,
  TopiChatCoreModule
];
// moduleImports.push(MainModule);
// moduleImports.push(AppRoutingModule);

// import {GlobalEmitterService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterService';
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

declare var window:any;
export var Plugins:any = window.Config.Plugins;

@NgModule({
  declarations: moduleDeclarations,
  imports: moduleImports,
  entryComponents: [],
  providers: [
    {provide: "Plugins", useValue: Plugins},
    // provide ng build error: "Can't resolve all parameters for GlobalEmitterService"
    // {provide: GlobalEmitterService, useClass: GlobalEmitterService},
    {provide: GlobalEmittersArrayService, useClass: GlobalEmittersArrayService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
