import { Component, Input, ReflectiveInjector, Injector, Inject, Optional, NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'knalledge-view-node',
  templateUrl: './view-node.component.tpl.html',
  styleUrls: ['./view-node.component.scss']
})

export class ViewNodeComponent implements OnInit, AfterViewInit, OnDestroy{
  public title: string = 'Node Property';
  public selectedNodeChangedEvent = "selectedNodeChangedEvent";
  private Plugins:any;
  public _kNode:KNode;
  protected oldTitle:string;
  protected oldProperty:any;
  public dataContentPropertyHTML:string;
  protected markedOptions:any;
  @Input() public set kNode(val) {
    this._kNode = val;

    this.renderProperty();
  }

  public editingTitle:boolean;
  public editingProperty:boolean;
  public simpleMdeOptionsHtml:any = {};
  private GlobalEmittersArrayService:any;
  private genderSelected:any = null;

  constructor(
    public dialog: MatDialog,
    public snackBar:MatSnackBar,
    private ng2injector:Injector,
    private activatedRoute: ActivatedRoute
  ) {
    this.Plugins = this.ng2injector.get('Plugins', null);
    this.GlobalEmittersArrayService = this.ng2injector.get(GlobalEmittersArrayService, null);

    if (MarkedExtendsions.nodeEditor && MarkedExtendsions.nodeEditor.renderer){
      this.markedOptions = {};
      this.markedOptions.renderer = MarkedExtendsions.nodeEditor.renderer;
    }
  }

  ngOnInit() {
    // this.getInitialParams();
    // this.GlobalEmittersArrayService.register(this.selectedNodeChangedEvent);
    // this.GlobalEmittersArrayService.get(this.selectedNodeChangedEvent).subscribe('nodeProperties.component', vkNode => {
    //   var name = vkNode ? vkNode.kNode.name : null;
    //   this.vkNode = vkNode;
    // });
  }

  ngAfterViewInit(){
    this.initContent();
  }

  ngOnDestroy() {
  }

  initContent(){

  }

  renderProperty(){
    if (this._kNode) {
      this.dataContentPropertyHTML = this._kNode.dataContent.property;
      if (this._kNode && this._kNode.dataContent && this._kNode.dataContent.property) {
        this.dataContentPropertyHTML
          = MarkedExtendsions.marked(this._kNode.dataContent.property, this.markedOptions);
      }
    }
  }

  deleteNode(){

  }

  editTitle(){
    this.editingTitle = true;
    this.oldTitle = this._kNode.name;
  }

  cancelEditingTitle(){
    this.editingTitle = false;
    this._kNode.name = this.oldTitle;
  }

  saveTitle(){
    this.editingTitle = false;
  }

  editProperty(){
    this.editingProperty = true;
    if (this._kNode && this._kNode.dataContent && this._kNode.dataContent.property) {
      this.oldProperty = this._kNode.dataContent.property;
    }
  }

  cancelEditingProperty(){
    this.editingProperty = false;
    if (this._kNode && this._kNode.dataContent && this._kNode.dataContent.property) {
      this._kNode.dataContent.property = this.oldProperty;
    }
  }

  readOnlyProperty() {
    this.renderProperty();
    this.editingProperty = false;
  }

}
