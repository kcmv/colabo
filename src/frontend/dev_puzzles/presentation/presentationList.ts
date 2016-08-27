import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {NgIf, CORE_DIRECTIVES} from "@angular/common";
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {FORM_DIRECTIVES} from '@angular/forms';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

import {CfPuzzlesPresentationServices} from './cf.puzzles.presentation.service'
@Component({
    selector: 'presentation-list',
    providers: [
    ],
    directives: [
      MATERIAL_DIRECTIVES,
      NgIf, FORM_DIRECTIVES,
      MD_INPUT_DIRECTIVES
   ],
    moduleId: module.id,
    templateUrl: 'partials/presentation-list.tpl.html',
    styles: [`
    `]
})
export class PresentationList implements OnInit, OnDestroy {
  public items:Array<any> = [];
  public selectedItem:any = null;
  public commandsVisible:boolean = true;
  private componentShown:boolean = true;
  private viewConfig:any;
  private policyConfig:any;
  private knalledgeNodeTypeChanged: string = "knalledgeNodeTypeChanged";


  constructor(
    private service:CfPuzzlesPresentationServices,
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ) {
      // this.items = this.service.getTypes();
      // this.selectedItem = this.service.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('PresentationList', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  ngOnInit() {
    this.service.enable();
  }

  ngOnDestroy() {
    this.service.disable();
  }

  presentationAvailable():boolean {
    return this.service.presentationAvailable();
  }

  createPresentation():any {
    return this.service.createPresentation();
  }

  isFirst():boolean {
    return false;
  }

  isLast ():boolean {
    return false;
  }

  selectItem (item) {
    this.selectedItem = item;

    if(this.policyConfig.knalledgeMap){
      this.policyConfig.knalledgeMap.nextNodeType = null;
    }

    if(this.viewConfig.states.editingNode){
      this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged)
      .broadcast('PresentationList',{node:this.viewConfig.states.editingNode,type:item.type});
      //, this.selectedItem
    }
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }

  hideShowCommands (){
    this.commandsVisible = !this.commandsVisible;
  }
}
