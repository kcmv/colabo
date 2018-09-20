import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { MaterialModule } from './materialModule';

//import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { ColaboFlowService } from './colabo-flow.service';
// import { TopiChatSimpleMessageForm } from './simple-message-form/simple-message-form.component';
import {ColaboFlowComponent} from './info/colabo-flow.component';
import {ColaboFlowMComponent} from './moderation/colabo-flow-m.component';

var moduleDeclarations:any[] = [
  //  TopiChatSimpleMessageForm
  ColaboFlowComponent,
  ColaboFlowMComponent
];

var moduleImports: any[] = [
    RouterModule,

//    ReactiveFormsModule,

  //  FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        ColaboFlowService
    ]
})
export class ColaboFlowCoreModule { }
