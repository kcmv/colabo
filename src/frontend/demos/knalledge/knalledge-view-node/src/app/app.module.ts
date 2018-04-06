import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule }    from '@angular/common/http';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MaterialModule} from './materialModule';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { GetNodeComponent } from './get-node/get-node.component';
import { GetMapComponent } from './get-map/get-map.component';

var moduleDeclarations = [
  AppComponent,
  GetNodeComponent,
  GetMapComponent
];

var moduleImports = [
  BrowserModule,
  HttpClientModule,
  FormsModule,

  // Material
  BrowserAnimationsModule,
  MaterialModule
];
// moduleImports.push(MainModule);

moduleImports.push(AppRoutingModule);

import {GlobalEmitterService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterService';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

declare var window:any;
export var Plugins:any = window.Config.Plugins;

@NgModule({
  declarations: moduleDeclarations,
  imports: moduleImports,
  entryComponents: [],
  providers: [
    KnalledgeEdgeService, KnalledgeNodeService, KnalledgeMapService,
    {provide: "Plugins", useValue: Plugins},
    {provide: GlobalEmitterService, useClass: GlobalEmitterService},
    {provide: GlobalEmitterServicesArray, useClass: GlobalEmitterServicesArray}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }