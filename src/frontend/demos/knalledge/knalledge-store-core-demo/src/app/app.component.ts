import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';

declare var knalledge:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // testing namespacing access,
  // as it will be in code written in JS
  edge:KEdge = new knalledge.KEdge();

  constructor(
    private http: HttpClient,
    private knalledgeEdgeService: KnalledgeEdgeService
  ){
    console.log('AppComponent:constructor');
  }

  getEdge(){
    this.edge = this.knalledgeEdgeService.getEdge('5');
  }
}
