import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//https://blog.angular-university.io/introduction-to-angular-2-forms-template-driven-vs-model-driven/
//import { FormsModule } from '@angular/forms'; //for the 'Template Driven Forms'
import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpClientModule }    from '@angular/common/http';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MaterialModule} from './materialModule';
import { OrderModule } from 'ngx-order-pipe';
//import {MatInputModule, MatFormFieldControl} from '@angular/material';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';
import { RimaAaaModule } from '@colabo-rima/rima_aaa/module';
import { ModerationCoreModule } from '@colabo-moderation/core/lib/module';

import {SDGsService} from './select-sdgs/sdgs.service';
import {CWCService} from './cwc/cwc.service';
import {DialoGameService} from './dialo-game/dialo-game.service';
import {ColaboFlowService} from './colabo-flow/colabo-flow.service';

// import {UsersProfilingService} from './users-profiling/users-profiling.service';
// import {UsersClusteringService} from './users-clustering/users-clustering.service';
// import { UsersClusteringComponent } from './users-clustering/users-clustering.component';
// import {UiSmsComponent} from './ui-sms/ui-sms.component';
// import {SMSApiService} from './ui-sms/sms-api.service';
// import {PromptsPresentationComponent} from './prompts-presentation/prompts-presentation.component';
import {IndexComponent} from './index/index.component';
import {SelectSdgsComponent} from './select-sdgs/select-sdgs.component';
import {SdgCardComponent} from './sdg-card/sdg-card.component';
import {CwcComponent} from './cwc/cwc.component';
import {AvatarComponent} from './avatar/avatar.component';
import {InsightsComponent} from './insights/insights.component';
import {RegisteredUsersComponent} from './registered-users/registered-users.component';
import {UserCardComponent} from './users/user-card.component';

import {DialoGameComponent} from './dialo-game/dialo-game.component';
import {DialogameCardsComponent} from './dialo-game/dialogame-cards/dialogame-cards.component';
import {DialogameCardComponent} from './dialo-game/dialogame-cards/dialogame-card/dialogame-card.component';
import {DialoGameResponseComponent} from './dialo-game/dialo-game-response/dialo-game-response.component';
import {CardDecoratorComponent} from './dialo-game/card-decorator/card-decorator.component';
import {ColaboFlowComponent} from './colabo-flow/colabo-flow.component';
//import {ModerationPanelComponent} from '@colabo-moderation/core';

import {Dialog1Btn, Dialog2Btn} from './util/dialog';

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

// import { AdvancedDialog } from './advanced-dialog/advanced-dialog.component';
// import { AdvancedDialogTest } from './advanced-dialog/advanced-dialog-test.component';

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
  Dialog2Btn,
  Dialog1Btn,
  IndexComponent,
  SelectSdgsComponent,
  SdgCardComponent,
  CwcComponent,
  AvatarComponent,
  InsightsComponent,
  RegisteredUsersComponent,
  UserCardComponent,

  DialogameCardsComponent,
  DialoGameComponent,
  DialogameCardComponent,
  DialoGameResponseComponent,
  CardDecoratorComponent,
  ColaboFlowComponent

  // AdvancedDialogTest
];

var moduleImports = [
  BrowserModule
  , HttpClientModule
  //,FormsModule,
  ,ReactiveFormsModule

  // Material
  , BrowserAnimationsModule
  , MaterialModule
  , FlexLayoutModule
  , AppRoutingModule
  , OrderModule
  // ,
  // MatInputModule,
  // MatFormFieldControl
  // rima
  , RimaAaaModule
  , ModerationCoreModule
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
  entryComponents: [
    // You must include your dialog class in the list of entryComponents in your module definition so that the AOT compiler knows to create the ComponentFactory for it.
    // @see: https://material.angular.io/components/dialog/overview#aot-compilation
    // AdvancedDialog,
    // NotificationComponent
    Dialog2Btn, Dialog1Btn, //needed otherwise "Runtime Error: No component factory found for Dialog"
  ],
  providers: [
    KnalledgeEdgeService, KnalledgeNodeService, KnalledgeMapService,
    {provide: "Plugins", useValue: Plugins},
    // provide ng build error: "Can't resolve all parameters for GlobalEmitterService"
    // {provide: GlobalEmitterService, useClass: GlobalEmitterService},
    {provide: GlobalEmittersArrayService, useClass: GlobalEmittersArrayService},
    SDGsService,
    CWCService,
    DialoGameService,
    ColaboFlowService
    // ColabowareRFIDService,
    // UsersProfilingService,
    // UsersClusteringService
    //SMSApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
