import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { TopiChatCoreService } from './topiChat-core.service';
// import { TopiChatSimpleMessageForm } from './simple-message-form/simple-message-form.component';
import {ModerationPanelComponent} from '../moderation-panel/moderation-panel.component';
import {InsightsComponent} from '../moderation-panel/insights/insights.component';
import {RegisteredUsersComponent} from '../moderation-panel/registered-users/registered-users.component';
import {UserCardComponent} from '../moderation-panel/users/user-card.component';
import {UserActionsStatusesComponent} from '../moderation-panel/insights/user-actions-statuses/user-actions-statuses.component';

import { ColaboFlowCoreModule } from '@colabo-colaboflow/core/lib/module';

import {RimaAaaModule} from '@colabo-rima/rima_aaa/module';

var moduleDeclarations:any[] = [
  //  TopiChatSimpleMessageForm
  ModerationPanelComponent,
  InsightsComponent,
  RegisteredUsersComponent,
  UserCardComponent,
  UserActionsStatusesComponent
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
    RimaAaaModule
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        TopiChatCoreService
    ]
})
export class ModerationCoreModule { }
