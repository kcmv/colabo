import {Component, OnInit, Inject} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES} from "@angular/common";

import {NgIf, FORM_DIRECTIVES} from '@angular/common';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';

import { Pipe, PipeTransform } from '@angular/core';

// import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
// import {MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material';
// import {KnalledgeMapViewService} from './knalledgeMapViewService';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

declare var knalledge;

/**
 * Directive that holds CollaboFramework tools on the left side of the map
 *
 * Selector: `knalledge-map-tools`
 * @class RimaUsersList
 * @memberof knalledge.knalledgeMap
 * @constructor
*/

@Pipe({ name: 'sortUsersByDisplayName' })
export class SortUsersByDisplayNamePipe implements PipeTransform {

  compareByDisplayName(a:any,b:any){
    if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) return -1;
    if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) return 1;
    return 0;
  }

  transform(users: any[]) {
    var sorted:Array<any> = [];
    for(var i=0; i<users.length; i++){
      var user= users[i];
      sorted.push(user);
    }
    //return users.sort(this.compareByDisplayName);
    return sorted.sort(this.compareByDisplayName);
  }
}

@Component({
    selector: 'rima-users-list',
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
   pipes: [SortUsersByDisplayNamePipe],
   styles: [`
        // .msg {
        //     font-size: 0.5em;
        // }
        // .container{
        //     margin: 5px;
        //     border: 1px solid gray;
        // }
    `],
    moduleId: module.id,
    templateUrl: 'partials/rima-users-list.tpl.html'
})

export class RimaUsersList implements OnInit{
    // viewConfigChangedEventName:string = "viewConfigChangedEvent";
    // //viewspecChangedEventName:string = "viewspecChangedEvent";
    // behaviourChangedEventName:string = "behaviourChangedEvent";
    // broadcastingChangedEventName:string = "broadcastingChangedEvent";
    //
    // viewConfig:Object;

    public items:Array<any> = [];
    public selectedItem:any = null;
    public newParticipant;
    private policyConfig:any;
    private componentShown:boolean = true;

    // knRealTimeBroadcastUpdateMaps:string = "update-maps";
    // knRealTimeBroadcastReloadMaps:string = "reload-maps";

    private knAllEdgeRealTimeService;
    private rimaService;

    // private globalEmitterServicesArray:GlobalEmitterServicesArray;

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        // @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray,
        @Inject('KnAllEdgeRealTimeService') _KnAllEdgeRealTimeService_,
        @Inject('RimaService') _RimaService_

        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[RimaUsersList]');
        this.policyConfig = knalledgeMapPolicyService.get().config;
        // this.viewConfig = knalledgeMapViewService.get().config;

        // this.globalEmitterServicesArray = globalEmitterServicesArray;
        // globalEmitterServicesArray.register(this.viewConfigChangedEventName);
        //globalEmitterServicesArray.register(this.viewspecChangedEventName);
        // globalEmitterServicesArray.register(this.behaviourChangedEventName);
        // globalEmitterServicesArray.register(this.broadcastingChangedEventName);
        this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
        this.rimaService = _RimaService_;

        // $scope.items.sort(compare);

        this.selectedItem = this.rimaService.getActiveUser();
        // if(this.rimaService.whoAmIs.$resolved){
        //   this.initUsers(this.rimaService.whoAmIs);
        // }else{
        //   this.rimaService.whoAmIs.$promise.then(function(whoAmIs){this.initUsers(whoAmIs);});
        // }
        console.log('[RimaUsersList] rimaService.config.showUsers:'+this.rimaService.config.showUsers);
        this.newParticipant = new knalledge.WhoAmI();
        // $scope.howAmIs = RimaService.getAllHows();
    }

    // broadcastReloadMaps: Function = function(){
    //     this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastReloadMaps);
    // };

    ngOnInit() {
      this.items = this.rimaService.whoAmIs;
    }

    get showUsers(){
      return this.rimaService.config.showUsers;
    }

    set showUsers(show){
      this.rimaService.config.showUsers = show;
    }

    selectItem (item){
      //console.log("$scope.selectedItem = " + $scope.selectedItem.displayName + ": " + $scope.selectedItem._id);
      if(this.policyConfig.moderating.enabled){
        this.selectedItem = item;
        this.rimaService.selectActiveUser(item);
      }
    }

    hideShowComponent (){
      this.componentShown = !this.componentShown;
    }

    addParticipantQuickDialogClosed(confirm){
      if(confirm){
        console.log("[newParticipant]",this.newParticipant);
      }
    }

    prepareForParticipants(map){
      this.newParticipant = new knalledge.WhoAmI();
    }

    // toggleShowCreators(){
    //   //TODO: started to work on this -
    //   //GlobalEmitterServicesArray.get(viewConfigChangedEventName).broadcast('rimaUsersList');
    // }
}
