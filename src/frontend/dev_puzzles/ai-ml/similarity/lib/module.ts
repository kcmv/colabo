import { NgModule } from '@angular/core';

// import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { MaterialModule } from './materialModule';

//import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { SimilarityService } from './similarity.service';
import {SimilarityComponent} from './similarity.component';
import {SimilaritySuggestionsStatusesComponent} from './similarity-suggestions-statuses/similarity-suggestions-statuses.component';

var moduleDeclarations:any[] = [
  //  TopiChatSimpleMessageForm
  SimilarityComponent,
  SimilaritySuggestionsStatusesComponent
];

var moduleImports: any[] = [
    // RouterModule,

//    ReactiveFormsModule,

   FormsModule,
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
        SimilarityService
    ]
})
export class SimilarityModule { }
