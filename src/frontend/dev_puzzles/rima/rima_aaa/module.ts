import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { RimaLoginComponent } from './rima-login/rima-login.component';
import { RimaRegisterComponent } from './rima-register/rima-register.component';
import { RimaAAAService } from './rima-aaa.service';


var moduleDeclarations:any[] = [
    RimaLoginComponent,
    RimaRegisterComponent,
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
        RimaAAAService
    ]
})
export class RimaAaaModule { }