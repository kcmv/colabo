import {Component, Inject} from '@angular/core';
import {NgIf, CORE_DIRECTIVES} from "@angular/common";
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {FORM_DIRECTIVES} from '@angular/forms';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

@Component({
    selector: 'ibis-actions-form',
    providers: [
        //MATERIAL_PROVIDERS
    ],
    directives: [
      MATERIAL_DIRECTIVES,
      // MdList, MdListItem, MdContent, MdButton, MdSwitch,
      NgIf, FORM_DIRECTIVES,
      // MdRadioButton, MdRadioGroup,
      //
      MD_INPUT_DIRECTIVES
   ],
    moduleId: module.id,
    templateUrl: 'partials/ibis-actions-form.tpl.html',
    styles: [`
    `]
})
export class IbisActionsForm {
  public items:Array<any> = [];
  public selectedItem:any = null;
  private componentShown:boolean = true;
  private ibisTypesService;
  private viewConfig:any;
  private policyConfig:any;
  private knalledgeNodeTypeChanged: string = "knalledgeNodeTypeChanged";


  constructor(
    @Inject('IbisTypesService') _IbisTypesService_,
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ) {
      // console.log('[IbisActionsForm]');
      this.ibisTypesService = _IbisTypesService_;

      this.items = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('IbisActionsForm', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  selectItem (item) {
    this.selectedItem = item;
    this.ibisTypesService.selectActiveType(item);

    if(this.policyConfig.knalledgeMap){
      this.policyConfig.knalledgeMap.nextNodeType = null;
    }

    if(this.viewConfig.states.editingNode){
      this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged)
      .broadcast('IbisActionsForm',{node:this.viewConfig.states.editingNode,type:item.type});
      //, this.selectedItem
    }
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }

    onQuestionItem() {
      if (!this.mapStructure.getSelectedNode()){
        window.alert('You have to select a node which you are addressing your question to.');
        return; // no parent node selected
      }
      if(this.mapStructure){
        var sourceNode = this.mapStructure.getSelectedNode();

        var vkNode = new knalledge.VKNode();
        vkNode.kNode = new knalledge.KNode();
        vkNode.kNode.type = knalledge.KNode.TYPE_IBIS_QUESTION;
        //vkNode.kNode.name = "...";

        var vkEdge = new knalledge.VKEdge();
        vkEdge.kEdge = new knalledge.KEdge();
        //vkEdge.kEdge.type = knalledgeEdgeType;

        this.mapStructure.createNodeWithEdge(sourceNode, vkEdge, vkNode, function(){
          if(this.mapUpdate){
            this.mapUpdate();
          }
          //this.....nodeSelected(vkNode);
          //this.setEditing(newNode);
        }.bind(this));
      }
    }

    onCommentItem() {
      if (!this.mapStructure.getSelectedNode()){
        window.alert('You have to select a node which you are addressing your comment to.');
        return; // no parent node selected
      }
      if(this.mapStructure){
        var sourceNode = this.mapStructure.getSelectedNode();

        var vkNode = new knalledge.VKNode();
        vkNode.kNode = new knalledge.KNode();
        vkNode.kNode.type = knalledge.KNode.TYPE_IBIS_COMMENT;
        //vkNode.kNode.name = "...";

        var vkEdge = new knalledge.VKEdge();
        vkEdge.kEdge = new knalledge.KEdge();
        //vkEdge.kEdge.type = knalledgeEdgeType;

        this.mapStructure.createNodeWithEdge(sourceNode, vkEdge, vkNode, function(){
          if(this.mapUpdate){
            this.mapUpdate();
          }
          //this.....nodeSelected(vkNode);
          //this.setEditing(newNode);
        }.bind(this));
      }
    }
}
