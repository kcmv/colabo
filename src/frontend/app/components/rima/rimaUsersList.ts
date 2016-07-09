import {Component, OnInit, Inject} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES} from "@angular/common";

import {NgIf, FORM_DIRECTIVES} from '@angular/common';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';

import { Pipe, PipeTransform } from '@angular/core';

// import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
// import {MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material';
// import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

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
        MD_INPUT_DIRECTIVES, MdCheckbox
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


    public alertMsg:string;
    public items:Array<any> = [];
    public selectedItem:any = null;
    public assignedE_mail:boolean = true;
    public newParticipant;
    public automaticEmailDomain:string = "knalledge.org";
    private policyConfig:any;
    private viewConfig:any;
    private componentShown:boolean = true;
    private knalledgeNodeCreatorChanged: string = "knalledgeNodeCreatorChanged";

    // knRealTimeBroadcastUpdateMaps:string = "update-maps";
    // knRealTimeBroadcastReloadMaps:string = "reload-maps";

    private knAllEdgeRealTimeService;
    private rimaService;
    private knalledgeMapVOsService;

    private knalledgeMapUpdateEventName:string = "knalledgeMapUpdateEvent";

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,
        @Inject('KnAllEdgeRealTimeService') _KnAllEdgeRealTimeService_,
        @Inject('RimaService') _RimaService_,
        @Inject('KnalledgeMapVOsService') _KnalledgeMapVOsService_
    ) {
        console.log('[RimaUsersList]');
        this.policyConfig = knalledgeMapPolicyService.get().config;
        this.viewConfig = knalledgeMapViewService.get().config;

        this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
        this.rimaService = _RimaService_;
        this.knalledgeMapVOsService = _KnalledgeMapVOsService_;
        this.globalEmitterServicesArray.register(this.knalledgeMapUpdateEventName);
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
        this.rimaService.setActiveUser(item);

        if(this.viewConfig.states.editingNode){
          this.globalEmitterServicesArray.get(this.knalledgeNodeCreatorChanged)
          .broadcast('IbisTypesList',{node:this.viewConfig.states.editingNode,creator:item._id});
          //, this.selectedItem
        }
      }
    }

    hideShowComponent (){
      this.componentShown = !this.componentShown;
    }

    addParticipantQuickDialogClosed(confirm){
      var that = this;
      var userCreated = function(user:any){
        console.log("[userCreated]: ",user);
        that.knalledgeMapVOsService.addParticipantToMap(user._id,function(){
          //window.alert(user.displayName + " added to the map");
          that.selectedItem = user;
        });
      };
      if(confirm){
        if(this.assignedE_mail){
          this.newParticipant.e_mail = this.newParticipant.displayName + '@' + this.automaticEmailDomain;
        }
        console.log("[newParticipant]",this.newParticipant);
        this.rimaService.createWhoAmI(this.newParticipant, false, true, userCreated);
      }
    }

    prepareForParticipants(map){
      this.newParticipant = new knalledge.WhoAmI();
    }

    changedShowCreators(){
      //TODO: started to work on this -
      //GlobalEmitterServicesArray.get(viewConfigChangedEventName).broadcast('rimaUsersList');
      this.globalEmitterServicesArray.get(this.knalledgeMapUpdateEventName).broadcast('RimUsersList');
    }

    displayNameChanged(event){
      console.log("[displayNameChanged]event:",event);
      if(this.assignedE_mail){
        this.newParticipant.e_mail = this.newParticipant.displayName + '@' + this.automaticEmailDomain;
      }
    }
}
