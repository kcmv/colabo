import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

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
  edge:KEdge = new KEdge();
  node:KNode = new KNode();

  constructor(
    private http: HttpClient,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService
  ){
    console.log('AppComponent:constructor');
  }

  getEdge(){
      //var edge:KEdge = new KEdge();
      //'5543e78e645912db4fee96f0'
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.edge =
      this.knalledgeEdgeService.getById('5543e730645912db4fee96ea')
        .subscribe(edge => this.edgeReceived(edge)); //as KEdge
  }
  edgeReceived(edgeS:any):void{
    // this.edge = edgeS.data;
    this.edge.fill(edgeS); //this.edge = edgeS.data;
    this.edge.name = 'test';
    console.log('edge: ' + this.edge);
    console.log('2) edge:');
    console.log(this.edge);
    console.log('edge: ' + this.edge._id + ':'+ this.edge.sourceId+'->'+ this.edge.targetId);
  }

  getNode(){
      //var node:KNode = new KNode();
      //'5543e78e645912db4fee96f0'
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.node =
      this.knalledgeNodeService.getById('56e8c60e913d88af03e9d188')
        .subscribe(node => this.nodeReceived(node)); //as KNode
  }
  nodeReceived(nodeS:any):void{
    // this.node = nodeS.data;
    this.node.fill(nodeS); //this.node = nodeS.data;
    //this.node.name = 'test';
    console.log('node: ' + this.node);
    console.log('2) node:');
    console.log(this.node);
    console.log('node: ' + this.node._id + ':'+ this.node.name);
  }
}
