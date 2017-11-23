import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

//declare var knalledge:any;

@Component({
  selector: 'app-get-node-edge',
  templateUrl: './get-node-edge.component.html',
  styleUrls: ['./get-node-edge.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GetNodeEdgeComponent implements OnInit {
  edge:KEdge = new KEdge();
  node:KNode = new KNode();
  nodesCreated:KNode[] = [];
  @Input() edge_id:string;
  @Input() node_id:string;

  constructor(
    private http: HttpClient,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService
  ) { }

  ngOnInit() {
    this.node_id = '56eade22913d88af03e9d282';
    this.edge_id = '56eac765913d88af03e9d1cf'; //'5543e78e645912db4fee96f0'
  }

  getEdge():void{
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
    //this.edge.name = 'test';
    console.log('edge: ' + this.edge);
    console.log('2) edge:');
    console.log(this.edge);
    console.log('edge: ' + this.edge._id + ':'+ this.edge.sourceId+'->'+ this.edge.targetId);
  }

  getNode():void{
      //var node:KNode = new KNode();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.node =
      this.knalledgeNodeService.getById(this.node_id)
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

  createNode():void{
    let node:KNode = new KNode();
    node.name = 'Demo generated Node ' + node._id;
    node.iAmId = '556760847125996dc1a4a24f';
    node.mapId = '56eac6bd913d88af03e9d1cb'; //'56ebeabb913d88af03e9d2d6'
    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeNodeService.create(node)
    .subscribe(node => this.nodeCreated(node));
  }

  nodeCreated(node:KNode):void{
    console.log('nodeCreated');
    console.log(node);
    this.nodesCreated.push(node);
  }

  nodeDeleted(id:string, success:boolean){
    if(success){
      this.nodesCreated = this.nodesCreated.filter(h => h._id !== id);
    }
  }

  deleteNode(node: KNode): void {
    let id:string = node._id;
    this.knalledgeNodeService.destroy(id).subscribe(success => this.nodeDeleted(id,success));
  }

}
