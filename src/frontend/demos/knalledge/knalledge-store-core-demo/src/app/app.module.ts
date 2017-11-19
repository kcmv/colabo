import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule }    from '@angular/common/http';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';

import { AppComponent } from './app.component';
import { GetNodeEdgeComponent } from './get-node-edge/get-node-edge.component';


@NgModule({
  declarations: [
    AppComponent,
    GetNodeEdgeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [KnalledgeEdgeService, KnalledgeNodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
