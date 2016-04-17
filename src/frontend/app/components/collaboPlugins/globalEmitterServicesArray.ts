// TODO: FIX: directives lifetime: what about directives that registered and then are removed?
//  - stoping broadcasting
//  - ill reference
//  - garbage collection is disabled?!
/*

$scope.$on
$rootScope.$broadcast(eventName, changes);

var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
GlobalEmitterServicesArray.register(eventName);

// $rootScope.$broadcast(eventName, $scope.node);
GlobalEmitterServicesArray.get(eventName).broadcast('rimaWhats', $scope.node);

// $scope.$on(eventName, function(e, eventModel) {
GlobalEmitterServicesArray.get(eventName).subscribe('knalledgeMap', function(newViewspec) {
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
