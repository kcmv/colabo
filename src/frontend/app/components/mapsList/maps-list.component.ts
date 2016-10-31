import {NgForm} from '@angular/forms';

import {Component, Inject, OnInit, ViewChild} from '@angular/core';

import {upgradeAdapter} from '../../js/upgrade_adapter';
import {Media} from "ng2-material";

import { Router} from '@angular/router';

import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

import {MapFormComponent} from './map-form.component';
import {ImportMapFormComponent} from './import-map-form.component';

// import {ViewChild, ViewChildren} from '@angular/core';
// import {Media, MdContent, MdButton} from 'ng2-material';

// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

declare var knalledge;

declare var Config: any; // src/frontend/app/js/config/config.plugins.js

//TODO: import {KMap} from '../../js/knalledge/kMap';
//TODO: import {KNode} from '../../js/knalledge/kNode';

/**
 * Directive that handles the main KnAllEdge or rather CollaboFramework user interface
 *
 * Selector: `knalledge-map-main`
 * @class KnalledgeMapMain
 * @memberof knalledge.knalledgeMap
 * @constructor
*/

// @RouteConfig([
//     {
//         path: "/",
//         name: "root",
//         redirectTo: ["/Home"]
//     },
//
//     {
//         path: "/maps",
//         name: "Maps",
//         // component: HomeComponent,
//         redirectTo: ["/maps"]
//      useAsDefault: true
//  },
//     {path: '/disaster', name: 'Asteroid', redirectTo: ['CrisisCenter', 'CrisisDetail', {id:3}]}
// ])
//

@Component({
    selector: 'maps-list',
    moduleId: module.id,
    templateUrl: 'partials/maps-list.tpl.html',
    providers: [
    ],
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/knalledgeMap/partials/main.tpl.html',
})

export class MapsList implements OnInit {
    // @ViewChild(cloneDialog);
    // _cloneDialog: cloneDialog;

    public mapToCreate = new knalledge.KMap();
    public modeCreating = false;
    public modeEditing = false;
    public items = null;
    public selectedItem = null;
    public mapForAction = null;
    public alertMsg = "";
    public nameOfDuplicatedMap = "";
    public mapParticipants = null;
    public title: string = "";
    public mapRoutes: any[];
    //public cloneDialog = @ViewChild('cloneDialog');

    policyConfig: any;
    viewConfig: any;
    private rimaService;
    private knalledgeMapService;
    private knalledgeMapVOsService;

    @ViewChild("mapFormComponent") private mapFormComponent: MapFormComponent;
    @ViewChild("importMapFormComponent") private importMapFormComponent: ImportMapFormComponent;


    constructor(
        //private router: Router,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService: KnalledgeMapViewService,
        @Inject('KnalledgeMapPolicyService') private knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('RimaService') _RimaService_,
        @Inject('KnalledgeMapService') _KnalledgeMapService_,
        @Inject('KnalledgeMapVOsService') _KnalledgeMapVOsService_,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
        // @Inject('BroadcastManagerService') broadcastManagerService:BroadcastManagerService
    ) {
        console.log('[MapsList]');
        this.viewConfig = knalledgeMapViewService.get().config;
        this.policyConfig = knalledgeMapPolicyService.get().config;
        this.rimaService = _RimaService_;
        this.knalledgeMapService = _KnalledgeMapService_;
        this.knalledgeMapVOsService = _KnalledgeMapVOsService_;
        console.log('this.knalledgeMapVOsService: ', this.knalledgeMapVOsService);
        // this.broadcastManagerService = broadcastManagerService;
        // globalEmitterServicesArray.register('KnalledgeMapMain');
        // globalEmitterServicesArray.get().subscribe('KnalledgeMapMain', (data) => alert("[KnalledgeMapMain]:"+data));
        // globalEmitterServicesArray.broadcast('KnalledgeMapMain', "Hello from KnalledgeMaKnalledgeMapMainpTools!");

        // var nodeMediaClickedEventName = "nodeMediaClickedEvent";
        // this.globalEmitterServicesArray.register(nodeMediaClickedEventName);
        //
        // this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('knalledgeMap.Main', function(vkNode) {
        //     console.log("media clicked: ", vkNode.kNode.name);
        // });
        this.mapToCreate = new knalledge.KMap();
        this.mapRoutes = Config.Plugins.puzzles.mapsList.config.openMap.routes;
    };

