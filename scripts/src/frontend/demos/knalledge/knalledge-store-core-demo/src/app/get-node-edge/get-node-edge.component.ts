import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';

import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';

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
  edgesCreated:KEdge[] = [];
  @Input() map_id:string;
  @Input() node_id:string;
  @Input() node_name:string;
  @Input() node_type:string;

  @Input() edge_id:string;
  @Input() edge_name:string;
  @Input() edge_type:string;
  @Input() edge_source_id:string;
  @Input() edge_target_id:string;

  constructor(
    private http: HttpClient,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService
  ) { }

  ngOnInit() {
    this.map_id = 'f7baf6923c0c84b84f0d402a';
    this.node_id = '56eade22913d88af03e9d282';
    this.edge_id = '56eac765913d88af03e9d1cf'; //'5543e78e645912db4fee96f0'
    this.node_type = 'type_knowledge';
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
    //TODO:NG2: add Demo User at the beginning and use Demo Map Id
    node.iAmId = '556760847125996dc1a4a24f';
    node.mapId = this.map_id; //'56ebeabb913d88af03e9d2d6' //TODO:NG2 - use 'Demo Map' id
    node.name = this.node_name;
    node.type = this.node_type;
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

  nodeUpdated(node: KNode):void{
    console.log('nodeUpdated');
  }
  updateNode(node: KNode): void {
    this.knalledgeNodeService.update(node,null,null).subscribe(nodeS => this.nodeUpdated(nodeS));
  }

  createEdge():void{
    let edge:KEdge = new KEdge();
    //TODO:NG2: add Demo User at the beginning and use Demo Map Id
    edge.iAmId = '556760847125996dc1a4a24f';
    edge.mapId = this.map_id; //'56ebeabb913d88af03e9d2d6' //TODO:NG2 - use 'Demo Map' id
    edge.name = this.edge_name;
    edge.type = this.edge_type;
    edge.sourceId = this.edge_source_id;
    edge.targetId = this.edge_target_id;
    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeEdgeService.create(edge)
    .subscribe(edge => this.edgeCreated(edge));
  }

  edgeCreated(edge:KEdge):void{
    console.log('edgeCreated');
    console.log(edge);
    this.edgesCreated.push(edge);
  }

  edgeDeleted(id:string, success:boolean){
    if(success){
      this.edgesCreated = this.edgesCreated.filter(h => h._id !== id);
    }
  }

  deleteEdge(edge: KEdge): void {
    let id:string = edge._id;
    this.knalledgeEdgeService.destroy(id).subscribe(success => this.edgeDeleted(id,success));
  }
}
