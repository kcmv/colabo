// TODO: FIX: directives lifetime: what about directives that registered and then are removed?
//  - stoping broadcasting
//  - ill reference
//  - garbage collection is disabled?!
/*

$scope.$on
$rootScope.$broadcast(eventName, changes);

var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
GlobalEmitterServicesArray.register(mapStylingChangedEventName);
// $rootScope.$broadcast(changeKnalledgeRimaEventName, $scope.node);
GlobalEmitterServicesArray.get(changeKnalledgeRimaEventName).broadcast('rimaWhats', $scope.node);
GlobalEmitterServicesArray.get(viewspecChangedEventName).subscribe('knalledgeMap', function(newViewspec) {
    console.log("[knalledgeMap.controller::$on] event: %s", viewspecChangedEventName);
    console.log("[knalledgeMap.controller::$on] newViewspec: %s", newViewspec);
});

 */
import {GlobalEmitterService} from './globalEmitterService';

interface NameToService {
    [name: string]: GlobalEmitterService;
}

/**
 * Global emitter services array
 * @class GlobalEmitterServicesArray
 * @memberof collaboframework.plugins
*/

export class GlobalEmitterServicesArray {
    services:NameToService = {};

    register(serviceName: string) {
        if(serviceName in this.services) return this.services[serviceName];

        this.services[serviceName] = new GlobalEmitterService(serviceName);
        return this.services[serviceName];
    }
    get(serviceName: string) {
        if(serviceName in this.services) {
            return this.services[serviceName];
        }else {
            return null;
        }
    }
}
