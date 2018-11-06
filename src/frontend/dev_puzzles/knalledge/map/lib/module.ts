import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { KnalledgeViewEngineModule } from '@colabo-knalledge/f-view_enginee';
import { MapComponent } from './map-component/map.component';

var moduleDeclarations:any[] = [
    MapComponent
];

var moduleImports: any[] = [
    RouterModule,

    ReactiveFormsModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,
    KnalledgeViewEngineModule

];

declare var window: any;
export var Plugins: any = window.Config.Plugins;

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        { provide: "Plugins", useValue: Plugins },
    ]
})
export class KnalledgeMapModule { }