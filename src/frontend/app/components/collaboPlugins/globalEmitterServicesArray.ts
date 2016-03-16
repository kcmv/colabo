import {GlobalEmitterService} from './globalEmitterService';

interface NameToService {
    [name: string]: GlobalEmitterService;
}

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
