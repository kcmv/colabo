// TODO: FIX: directives lifetime: what about directives that registered and then are removed?
//  - stoping broadcasting
//  - ill reference
//  - garbage collection is disabled?!
/*

$scope.$on
$rootScope.$broadcast(eventName, changes);

var GlobalEmittersArrayService = $injector.get('GlobalEmittersArrayService');
GlobalEmittersArrayService.register(eventName);

// $rootScope.$broadcast(eventName, $scope.node);
GlobalEmittersArrayService.get(eventName).broadcast('rimaWhats', $scope.node);

// $scope.$on(eventName, function(e, eventModel) {
GlobalEmittersArrayService.get(eventName).subscribe('knalledgeMap', function(newViewspec) {
    console.log("[knalledgeMap.controller::$on] event: %s", viewspecChangedEventName);
    console.log("[knalledgeMap.controller::$on] newViewspec: %s", newViewspec);
});

 */
 import {Injectable} from '@angular/core';
import {GlobalEmitterService} from './globalEmitterService';

interface NameToService {
    [name: string]: GlobalEmitterService;
}

/**
 * Global emitter services array
 * @class GlobalEmittersArrayService
 * @memberof collaboframework.plugins
*/

@Injectable()
export class GlobalEmittersArrayService {
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
