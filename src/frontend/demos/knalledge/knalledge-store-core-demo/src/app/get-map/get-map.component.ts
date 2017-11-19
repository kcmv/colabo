import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';



@Component({
  selector: 'app-get-map',
  templateUrl: './get-map.component.html',
  styleUrls: ['./get-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GetMapComponent implements OnInit {

  edges:KEdge[] = [];
  nodes:KNode[] = [];
  @Input() map_id:string;

  constructor(
    private http: HttpClient,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService
  ) { }

  ngOnInit() {
    this.map_id = '56eac6bd913d88af03e9d1cb'; //'56ebeabb913d88af03e9d2d6'
    //this.nodes = [new KNode(),new KNode(),new KNode()];
  }

  getMapContent(){
      //var node:KNode = new KNode();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.node =
      this.knalledgeNodeService.queryInMap(this.map_id)
        .subscribe(nodes => this.nodesReceived(nodes)); //as KNode
      this.knalledgeEdgeService.queryInMap(this.map_id)
        .subscribe(edges => this.edgesReceived(edges)); //as KNode
  }

  nodesReceived(nodesS:Array<KNode>):void{
    // this.nodes = nodesS.data;
    //this.nodes.fill(nodesS); //this.nodes = nodesS.data;
    //this.nodes.name = 'test';
    console.log('nodes: ' + this.nodes);
    this.nodes = nodesS;
  }

  edgesReceived(edgesS:Array<KEdge>):void{
    // this.edges = edgesS.data;
    //this.edges.fill(edgesS); //this.edges = edgesS.data;
    //this.edges.name = 'test';
    console.log('edges: ' + this.edges);
    this.edges = edgesS;
  }

  /*
  getEdge(){
      //var edge:KEdge = new KEdge();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.edge =
      this.knalledgeEdgeService.getById(this.edge_id)
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
  */

}
