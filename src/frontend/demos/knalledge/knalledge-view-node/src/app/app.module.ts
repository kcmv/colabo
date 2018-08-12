import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

// Migrate this in a separate NgModule for a knalledge-view-node puzzle that will be injected and not this components separately
import { ViewNodePageComponent } from '@colabo-knalledge/knalledge_view_node/view-node-page/view-node-page.component';
import { ViewNodeComponent } from '@colabo-knalledge/knalledge_view_node/view-node/view-node.component';

import { GetMapComponent } from './get-map/get-map.component';

var moduleDeclarations = [
  AppComponent,
  ViewNodePageComponent,
  ViewNodeComponent,
  GetMapComponent
];

var moduleImports = [
  BrowserModule,
  HttpClientModule,
  FormsModule,
  RouterModule,

  // Material
  BrowserAnimationsModule,
  MaterialModule,

  AppRoutingModule
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
    KnalledgeEdgeService, KnalledgeNodeService, KnalledgeMapService,
    {provide: "Plugins", useValue: Plugins},
    // provide ng build error: "Can't resolve all parameters for GlobalEmitterService"
    // {provide: GlobalEmitterService, useClass: GlobalEmitterService},
    {provide: GlobalEmittersArrayService, useClass: GlobalEmittersArrayService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
