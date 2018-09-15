import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

const demoMapName:string = 'Demo Map';

@Component({
  selector: 'app-get-map',
  templateUrl: './get-map.component.html',
  styleUrls: ['./get-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GetMapComponent implements OnInit {

  map:KMap = new KMap();
  edges:KEdge[] = [];
  nodes:KNode[] = [];
  @Input() map_id:string;

  constructor(
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService
  ) { }

  ngOnInit() {
    this.map_id = '56eac6bd913d88af03e9d1cb'; //'56ebeabb913d88af03e9d2d6'
    //this.nodes = [new KNode(),new KNode(),new KNode()];
    this.knalledgeMapService.getByName(demoMapName)
    .subscribe(maps => this.demoMapReceived(maps));
  }

  demoMapReceived(mapS:KMap[]):void{
    // this.map = mapS.data;
    console.log(`demoMapReceived:${mapS}`);
    if(mapS.length>0){
      this.mapReceived(mapS[0]);
    }
    else{
        console.log('there is no `Demo Map`. Creating it ...');
        this.map.name = demoMapName;
        //TODO:NG2: add Demo User at the beginning and use Demo Map
        this.map.iAmId = '556760847125996dc1a4a24f';
        this.knalledgeMapService.create(this.map)
        .subscribe(map => this.mapCreated(map));
    }
  }

  mapCreated(map:KMap):void{
    console.log('mapCreated');
  }

  getMap():void{
      //var map:KMap = new KMap();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.map =

      this.knalledgeMapService.getById(this.map_id)
        .subscribe(map => this.mapReceived(map));
      // an example of using a callback: this.knalledgeMapService.getById(this.map_id, this.mapReceived.bind(this));
  }

  mapReceived(mapS:any):void{
    // this.map = mapS.data;
    this.map.fill(mapS); //this.map = mapS.data;
    //this.map.name = 'test';
    console.log('map:');
    console.log(this.map);
  }

  getMapContent():void{
      //var map:KNode = new KNode();
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
