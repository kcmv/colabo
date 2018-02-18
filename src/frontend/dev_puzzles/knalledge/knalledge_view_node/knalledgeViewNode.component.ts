import { Component, ReflectiveInjector, Injector, Inject, Optional, NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {MaterialModule} from './materialModule';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {KnalledgeSearchService} from '@colabo-knalledge/knalledge_search/knalledge-search.service';

/**
 * the namespace for core services for the KnAllEdge system
 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
 */

declare var d3:any;
declare var bb:any;

var moduleImports = [];
var componentDirectives = [];
// componentDirectives.push(KnalledgeViewComponent);

@NgModule({
  imports: moduleImports,
  declarations: componentDirectives
})

@Component({
  selector: 'node-properties',
  templateUrl: './nodeProperties.component.tpl.html',
  styleUrls: ['./nodeProperties.component.scss']
})

/**
* @class knalledgeMap
* @memberof fdb-graph.graph_core
*/

export class NodePropertiesComponent implements OnInit, AfterViewInit, OnDestroy{
  public title: string = 'Node Property';
  public selectedNodeChangedEvent = "selectedNodeChangedEvent";
  private Plugins:any;
  public vkNode: any;
  private GlobalEmitterServicesArray:any;
  private genderSelected:any = null;

  constructor(
    public dialog: MatDialog,
    public snackBar:MatSnackBar,
    private ng2injector:Injector,
    private activatedRoute: ActivatedRoute,
    private knalledgeSearchService: KnalledgeSearchService
  ) {
    this.Plugins = this.ng2injector.get('Plugins', null);
    this.GlobalEmitterServicesArray = this.ng2injector.get(GlobalEmitterServicesArray, null);
  }

  getInitialParams() {
      const search = this.activatedRoute.snapshot.paramMap.get('search');
      console.log("[KnalledgeViewComponent] search: ", search);
  }

  ngOnInit() {
    this.getInitialParams();
    this.GlobalEmitterServicesArray.register(this.selectedNodeChangedEvent);
    this.GlobalEmitterServicesArray.get(this.selectedNodeChangedEvent).subscribe('nodeProperties.component', vkNode => {
      var name = vkNode ? vkNode.kNode.name : null;
      this.vkNode = vkNode;
    });
  }

  ngAfterViewInit(){
    this.initContent();
  }

  ngOnDestroy() {
  }

  initContent(){

  }
}
