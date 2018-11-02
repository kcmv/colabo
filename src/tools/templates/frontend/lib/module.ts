// @colabo-topichat/f-core

import { NgModule } from '@angular/core';

// examples:
// import { FormsModule } from '@angular/forms';
// import { DemoPuzzleService } from './demo-puzzle-core.service';
// import { DemoPuzzleForm } from './demo-puzzle-form.component';

var moduleDeclarations:any[] = [
    // DemoPuzzleForm
];

var moduleImports: any[] = [
    // FormsModule,
];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        // DemoPuzzleService
    ]
})
export class {{module_name}}Module { }