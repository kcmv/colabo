import {Component, OnInit, Inject} from '@angular/core';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';

import { Pipe, PipeTransform } from '@angular/core';

// import {MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material';
// import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

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

var componentDirectives = [
  SortUsersByDisplayNamePipe
];

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {Ng2MaterialModule} from 'ng2-material';

var moduleImports = [];
moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(HttpModule);
moduleImports.push(MaterialModule);
moduleImports.push(Ng2MaterialModule);
// moduleImports.push(ToolsModule);

// @NgModule for tools
@NgModule({
  imports: moduleImports,
  exports: componentDirectives,
  declarations: componentDirectives
})
export class RimaUsersListModule {}

@Component({
    selector: 'rima-users-list',
    providers: [
        // MATERIAL_PROVIDERS
    ],
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
    public newParticipant = new knalledge.WhoAmI();
    public automaticEmailDomain:string = "colabo.space";

    //This is a temporary workaround while we await a proper form reset feature https://angular.io/docs/ts/latest/guide/forms.html:
    public active_addParticipantToMapForm: boolean = true;

    public policyConfig:any;
    private viewConfig:any;
    private componentShown:boolean = true;
    private knalledgeNodeCreatorChanged: string = "knalledgeNodeCreatorChanged";

    // knRealTimeBroadcastUpdateMaps:string = "update-maps";
    // knRealTimeBroadcastReloadMaps:string = "reload-maps";

    private knAllEdgeRealTimeService;
    private rimaService;
    private knalledgeMapVOsService;
    private SHOW_USER_DIALOG: string = "SHOW_USER_DIALOG";

    private knalledgeMapUpdateEventName:string = "knalledgeMapUpdateEvent";

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray:GlobalEmittersArrayService,
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
        this.globalEmitterServicesArray.register(this.SHOW_USER_DIALOG);
        this.globalEmitterServicesArray.register(this.knalledgeMapUpdateEventName);
        this.globalEmitterServicesArray.register(this.knalledgeNodeCreatorChanged);
        // $scope.items.sort(compare);

        this.selectedItem = this.rimaService.getActiveUser();
        // if(this.rimaService.whoAmIs.$resolved){
        //   this.initUsers(this.rimaService.whoAmIs);
        // }else{
        //   this.rimaService.whoAmIs.$promise.then(function(whoAmIs){this.initUsers(whoAmIs);});
        // }
        console.log('[RimaUsersList] rimaService.config.showUsers:'+this.rimaService.config.showUsers);

        // $scope.howAmIs = RimaService.getAllHows();
    }

    // broadcastReloadMaps: Function = function(){
    //     this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastReloadMaps);
    // };

    ngOnInit() {
      this.items = this.rimaService.whoAmIs;

      //workaround for sorting until we can use above-defined SortUsersByDisplayNamePipe...
      //which causes problem with non-watching input (items):
      var that = this;
      let id:number;
      let i:number=50;
      var sortItems: Function = function(){
        if(i--<=0){clearInterval(id);} //give up
        if(that.items && that.items.length !== 0){
          clearInterval(id);
          let sort:SortUsersByDisplayNamePipe = new SortUsersByDisplayNamePipe();
          that.items = sort.transform(that.items);
        }
      };
      if(!this.items || this.items.length === 0){
        id = setInterval(sortItems, 100);
      }else{
        sortItems();
      }
    }

    get showUsers(){
      return this.rimaService.config.showUsers;
    }

    showUserDialog(user:knalledge.WhoAmI):void{
      console.log("showUserDialog", user);
      this.globalEmitterServicesArray.get(this.SHOW_USER_DIALOG).broadcast('RimaUsersList', user);
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
          .broadcast('RimaUsersList',{node:this.viewConfig.states.editingNode,creator:item._id});
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
        // this.setEmail(); not needed when we have keyUp event handler
        console.log("[newParticipant]",this.newParticipant);
        this.rimaService.createWhoAmI(this.newParticipant, false, true, userCreated);
      }
    }

    prepareForParticipants(map){
      this.assignedE_mail = true;
      this.newParticipant = new knalledge.WhoAmI();
      this.active_addParticipantToMapForm = false;
      setTimeout(() => this.active_addParticipantToMapForm = true, 0);
    }

    changedShowCreators(){
      //TODO: started to work on this -
      //GlobalEmittersArrayService.get(viewConfigChangedEventName).broadcast('rimaUsersList');
      this.globalEmitterServicesArray.get(this.knalledgeMapUpdateEventName).broadcast('RimUsersList');
    }

    displayNameChanged(event){
      //console.log("[displayNameChanged]event:",event);
      this.setEmail();
    }

    assignedE_mailChanged(event){
      if(event){
        this.setEmail();
      }else{
        this.newParticipant.e_mail = "";
      }
      //event.target.value
    }

    private setEmail():void{
      if(this.assignedE_mail){
        this.newParticipant.e_mail = this.newParticipant.displayName + '@' + this.automaticEmailDomain;
      }
    }
}
