import {MODULE_NAME} from './params';

import { NgModule } from '@angular/core';
import {MapsListComponent} from '../maps-list/maps-list.component';
// Material
import { MaterialModule } from './materialModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import {RimaAaaModule} from '@colabo-rima/f-aaa/module';

var moduleDeclarations:any[] = [
  //  components classes:
  MapsListComponent
];

var moduleImports: any[] = [
    //module dependencies:
    MaterialModule

    // ReactiveFormsModule,

    // FormsModule,
    // FlexLayoutModule,

    // // Material
    // BrowserAnimationsModule,
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [ //service classes this module exports:
    ]
})
export class MapsCoreModule { }
