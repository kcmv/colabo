import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import { ReactiveFormsModule } from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { KnalledgeMapPolicyService } from './knalledgeMapPolicyService';
import { KnalledgeMapViewService } from './knalledgeMapViewService';

import { KnalledgeViewComponent } from './knalledgeView.component/knalledgeView.component';

var moduleDeclarations: any[] = [
    KnalledgeViewComponent
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
        KnalledgeMapPolicyService,
        KnalledgeMapViewService
    ]
})
export class KnalledgeViewEngineModule { }