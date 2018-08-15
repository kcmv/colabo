import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewNodePageComponent } from './view-node-page/view-node-page.component';
import { ViewNodeComponent } from './view-node/view-node.component';
// import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import 'simplemde/dist/simplemde.min.css';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde/no-style'

var moduleDeclarations:any[] = [
    ViewNodePageComponent,
    ViewNodeComponent,
];

var simpleMdeOptions: any = {};

var moduleImports: any[] = [
    RouterModule,
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