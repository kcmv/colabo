import { Component, Input, ReflectiveInjector, Injector, Inject, Optional, NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {MaterialModule} from '../materialModule';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

import { KNode } from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

var moduleImports = [];
var componentDirectives = [];
// componentDirectives.push(KnalledgeViewComponent);

// import * as marked from 'marked';
import { MarkedExtendsions } from '../marked-extensions';

@NgModule({
  imports: moduleImports,
  declarations: componentDirectives
})

@Component({
  selector: 'knalledge-view-node-relatives',
  templateUrl: './view-node-relatives.component.tpl.html',
  styleUrls: ['./view-node-relatives.component.scss']
})

export class ViewNodeRelativesComponent implements OnInit, AfterViewInit, OnDestroy{
  public previousKnodes: KNode[] = [];
  public nextKnodes: KNode[] = [];
  public _kNode:KNode;
  public shouldShowComponent:boolean;
  public shouldShowNodeIdField:boolean;
  public navigate_to_node_id:string;

  @Input() public set kNode(val) {
    this._kNode = val;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    var kNode = new KNode();
    kNode.name = "Није лако бубамарцу";
    kNode._id = "580c0513d50bfd4f0ceacade";
    this.previousKnodes.push(kNode)

    var kNode = new KNode();
    kNode.name = "Крокодил Гена";
    kNode._id = "580c10bed50bfd4f0ceacb1c";
    this.previousKnodes.push(kNode)

    var kNode = new KNode();
    kNode.name = "Беле Руже";
    kNode._id = "58069bd6a37162160341d6e0";
    this.nextKnodes.push(kNode)

    var kNode = new KNode();
    kNode.name = "Ти ж мене підманула";
    kNode._id = "59d3fb284b077e6c540f758e";
    this.nextKnodes.push(kNode)

    var kNode = new KNode();
    kNode.name = "Любо, братцы, любо!";
    kNode._id = "59d3dba173a8d7b33b00972c";
    this.nextKnodes.push(kNode)
  }


  ngOnInit() {
  }

  ngAfterViewInit(){
    this.initContent();
  }

  ngOnDestroy() {
  }

  initContent(){

  }

  showComponent():void{
    this.shouldShowComponent = true;
  }
  hideComponent(): void {
    this.shouldShowComponent = false;
  }

  showNodeIdField():void{
    this.shouldShowNodeIdField = true;
  }
  hideNodeIdField(): void {
    this.shouldShowNodeIdField = false;
  }

  gotoKNode(knode_id:string){
    // const newUrlStr:string = this.router.createUrlTree([
    //   Object.assign({ 'id': this.node_id }, this.route.snapshot.params)
    // ], { relativeTo: this.route }).toString();
    // this.location.go(newUrlStr);
    // https://angular.io/api/router/Router#usage-3
    // router.navigate(['team', 33, 'user', 11], { relativeTo: route });
    // not working well :(
    // just appending instead of replacing
    // this.router.navigate(['id', this.node_id], { relativeTo: this.route });
    this.router.navigateByUrl('/node/id/' + knode_id);
  }
}
