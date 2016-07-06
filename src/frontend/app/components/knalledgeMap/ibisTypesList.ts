import {Component, OnInit, Inject} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES} from "@angular/common";
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';
import {NgIf, FORM_DIRECTIVES} from '@angular/common';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

@Component({
    selector: 'ibis-types-list',
    providers: [
        MATERIAL_PROVIDERS
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
    templateUrl: 'partials/ibisTypes-list.tpl.html',
    styles: [`
    `]
})
export class IbisTypesList {
  public items:Array<any> = [];
  public selectedItem:any = null;
  private componentShown:boolean = true;
  private ibisTypesService;
  private viewConfig:any;
  private knalledgeNodeTypeChanged: string = "knalledgeNodeTypeChanged";


  constructor(
    @Inject('IbisTypesService') _IbisTypesService_,
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ) {
      // console.log('[IbisTypesList]');
      this.ibisTypesService = _IbisTypesService_;

      this.items = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('IbisTypesList', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  selectItem (item) {
    this.selectedItem = item;
    this.ibisTypesService.selectActiveType(item);
    if(this.viewConfig.states.editingNode){
      this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged)
      .broadcast('IbisTypesList',{node:this.viewConfig.states.editingNode,type:item.type});
      //, this.selectedItem
    }
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }
}