    ngOnInit() {
        this.init();
        console.log("Config.Plugins.puzzles.mapsList.config.title:", Config.Plugins.puzzles.mapsList.config.title);
        this.title =
            Config.Plugins.puzzles.mapsList.config &&
                Config.Plugins.puzzles.mapsList.config.title ?
                Config.Plugins.puzzles.mapsList.config.title : "";
    }

    sortByName(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    }

    queryByParticipantCallback(maps, error){
      console.log("queryByParticipantCallback", maps, error);
    }

    init() {
        //@ViewChild('cloneDialog') input;
        let whoAmI: knalledge.WhoAmI = this.rimaService.getWhoAmI();
        let that = this;
        if(whoAmI === null){
          this.getMapsForParticipant(null);
        }else{
          if(!whoAmI.$resolved){
            console.warn("[init:NOT whoAmI.$resolved] getWhoAmI:Stringified", JSON.stringify(whoAmI));
            console.warn("[init:NOT whoAmI.$resolved] getWhoAmI", whoAmI);
            console.warn("[init:NOT whoAmI.$resolved] whoAmI.state", whoAmI.state);
            whoAmI.$promise.then(function(){
              that.getMapsForParticipant(whoAmI);
            });
          }else{
            console.warn("[init:IS whoAmI.$resolved] getWhoAmI:Stringified", JSON.stringify(whoAmI));
            console.log("[init:IS whoAmI.$resolved] getWhoAmI", whoAmI);
            console.log("[init:IS whoAmI.$resolved] whoAmI.state", whoAmI.state);
            this.getMapsForParticipant(whoAmI);
          }
        }
        //this.policyConfig.moderating.enabled = true;
        //this.cloneDialog = @ViewChild('cloneDialog');
    }

    getMapsForParticipant(whoAmI: knalledge.WhoAmI){
      let that = this;
      let participantId: string = null;
      if(whoAmI !== null){
        participantId = whoAmI._id;
        if(!participantId || typeof participantId !== 'string'){
          console.warn("[MapLIst::getMapsForParticipant] participantId incorrect:", participantId);
          console.warn("[MapLIst::getMapsForParticipant] getWhoAmI:Stringified", JSON.stringify(whoAmI));
          console.warn("[MapLIst::getMapsForParticipant] getWhoAmI", whoAmI);
        }
      }
      this.knalledgeMapService.queryByParticipant(participantId, null)
      .$promise.then(function(maps) {
        //console.log("in init -> queryByParticipant promise", maps);
        that.items = maps;
        //console.log('maps:' + JSON.stringify(maps));
        that.items.sort(that.sortByName);
      });
    }

    mapFormShowForCreation() {
        if (this.rimaService.getWhoAmI()){
            console.log("[mapFormShowForCreation]");
            this.mapToCreate = new knalledge.KMap();
            this.mapToCreate.participants = this.rimaService.getWhoAmI()._id;
            //this.mapToCreate.participants = this.rimaService.getWhoAmI().displayName;
            this.modeCreating = true;
            this.mapFormShow(this.mapToCreate);
        }else{
          window.alert("You must be logged in to create a map");
        }
    }

    importMapFormShow() {
        console.log("[importMapFormShow]");
        if (this.rimaService.getWhoAmI()){
            // this.mapToCreate = new knalledge.KMap();
            // this.mapToCreate.participants = this.rimaService.getWhoAmI()._id;
            // //this.mapToCreate.participants = this.rimaService.getWhoAmI().displayName;
            this.modeCreating = true;
            this.importMapFormComponent.show(this.importMapFormClosed.bind(this));
        }else{
          window.alert("You must be logged in to import a map");
        }
    }

