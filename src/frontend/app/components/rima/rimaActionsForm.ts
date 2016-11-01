import {Component, Inject} from '@angular/core';

import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {CfPuzzlesIbisService} from '../../dev_puzzles/ibis/cf.puzzles.ibis.service';
@Component({
    selector: 'rima-actions-form',
    providers: [
        //MATERIAL_PROVIDERS
    ],
    moduleId: module.id,
    templateUrl: 'partials/rima-actions-form.tpl.html',
    styles: [`
    `]
})
export class RimaActionsForm {
  public kNodesTypes:Array<any> = [];
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
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,
    private ibisService:CfPuzzlesIbisService
  ) {
      // console.log('[RimaActionsForm]');
      this.ibisTypesService = _IbisTypesService_;

      this.kNodesTypes = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('RimaActionsForm', function(vkNode,type) {
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
      .broadcast('RimaActionsForm',{node:this.viewConfig.states.editingNode,type:item.type});
      //, this.selectedItem
    }
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }

  onQuestionItem() {
    this.ibisService.createNodeQuestion();
  }

  onIdeaItem() {
    this.ibisService.createNodeIdea();
  }

  onArgumentItem() {
    this.ibisService.createNodeArgument();
  }

  onCommentItem() {
    this.ibisService.createNodeComment();
  }

  onVoteUpItem() {
    this.ibisService.voteNodeUp();
  }

  onVoteDownItem() {
    this.ibisService.voteNodeDown();
  }
}
