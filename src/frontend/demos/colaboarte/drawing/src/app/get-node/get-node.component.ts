import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

//declare var knalledge:any;

@Component({
  selector: 'app-get-node',
  templateUrl: './get-node.component.html',
  styleUrls: ['./get-node.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GetNodeComponent implements OnInit {
  node:KNode = new KNode();
  nodesCreated:KNode[] = [];
  @Input() node_id:string;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService
  ) { }

  ngOnInit() {
    this.getInitialParams();
  }

  getInitialParams() {
    const nodeId = this.activatedRoute.snapshot.paramMap.get('nodeId');
    console.log("[KnalledgeViewComponent] nodeId: ", nodeId);
    if(nodeId){
      this.node_id = nodeId;
      this.getNode();
    }else{
      this.node_id = '580c0513d50bfd4f0ceacade';
    }
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
    //TODO:NG2: add Demo User at the beginning and use Demo Map Id
    node.iAmId = '556760847125996dc1a4a24f';
    node.mapId = '56eac6bd913d88af03e9d1cb'; //'56ebeabb913d88af03e9d2d6' //TODO:NG2 - use 'Demo Map' id
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

}
