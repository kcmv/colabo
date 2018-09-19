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

import { ColaboFlowCoreModule } from '@colabo-colaboflow/core/lib/module';

var moduleDeclarations:any[] = [
  //  TopiChatSimpleMessageForm
  ModerationPanelComponent
];

var moduleImports: any[] = [
    RouterModule,

    ReactiveFormsModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,
    ColaboFlowCoreModule
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
