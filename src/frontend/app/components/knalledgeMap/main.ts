import {Component} from 'angular2/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
// import {LoginStatusComponent} from '../login/login-status-component';

@Component({
    selector: 'knalledge-map-main',
    directives: [
    //   LoginStatusComponent,
     upgradeAdapter.upgradeNg1Component('knalledgeMap'),
     upgradeAdapter.upgradeNg1Component('knalledgeMapTools'),
     upgradeAdapter.upgradeNg1Component('ontovSearch'),
     upgradeAdapter.upgradeNg1Component('rimaRelevantList'),
     upgradeAdapter.upgradeNg1Component('knalledgeMapList')
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
}
