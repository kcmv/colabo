import {MODULE_NAME} from './params';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { ColaboFlowAuditService } from './colabo-flow-audit.service';
import { ColaboFlowAuditForm } from './audit-form/audit-form.component';

var moduleDeclarations:any[] = [
    ColaboFlowAuditForm
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
        ColaboFlowAuditService
    ]
})
export class ColaboFlowAuditModule { }