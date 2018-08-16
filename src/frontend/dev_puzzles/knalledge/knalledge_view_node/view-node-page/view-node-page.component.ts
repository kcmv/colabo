import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
// import { Location } from '@angular/common';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'knalledge-view-node-page',
  templateUrl: './view-node-page.component.html',
  styleUrls: ['./view-node-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewNodePageComponent implements OnInit {
  public node:KNode;
  shouldShowNodeIdField:boolean;
  dataContentPropertyHTML:string;
  nodesCreated:KNode[] = [];
  @Input() node_id:string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    // private location: Location,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService
  ) { }

  ngOnInit() {
    this.getInitialParams();
  }

  getInitialParams() {
    // subscribe to the parameters observable
    this.route.paramMap.subscribe(params => {
    const nodeId = this.route.snapshot.paramMap.get('nodeId');
    console.log("[KnalledgeViewComponent] nodeId: ", nodeId);
    if(nodeId){
      this.getNodeByID(nodeId);
    }
    });
  }

  showNodeIdField():void{
    this.shouldShowNodeIdField = true;
  }
  hideNodeIdField(): void {
    this.shouldShowNodeIdField = false;
  }
  getNode(): void {
    // this.getNodeByID(this.node_id);
    // const newUrlStr:string = this.router.createUrlTree([
    //   Object.assign({ 'id': this.node_id }, this.route.snapshot.params)
    // ], { relativeTo: this.route }).toString();
    // this.location.go(newUrlStr);
    // https://angular.io/api/router/Router#usage-3
    // router.navigate(['team', 33, 'user', 11], { relativeTo: route });
    // not working well :(
    // just appending instead of replacing
    // this.router.navigate(['id', this.node_id], { relativeTo: this.route });
    this.router.navigateByUrl('/node/id/' + this.node_id);
  }
  getNodeByID(id:string):void{
      //var node:KNode = new KNode();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.node =
      this.knalledgeNodeService.getById(id)
      .subscribe(node => {
        this.nodeReceived(node);
        // document.body.scrollTop = 0;
        window.scroll(0, 0);
      }); //as KNode
  }

  nodeReceived(nodeS:any):void{
    // this.node = nodeS.data;
    this.node = new KNode();
    this.node.fill(nodeS); //this.node = nodeS.data;
    //this.node.name = 'test';
    console.log('node: ' + this.node);
    console.log('2) node:');
    console.log(this.node);
    console.log('node: ' + this.node._id + ':'+ this.node.name);
  }

  /*
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
*/
}
