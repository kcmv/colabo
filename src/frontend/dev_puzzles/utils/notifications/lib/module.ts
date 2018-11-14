// @colabo-topichat/f-core

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { UtilsNotificationService } from './notifications.service';
import { SnackBarNotificationComponent } from './snack-bar-notification/snack-bar-notification-component';

var moduleDeclarations:any[] = [
    SnackBarNotificationComponent
];

var moduleImports: any[] = [
    RouterModule,

    ReactiveFormsModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,

];

@NgModule({
    declarations: moduleDeclarations,
    entryComponents: [
        SnackBarNotificationComponent
    ],
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        // provided at the top module
        // maybe we can provide `root` directive
        // UtilsNotificationService
    ]
})
export class UtilsNotificationModule { }