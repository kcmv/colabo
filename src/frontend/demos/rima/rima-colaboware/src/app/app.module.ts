import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule }    from '@angular/common/http';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MaterialModule} from './materialModule';

import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';
import {ColabowareRFIDService} from '@colabo-ware/rfid/ColabowareRFIDService';
import {UsersProfilingService} from './users-profiling/users-profiling.service';
import {UsersClusteringService} from './users-clustering/users-clustering.service';
import { UsersClusteringComponent } from './users-clustering/users-clustering.component';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { UsersProfilingComponent } from './users-profiling/users-profiling.component';

import {UsersPopulationComponent} from './users-population/users-population.component';

import {UserInfoComponent} from './user-info/user-info.component';

import {TagsPopulationComponent} from './tags-population/tags-population.component';

import {UsersGroupsComponent} from './users-groups/users-groups.component';

var moduleDeclarations = [
  AppComponent,
  UsersProfilingComponent,
  UsersClusteringComponent,
  UsersPopulationComponent,
  UserInfoComponent,
  TagsPopulationComponent,
  UsersGroupsComponent
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

// import {GlobalEmitterService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterService';
import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

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
    {provide: GlobalEmittersArrayService, useClass: GlobalEmittersArrayService},
    ColabowareRFIDService,
    UsersProfilingService,
    UsersClusteringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
