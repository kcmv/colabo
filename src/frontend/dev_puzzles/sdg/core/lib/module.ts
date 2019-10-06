import { MODULE_NAME } from "./params";

import { NgModule } from "@angular/core";

//import puzzle components:
//..

import { SDGsService } from "./sdgs.service";
import { SelectSdgsComponent } from "./select-sdgs/select-sdgs.component";
import { SdgCardComponent } from "./sdg-card/sdg-card.component";
import { SelectedSdgsComponent } from "./selected-sdgs/selected-sdgs.component";

// Material
import { MaterialModule } from "./materialModule";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "hammerjs";

var moduleDeclarations: any[] = [
  //  components classes:
  SelectSdgsComponent,
  SdgCardComponent,
  SelectedSdgsComponent
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
