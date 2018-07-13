import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { FormsModule } from '@angular/forms'; //for the 'Template Driven Forms'
import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpClientModule }    from '@angular/common/http';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MaterialModule} from './materialModule';
//import {MatInputModule, MatFormFieldControl} from '@angular/material';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';
import {ColabowareRFIDService} from '@colabo-colaboware/colaboware_rfid/ColabowareRFIDService';
// import {UsersProfilingService} from './users-profiling/users-profiling.service';
// import {UsersClusteringService} from './users-clustering/users-clustering.service';
// import { UsersClusteringComponent } from './users-clustering/users-clustering.component';
// import {UiSmsComponent} from './ui-sms/ui-sms.component';
// import {SMSApiService} from './ui-sms/sms-api.service';
// import {PromptsPresentationComponent} from './prompts-presentation/prompts-presentation.component';
import {RimaRegisterComponent} from './rima-register/rima-register.component';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

// import { UsersProfilingComponent } from './users-profiling/users-profiling.component';
//
// import {UsersPopulationComponent} from './users-population/users-population.component';
//
// import {UserInfoComponent} from './user-info/user-info.component';
//
// import {TagsPopulationComponent} from './tags-population/tags-population.component';
//
// import {UsersGroupsComponent} from './users-groups/users-groups.component';

var moduleDeclarations = [
  AppComponent,
  //UiSmsComponent,
  // PromptsPresentationComponent,
  // UsersProfilingComponent,
  // UsersClusteringComponent,
  // UsersPopulationComponent,
  // UserInfoComponent,
  // TagsPopulationComponent,
  // UsersGroupsComponent,
  RimaRegisterComponent
];

var moduleImports = [
  BrowserModule
  ,HttpClientModule
  //,FormsModule,
  ,ReactiveFormsModule

  // Material
  ,BrowserAnimationsModule
  ,MaterialModule
  ,FlexLayoutModule
  // ,
  // MatInputModule,
  // MatFormFieldControl
];
// moduleImports.push(MainModule);

moduleImports.push(AppRoutingModule);

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
    {provide: GlobalEmittersArrayService, useClass: GlobalEmittersArrayService},
    ColabowareRFIDService,
    // UsersProfilingService,
    // UsersClusteringService
    //SMSApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
