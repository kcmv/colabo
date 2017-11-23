import {Component, Inject} from '@angular/core';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {CfPuzzlesIbisService} from '../ibis/cf.puzzles.ibis.service';
import {CfPuzzlesPresentationServices} from './cf.puzzles.presentation.service'

@Component({
    selector: 'presentation-actions-form',
    providers: [
        //MATERIAL_PROVIDERS
    ],
    moduleId: module.id,
    templateUrl: 'partials/presentation-actions-form.tpl.html',
    styles: [`
    `]
})
export class PresentationActionsForm {
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
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,
    private presentationService:CfPuzzlesPresentationServices,
    private ibisService:CfPuzzlesIbisService
  ) {
      // console.log('[PresentationActionsForm]');
      this.ibisTypesService = _IbisTypesService_;

      this.items = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('PresentationActionsForm', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  isPresenting():boolean{
    return this.presentationService.getStore().presenting;
  }

  selectItem (item) {
    this.selectedItem = item;
    this.ibisTypesService.selectActiveType(item);

    if(this.policyConfig.knalledgeMap){
      this.policyConfig.knalledgeMap.nextNodeType = null;
    }

    if(this.viewConfig.states.editingNode){
      this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged)
      .broadcast('PresentationActionsForm',{node:this.viewConfig.states.editingNode,type:item.type});
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
