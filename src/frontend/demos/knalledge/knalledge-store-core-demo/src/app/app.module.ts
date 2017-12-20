import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule }    from '@angular/common/http';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';
import {provideKnalledgeSearchService} from '@colabo-knalledge/knalledge_search/knalledge-search.service';

import { AppComponent } from './app.component';
import { GetNodeEdgeComponent } from './get-node-edge/get-node-edge.component';
import { GetMapComponent } from './get-map/get-map.component';
import { KnSearchComponent } from './kn-search/kn-search.component';


var apiUrl = 'http://fdbsun1.cs.umu.se:3030/demo3models/query';
// var apiUrl = 'http://dbpedia.org/sparql';
@NgModule({
  declarations: [
    AppComponent,
    GetNodeEdgeComponent,
    GetMapComponent,
    KnSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [KnalledgeEdgeService, KnalledgeNodeService, KnalledgeMapService,
    // http://blog.rangle.io/configurable-services-in-angular-2/
    provideKnalledgeSearchService(apiUrl)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
