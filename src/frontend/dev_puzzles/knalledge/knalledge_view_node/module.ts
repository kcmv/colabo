import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';

import { ViewNodePageComponent } from './view-node-page/view-node-page.component';
import { ViewNodeComponent } from './view-node/view-node.component';
import { ViewNodeRelativesComponent } from './view-node-relatives/view-node-relatives.component';

var moduleDeclarations:any[] = [
    ViewNodePageComponent,
    ViewNodeComponent,
    ViewNodeRelativesComponent,
];

var simpleMdeOptions: any = {};

var moduleImports: any[] = [
    RouterModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,

    SimplemdeModule.forRoot({
        provide: SIMPLEMDE_CONFIG,
        // config options 1
        useValue: simpleMdeOptions
    })
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations
})
export class KnaledgeViewNodeModule { }