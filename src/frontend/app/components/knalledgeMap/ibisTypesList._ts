import {Component} from 'angular2/core';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
// import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {MdList, MdListItem, MdContent, MdButton} from 'ng2-material/all';

@Component({
    selector: 'ibis-types-list',
    directives: [
        // MATERIAL_DIRECTIVES,
        MdList, MdListItem, MdContent, MdButton,
        // upgradeAdapter.upgradeNg1Component('rimaUsersList')
        // upgradeAdapter.upgradeNg1Component('ibisTypesList')
   ],
    templateUrl: 'components/knalledgeMap/partials/new-ibisTypes-list.tpl.html',
    styles: [`
    `]
})
export class IbisTypesList {
    constructor() {
        console.log('[IbisTypesList]');
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
    selected = this.users[this.selecRandomtUser()];

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

    private selecRandomtUser() {
        let userId = Math.round((Math.random()*Object.keys(this.users).length));
        return userId;
    };
}