    formatDateTime(date) {
        return date.toLocaleTimeString(['en-GB'],
            { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
        //   options = {
        // year: 'numeric', month: 'numeric', day: 'numeric',
        // hour: 'numeric', minute: 'numeric', second: 'numeric',
        // hour12: false}
        //   date = new Intl.DateTimeFormat('en-GB').format(date);

    };

    itemsLength() {
        return false ? this.items.length : '<i class="fa fa-refresh fa-spin"></i><span class="sr-only">Loading...</span>';
    }

    // canceled(){
    // 	console.log("Canceled");
    // 	this.modeCreating = false;
    // 	this.modeEditing = false;
    // };

    // deleteShow(map){
    //   this.mapForAction = map;
    //   deleteConfirm.show();
    // }

    delete(confirm) {
        if (confirm && this.mapForAction) {
            var that = this;
            var mapDeleted = function(result) {
                console.log('mapDeleted:result:' + result);
                for (let i = 0; i < that.items.length; i++) {
                    if (that.items[i]._id === that.mapForAction._id) {
                        that.items.splice(i, 1);
                    }
                }
                that.selectedItem = null;
            };
            this.knalledgeMapVOsService.mapDelete(this.mapForAction._id, mapDeleted);
        }
    }

    amImapCreator(map) {
        return this.rimaService.getWhoAmI() ? (map.iAmId === this.rimaService.getWhoAmI()._id) : false;
    }

    prepareForCloning(map) {
        this.mapForAction = map;
        this.nameOfDuplicatedMap = "";
        //console.log("this.cloneDialog:"+this.cloneDialog);
    }

    // showCallback(event){
    //   console.log("[showCallback]",event);
    //   window.alert("[showCallback]: " + event);
    // }

    onShowDelete(event) {
        console.warn('[onShowDelete]', event);
    }

    onCancelDelete(event) {
        console.warn('[onCancelDelete]', event);
    }

    onSubmitClone() {
        //console.log("mapDelete:", map));
        // if (confirm && this.mapForAction) {
        var that = this;
        var mapDuplicated = function(map) {
            console.log('mapDuplicated:map:' + map);
            if (map !== null) {
                that.items.push(map);
                that.selectedItem = map;
            }
        };
        this.knalledgeMapVOsService.mapDuplicate(this.mapForAction, this.nameOfDuplicatedMap, mapDuplicated);
        // }
    }

    export(map: knalledge.KMap) {
        this.knalledgeMapVOsService.mapExport(map._id, this.mapExported);
    }

    getParticipantsNames(ids) {
        var names = '';
        for (var i = 0; i < ids.length; i++) {
            var user = this.rimaService.getUserById(ids[i]);
            names += user === null ? 'unknown' : user.displayName + ', ';
        }
        return names;
    }

    createNew() {
        var that = this;
        var rootNode = new knalledge.KNode();
        rootNode.name = this.mapToCreate.name;
        rootNode.mapId = null;
        rootNode.iAmId = this.rimaService.getWhoAmI()._id;
        rootNode.type = this.mapToCreate.rootNodeType ?
            this.mapToCreate.rootNodeType : "model_component";
        rootNode.visual = {
            isOpen: true,
            xM: 0,
            yM: 0
        };

        var mapCreated = function(mapFromServer) {
            console.log("mapCreated:");//+ JSON.stringify(mapFromServer));
            that.items.push(mapFromServer);
            that.selectedItem = mapFromServer;
            rootNode.mapId = mapFromServer._id;
            that.knalledgeMapVOsService.updateNode(rootNode, knalledge.KNode.UPDATE_TYPE_ALL);
        };

        var rootNodeCreated = function(rootNode) {
            that.mapToCreate.rootNodeId = rootNode._id;
            that.mapToCreate.iAmId = that.rimaService.getWhoAmI()._id;

            //TODO: so far this is string of comma-separated iAmIds:
            that.mapToCreate.participants = that.mapToCreate.participants.replace(/\s/g, '');
            that.mapToCreate.participants = that.mapToCreate.participants.split(',');

            var map = that.knalledgeMapService.create(that.mapToCreate);
            map.$promise.then(mapCreated);
        };

        console.log("createNew");
        this.modeCreating = false;

        rootNode = this.knalledgeMapVOsService.createNode(rootNode);
        rootNode.$promise.then(rootNodeCreated);
    }

    updateMap() {
        /* Editing is disabled until finished:
            var mapUpdated = function(mapFromServer) {
                console.log("mapUpdated:");//+ JSON.stringify(mapFromServer));
                this.items.push(mapFromServer);
                this.selectedItem = mapFromServer;
                rootNode.mapId = mapFromServer._id;
                this.knalledgeMapVOsService.updateNode(rootNode);
            };

            var rootNodeUpdated = function(rootNode){
                this.mapToCreate.rootNodeId = rootNode._id;
                this.mapToCreate.iAmId = RimaService.getWhoAmI()._id;

                //TODO: so far this is string of comma-separated iAmIds:
                this.mapToCreate.participants = this.mapToCreate.participants.replace(/\s/g, '');
                this.mapToCreate.participants = this.mapToCreate.participants.split(',');

                var map = KnalledgeMapService.create(this.mapToCreate);
                map.$promise.then(mapUpdated);
            };


            var rootNode = this.knalledgeMapVOsService.getNodeById(this.mapToCreate.rootNodeId);

            rootNode.name = this.mapToCreate.name;

            rootNode.type = this.mapToCreate.rootNodeType ?
                this.mapToCreate.rootNodeType : "model_component";


            rootNode = this.knalledgeMapVOsService.updateNode(rootNode);
            rootNode.$promise.then(rootNodeUpdated);
        */
    }

    selectItem(item) {
        this.selectedItem = item;
        console.log("this.selectedItem = " + this.selectedItem.name + ": " + this.selectedItem._id);
    }

    showParticipants(item) {
        console.log('showParticipants');
        //TEST: this.policyConfig.moderating.enabled = !this.policyConfig.moderating.enabled;
    }

    openMap(item: any, mapRoute?: any) {
        console.log("openMap");
        if (!item) { // && this.selectedItem !== null && this.selectedItem !== undefined
            item = this.selectedItem;
        }
        if (item) {
            console.log("openning Model:" + item.name + ": " + item._id);
            console.log("/map/id/" + item._id);
            //$location.path("/map/id/" + item._id);
            //TODO: using ng2 Route mechanism:
            //this.router.url = "/map/id/" + item._id; //navigate(['HeroDetail', { id: this.selectedHero.id }]);

            //TODO-remove: this.policyConfig.moderating.enabled = false;
            var location = "#" + (mapRoute ? mapRoute.route : this.mapRoutes[0].route) + "/id/" + item._id;
            console.log("location: ", location);
            window.location.href = location;
            //openMap(item);
            // $element.remove();
        } else {
            window.alert('Please, select a Map');
        }
    }

    getUser(userID) {
        var user = this.rimaService.getUserById(userID);
        return user ? user.displayName : 'unknown user';
    }

    /* *** TOOLBAR **** */

    getLoggedInUserName(): any {
        var whoAmI = this.rimaService.getWhoAmI();
        var name = this.rimaService.getNameFromUser(whoAmI);
        return name; // TEST: 'jednodugackoime';
    }

    isRegularUserName() {
        return this.getLoggedInUserName() !== null && (typeof this.getLoggedInUserName() === 'string');
    }

    shorten(str, ln) {
        // console.log("[shorten]str:", str);
        // console.log("[shorten]str.substr:", str.substr);
        return str ? (str.length <= ln ? str : str.substr(0, ln - 3) + '...') : '';
    }

    prepareForParticipants(map) {
        if (this.mapParticipants === null || this.mapForAction !== map) {
            this.mapParticipants = null;
            this.mapForAction = map;
            var that = this;
            this.rimaService.loadUsersFromIDsList(map.participants).$promise.then(
                function(participants) {
                    that.mapParticipants = participants;
                }
            );
        } else {
            //these participants already loaded because this map's participants are the last one seen
        }
    }

    go(path: string) {
        // TODO: not implemented
        // alert("Not implemented");
        // this.router.navigate(['/hero', hero.id]);
        //I assumed your `/home` route name is `Home`
        // this._router.navigate([path]); //this will navigate to Home state.
        //below way is to navigate by URL
        //this.router.navigateByUrl('/home')
        // https://angular.io/docs/ts/latest/api/common/index/Location-class.html
        // this.location.go('#/' + path);
        window.location.href = '#/' + path;
    }

    private mapFormClosed(submitted: boolean) {
        if (submitted) {
            if (this.modeCreating) {
                this.createNew();
            } else
                if (this.modeEditing) {
                    this.updateMap();
                }
        }
        this.modeEditing = this.modeCreating = false;
    }

    private mapFormShow(map) {
        console.log("[mapFormShow]", map);
        this.mapFormComponent.show(map, this.mapFormClosed.bind(this));
    }

    private importMapFormClosed(submitted: boolean) {
        console.log("[importMapFormClosed]");
        this.modeEditing = this.modeCreating = false;
    }

    private mapExported(map: any) {
        //http://blog.neilni.com/2016/04/23/download-file-in-angular-js/
        console.log("[mapExported] ", map);
        var data: String = JSON.stringify(map, null, 1);
        var url = URL.createObjectURL(new Blob([data]));
        var a = document.createElement('a');
        a.href = url;
        let d = new Date();
        let dStr = d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate() + '_' +
        d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();
        a['download'] = map.map.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ' (' + dStr + ').json';
        a.target = '_blank';
        a.click();
    }

    /* *** TOOLBAR - END **** */

    // cloneDialogOpened(){
    //   console.log("cloneDialogOpened");
    // }

    // editMap() {
    // 	this.modeEditing = true;
    // 	var mapReceived = function(mapFromServer) {
    // 		console.log("mapReceived:");//+ JSON.stringify(mapFromServer));
    // 		this.items.push(mapFromServer);
    // 		this.selectedItem = mapFromServer;
    // 		rootNode.mapId = mapFromServer._id;
    // 		this.knalledgeMapVOsService.updateNode(rootNode);
    // 	};
    //
    //     //console.log("openMap");
    // 	if(this.selectedItem !== null && this.selectedItem !== undefined){
    // 		console.log("editMap Model:" + this.selectedItem.name + ": " + this.selectedItem._id);
    // 		console.log("/map/id/" + this.selectedItem._id);
    // 		this.mapToCreate = KnalledgeMapService.getById(this.selectedItem._id);
    // 		this.mapToCreate.$promise.then(mapReceived);
    // 		//this.mapToCreate.participants = RimaService.getWhoAmI()._id;
    // 		//openMap(this.selectedItem);
    // 		// $element.remove();
    // 	}
    // 	else{
    // 		window.alert('Please, select a Map');
    // 	}
    // }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@angular/material';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2MaterialModule} from 'ng2-material';

import {ImportMapFormModule, importMapFormComponentExportDirectives} from './import-map-form.component';

var moduleImports = [];
moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(HttpModule);
// moduleImports.push(RouterModule.forRoot(DEMO_APP_ROUTES));
moduleImports.push(MaterialModule.forRoot());
moduleImports.push(Ng2MaterialModule.forRoot());
moduleImports.push(ImportMapFormModule);

var componentDirectives = [
  MapFormComponent,
  MapsList
];

let componentExportDirectives = [];
for (let i=0; i<componentDirectives.length; i++){
  componentExportDirectives.push(componentDirectives[i]);
}

for (let i=0; i<importMapFormComponentExportDirectives.length; i++){
  componentExportDirectives.push(importMapFormComponentExportDirectives[i]);
}

// @NgModule for tools
@NgModule({
  imports: moduleImports,
  exports: componentExportDirectives,
  declarations: componentDirectives
})
export class MapsListModule {}
