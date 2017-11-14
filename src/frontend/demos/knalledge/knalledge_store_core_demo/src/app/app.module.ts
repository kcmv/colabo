import 'zone.js';
import 'reflect-metadata';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import {HttpModule} from '@angular/http'; //NG2
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MaterialModule} from './materialModule';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';

import { AppComponent, DialogNotImplemented } from './app.component';
import { KnalledgeStoreComponent } from './knalledge-store/knalledge-store.component';

@NgModule({
  declarations: [
    AppComponent,
    // You must include your dialog class in the list of declarations
    // @see: https://material.angular.io/components/dialog/overview#aot-compilation
    DialogNotImplemented,
    KnalledgeStoreComponent
  ],
  imports: [
    BrowserModule,
    // Material
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    // HttpModule,
    HttpClientModule,
    RouterModule
  ],
  entryComponents: [
    // You must include your dialog class in the list of entryComponents in your module definition so that the AOT compiler knows to create the ComponentFactory for it.
    // @see: https://material.angular.io/components/dialog/overview#aot-compilation
    DialogNotImplemented
  ],
  providers: [ KnalledgeEdgeService ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
