import { MODULE_NAME } from "./params";

import { NgModule } from "@angular/core";

//import puzzle components:
//..

import { SDGsService } from "./sdgs.service";

// Material
import { MaterialModule } from "./materialModule";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "hammerjs";

var moduleDeclarations: any[] = [
  //  components classes:
];

var moduleImports: any[] = [
  //module dependencies:
  MaterialModule,

  // // Material
  BrowserAnimationsModule
  // MatBottomSheetModule
];

@NgModule({
  declarations: moduleDeclarations,
  imports: moduleImports,
  // exports: moduleImports.concat(moduleDeclarations)
  exports: moduleDeclarations,
  providers: [
    //service classes this module exports:
    SDGsService
  ],
  entryComponents: [
    // BottomSheetOverviewExampleSheet //https://material.angular.io/components/bottom-sheet/overview#configuring-bottom-sheet-content-via-code-entrycomponents-code-
  ]
})
export class SdgCoreModule {}
