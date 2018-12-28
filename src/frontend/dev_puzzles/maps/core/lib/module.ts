import {MODULE_NAME} from './params';

import { NgModule } from '@angular/core';
import {MapsListComponent} from '../maps-list/maps-list.component';
// Material
import { MaterialModule } from './materialModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MapCreateForm} from '../maps-list/map-create/map-create-form';
import {BottomShDg} from '../maps-list/bottom-sh-dg/bottom-sh-dg';
import 'hammerjs';
import { RouterModule} from '@angular/router';

import {
  // MatBottomSheet, 
  MatBottomSheetModule} from '@angular/material';

import { FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import {RimaAaaModule} from '@colabo-rima/f-aaa/module';
// import { BottomSheetOverviewExample, BottomSheetOverviewExampleSheet} from '../maps-list/bottom-sheet-overview-example';

var moduleDeclarations:any[] = [
  //  components classes:
  MapsListComponent,
  MapCreateForm,
  BottomShDg
  // BottomSheetOverviewExample,
  // BottomSheetOverviewExampleSheet
];

var moduleImports: any[] = [
    //module dependencies:
    MaterialModule,

    ReactiveFormsModule,

    FormsModule,
    RouterModule,
    // FlexLayoutModule,

    // // Material
    BrowserAnimationsModule,
    MatBottomSheetModule
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [ //service classes this module exports:
      
    ],
    entryComponents: [
      MapCreateForm, BottomShDg //https://material.angular.io/components/bottom-sheet/overview#configuring-bottom-sheet-content-via-code-entrycomponents-code-
      // BottomSheetOverviewExampleSheet //https://material.angular.io/components/bottom-sheet/overview#configuring-bottom-sheet-content-via-code-entrycomponents-code-
      
  ]
})
export class MapsCoreModule { }
