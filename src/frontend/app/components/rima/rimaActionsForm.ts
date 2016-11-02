import {Component, Inject} from '@angular/core';

import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {CfPuzzlesIbisService} from '../../dev_puzzles/ibis/cf.puzzles.ibis.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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

  public model: any;

  private componentShown:boolean = true;
  private ibisTypesService;
  private viewConfig:any;
  private policyConfig:any;
  private knalledgeNodeTypeChanged: string = "knalledgeNodeTypeChanged";

  search = (text$: Observable<string>) =>
    text$
      // .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : states.filter(v => new RegExp(term, 'gi').test(v)).splice(0, 10));

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
}
