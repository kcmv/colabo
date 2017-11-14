import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {KnalledgeEdgeService, Edge} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  edge:Edge

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
