import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { TopiChatClientsOrchestrationService } from './topiChat-clients-orchestration.service';
import { TopiChatClientsOrchestrationForm } from './clients-orchestration/clients-orchestration-form.component';

var moduleDeclarations:any[] = [
    TopiChatClientsOrchestrationForm
];

var moduleImports: any[] = [
    RouterModule,

    ReactiveFormsModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,

];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        TopiChatClientsOrchestrationService
    ]
})
export class TopiChatClientsOrchestrationModule { }