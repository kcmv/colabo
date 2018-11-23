import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import {InsightsService} from '../moderation-panel/insights/insights.service';
// import { TopiChatSimpleMessageForm } from './simple-message-form/simple-message-form.component';
import {ModerationPanelComponent} from '../moderation-panel/moderation-panel.component';
import {InsightsComponent} from '../moderation-panel/insights/insights.component';
import {RegisteredUsersComponent} from '../moderation-panel/registered-users/registered-users.component';
import {UserCardComponent} from '../moderation-panel/users/user-card.component';
import {UserActionsStatusesComponent} from '../moderation-panel/insights/user-actions-statuses/user-actions-statuses.component';
import {UserModerationComponent} from '../user-moderation/user-moderation.component';

import { ColaboFlowCoreModule } from '@colabo-flow/f-core/lib/module';

import {RimaAaaModule} from '@colabo-rima/f-aaa/module';
import {TopiChatCoreModule} from '@colabo-topichat/f-core';
import {ColaboFlowTopiChatModule} from '@colabo-flow/f-topichat';
import {TopiChatSystemModule} from '@colabo-topichat/f-system';
import {SimilarityModule} from '@colabo-ai-ml/f-similarity';
import {ResultsVisualizationComponent} from '../moderation-panel/insights/results-visualization/results-visualization.component';
import {SdgsStatisticsComponent} from '../moderation-panel/insights/results-visualization/sdgs-statistics/sdgs-statistics.component';

var moduleDeclarations:any[] = [
  //  TopiChatSimpleMessageForm
  ModerationPanelComponent,
  InsightsComponent,
  RegisteredUsersComponent,
  UserCardComponent,
  UserActionsStatusesComponent,
  UserModerationComponent,
  ResultsVisualizationComponent,
  SdgsStatisticsComponent
];

var moduleImports: any[] = [
    RouterModule,

    ReactiveFormsModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,
    ColaboFlowCoreModule,
    RimaAaaModule,
    TopiChatCoreModule,
    ColaboFlowTopiChatModule,
    // TODO!!! FIX!!!
    // necessary because otherwise TopiChatCoreService is missing
    // not sure if we need to add it here or in modules that depends on it
    // like ColaboFlowTopiChatModule, TopiChatSystemModule, ...
    // if we add it there, then we might end up with N instances of TopiChatCoreService
    TopiChatSystemModule,
    SimilarityModule
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        InsightsService
    ]
})
export class ModerationCoreModule { }
