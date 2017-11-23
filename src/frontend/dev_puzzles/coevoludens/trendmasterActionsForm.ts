import {Component, Inject} from '@angular/core';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {CfPuzzlesIbisService} from '../ibis/cf.puzzles.ibis.service';
import {CfPuzzlesCoevoludensServices} from './cf.puzzles.coevoludens.service'

@Component({
    selector: 'coevoludens-trendmaster-actions',
    providers: [
    ],
    moduleId: module.id,
    templateUrl: 'partials/trendmaster-actions-form.tpl.html',
    styles: [`
    `]
})
export class TrendmasterActionsForm {
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
    private coevoludensService:CfPuzzlesCoevoludensServices,
    private ibisService:CfPuzzlesIbisService
  ) {
      // console.log('[TrendmasterActionsForm]');
      this.ibisTypesService = _IbisTypesService_;

      this.items = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('TrendmasterActionsForm', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  isPresenting():boolean{
    return this.coevoludensService.getStore().presenting;
  }

  selectItem (item) {
    this.selectedItem = item;
    this.ibisTypesService.selectActiveType(item);

    if(this.policyConfig.knalledgeMap){
      this.policyConfig.knalledgeMap.nextNodeType = null;
    }

    if(this.viewConfig.states.editingNode){
      this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged)
      .broadcast('TrendmasterActionsForm',{node:this.viewConfig.states.editingNode,type:item.type});
      //, this.selectedItem
    }
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }

  togglePyramid() {
    console.log('togglePyramid');
    //this.ibisService.createNodeQuestion();
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
