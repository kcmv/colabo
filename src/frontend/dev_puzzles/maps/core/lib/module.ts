import {MODULE_NAME} from './params';

import { NgModule } from '@angular/core';
import {MapsListComponent} from '../maps-list/maps-list.component';
// Material
import { MaterialModule } from './materialModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MapCreateForm} from '../maps-list/map-create/map-create-form';
import 'hammerjs';

import {MatBottomSheet, MatBottomSheetContainer} from '@angular/material';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import {RimaAaaModule} from '@colabo-rima/f-aaa/module';
import {BottomSheetOverviewExample} from '../maps-list/bottom-sheet-overview-example';

var moduleDeclarations:any[] = [
  //  components classes:
  MapsListComponent,
  // MapCreateForm,
  MatBottomSheetContainer,
  BottomSheetOverviewExample
  
];

var moduleImports: any[] = [
    //module dependencies:
    MaterialModule,

    // ReactiveFormsModule,

    // FormsModule,
    // FlexLayoutModule,

    // // Material
    BrowserAnimationsModule
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,//.concat([MatBottomSheetContainer]),
    providers: [ //service classes this module exports:
      MatBottomSheet,
      MatBottomSheetContainer
    ],
    entryComponents: [
      // MatBottomSheet
      // MapCreateForm,
      MatBottomSheetContainer
      
  ]
})
export class MapsCoreModule { }
