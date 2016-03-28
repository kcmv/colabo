import {Component} from 'angular2/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
// import {LoginStatusComponent} from '../login/login-status-component';
// import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {MdList, MdListItem, MdContent, MdButton} from 'ng2-material/all';
import {KnalledgeMapTools} from './tools';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

// TODO: probable remove later, this is just to trigger starting the service
import {BroadcastManagerService} from '../collaboBroadcasting/broadcastManagerService';

@Component({
    selector: 'knalledge-map-main',
    directives: [
        // MATERIAL_DIRECTIVES,
        MdList, MdListItem, MdContent, MdButton,
    //   LoginStatusComponent,
     upgradeAdapter.upgradeNg1Component('knalledgeMap'),
    //  upgradeAdapter.upgradeNg1Component('knalledgeMapTools'),
     upgradeAdapter.upgradeNg1Component('ontovSearch'),
     upgradeAdapter.upgradeNg1Component('rimaRelevantList'),
     upgradeAdapter.upgradeNg1Component('knalledgeMapList'),
    //  upgradeAdapter.upgradeNg1Component('ibisTypesList'),
     KnalledgeMapTools
   ],
    templateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    styles: [`
        .msg {
            font-size: 0.5em;
        }
        .container{
            margin: 5px;
            border: 1px solid gray;
        }
    `]
})
export class KnalledgeMapMain {
    private broadcastManagerService:BroadcastManagerService;

    constructor(
        @Inject('BroadcastManagerService') broadcastManagerService:BroadcastManagerService
        // globalEmitterServicesArray:GlobalEmitterServicesArray
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[KnalledgeMapMain]');
        this.broadcastManagerService = broadcastManagerService;
        // globalEmitterServicesArray.register('KnalledgeMapMain');
        // globalEmitterServicesArray.get().subscribe('KnalledgeMapMain', (data) => alert("[KnalledgeMapMain]:"+data));
        // globalEmitterServicesArray.broadcast('KnalledgeMapMain', "Hello from KnalledgeMaKnalledgeMapMainpTools!");
    };

    listName: String = "Корисници";
    userUrl: String = "www.CollaboScience.com";

    users:Object = [
        {
            selected: false,
            name: "Sasha Rudan"
        },
        {
            selected: false,
            name: "Eugenia Kelbert"
        },
        {
            selected: false,
            name: "Sinisha Rudan"
        }
    ];
    selected = this.users[0];

    selectUser:Function = function(user:Object){
        this.selected = user;
        return this.selected;
    };

    toggleList:Function = function(user:Object){
        return;
    };

    showContactOptions:Function = function(event){
        return;
    };

    public selecRandomtUser() {
        let userId = Math.round((Math.random()*Object.keys(this.users).length));
        return userId;
    };
}
