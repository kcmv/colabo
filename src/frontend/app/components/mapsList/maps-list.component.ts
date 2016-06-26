import {Component, Inject} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
// import {LoginStatusComponent} from '../login/login-status-component';
// import {Media, MdContent, MdButton} from 'ng2-material';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';

// import {RequestService} from '../request/request.service';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

declare var knalledge;

//TODO: import {KMap} from '../../js/knalledge/kMap';
//TODO: import {KNode} from '../../js/knalledge/kNode';

// TODO: probable remove later, this is just to trigger starting the service
// import {BroadcastManagerService} from '../collaboBroadcasting/broadcastManagerService';

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
    templateUrl: 'maps-list.tpl.html',
    styleUrls: ['maps-list.component.css'],
    providers: [
        MATERIAL_PROVIDERS,
        OVERLAY_PROVIDERS
        // provideRouter
        // RequestService
        // ROUTER_PROVIDERS
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        MD_SIDENAV_DIRECTIVES,
        ROUTER_DIRECTIVES,
        MdToolbar,
        // MdContent, MdButton,
        //   LoginStatusComponent,
    ],
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    styles: [`
        .md-sidenav-push-in .md-sidenav-push-in-target {
          transform: translate(0px);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .md-sidenav-push-in.md-sidenav-left-open .md-sidenav-push-in-target {
          transform: translate(304px);
        }
        .md-sidenav-push-in.md-sidenav-right-open .md-sidenav-push-in-target {
          transform: translate(-304px);
        }
    `]
})

export class MapsList {
    public mapToCreate = new knalledge.KMap();
    public modeCreating = false;
    public modeEditing = false;
    public items = null;
    public selectedItem = null;

    policyConfig: any;
    viewConfig: any;
    private rimaService;
    private knalledgeMapService;
    private knalledgeMapVOsService;

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
        this.init();
    };

    sortByName(a, b) {
     if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
     return 0;
   }

    init(){
      var that = this;
      this.knalledgeMapService.queryByParticipant(this.rimaService.getActiveUserId()).$promise.then(function(maps){
        that.items = maps;
        console.log('maps:'+JSON.stringify(maps));
        that.items = that.items.sort(that.sortByName);
      });
      this.policyConfig.moderating.enabled = true;
    }

    formatDateTime(date){
      return date.toLocaleTimeString(['en-GB'],
        {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false});
    //   options = {
    // year: 'numeric', month: 'numeric', day: 'numeric',
    // hour: 'numeric', minute: 'numeric', second: 'numeric',
    // hour12: false}
    //   date = new Intl.DateTimeFormat('en-GB').format(date);

    };

    itemsLength(){
      return false ? this.items.length : '<i class="fa fa-refresh fa-spin"></i><span class="sr-only">Loading...</span>';
    }

    showCreateNewMap(){
			console.log("showCreateNewMap");
			this.mapToCreate = new knalledge.KMap();
			this.mapToCreate.participants = this.rimaService.getActiveUserId();
			//this.mapToCreate.participants = this.rimaService.getActiveUser().displayName;
			this.modeCreating = true;
		};

		cancelled(){
			console.log("Canceled");
			this.modeCreating = false;
			this.modeEditing = false;
		};

		delete(map){
			//console.log("mapDelete:", map));
			if(window.confirm('Are you sure you want to delete map "'+map.name+'"?')){
        var that = this;
				var mapDeleted = function(result){
					console.log('mapDeleted:result:'+result);
					for(let i=0;i<that.items.length;i++){
			      if(that.items[i]._id === map._id){
			        that.items.splice(i, 1);
			      }
			    }
				};
				this.knalledgeMapVOsService.mapDelete(map._id, mapDeleted);
			}
		};

		duplicate(map){
			//console.log("mapDelete:", map));
			if(window.confirm('Are you sure you want to duplicate map "'+map.name+'"?')){
        var that = this;
				var mapDuplicated = function(map){
					console.log('mapDuplicated:map:'+map);
					if(map !== null){
						that.items.push(map);
						that.selectedItem = map;
					}
				};
				this.knalledgeMapVOsService.mapDuplicate(map, 'duplicatedMap', mapDuplicated);
			}
		}

		getParticipantsNames(ids){
				var names = '';
				for(var i=0; i<ids.length;i++){
					var user = this.rimaService.getUserById(ids[i]);
					names+=user === null ? 'unknown' : user.displayName + ', ';
				}
				return names;
		}

    createNew(){
      var that = this;
      var rootNode = new knalledge.KNode();
			rootNode.name = this.mapToCreate.name;
			rootNode.mapId = null;
			rootNode.iAmId = this.rimaService.getActiveUserId();
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
				that.knalledgeMapVOsService.updateNode(rootNode,knalledge.KNode.UPDATE_TYPE_ALL);
			};

			var rootNodeCreated = function(rootNode){
				that.mapToCreate.rootNodeId = rootNode._id;
				that.mapToCreate.iAmId = that.rimaService.getActiveUserId();

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

		updateMap(){
			this.modeEditing = false;
			window.alert('Editing is disabled');
			return;
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
				this.mapToCreate.iAmId = RimaService.getActiveUserId();

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

    showParticipants(item){
      console.log('showParticipants');
      //TEST: this.policyConfig.moderating.enabled = !this.policyConfig.moderating.enabled;
    }

		openMap() {
		    console.log("openMap");
			if(this.selectedItem !== null && this.selectedItem !== undefined){
				console.log("openning Model:" + this.selectedItem.name + ": " + this.selectedItem._id);
				console.log("/map/id/" + this.selectedItem._id);
				//$location.path("/map/id/" + this.selectedItem._id);
				//TODO: using ng2 Route mechanism:
				//this.router.url = "/map/id/" + this.selectedItem._id; //navigate(['HeroDetail', { id: this.selectedHero.id }]);
				window.location.href = "/#map/id/" + this.selectedItem._id;
				//openMap(this.selectedItem);
				// $element.remove();
			}else{
				window.alert('Please, select a Map');
			}
		};

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
		// 		//this.mapToCreate.participants = RimaService.getActiveUserId();
		// 		//openMap(this.selectedItem);
		// 		// $element.remove();
		// 	}
		// 	else{
		// 		window.alert('Please, select a Map');
		// 	}
		// }
}
