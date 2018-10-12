import {EventEmitter, Injectable} from '@angular/core';

interface StringToFunction {
    [name: string]: Function;
}

interface StringToString {
    [name: string]: string;
}

type StringAnyTuple = [string, any];

/**
 * Global emitter service
 * @class GlobalEmitterService
 * @memberof collaboframework.plugins
*/

// provide ng build error: "Can't resolve all parameters for GlobalEmitterService"
// @Injectable()
export class GlobalEmitterService {
    /**
     * queue of messages
     * @type {StringToString}
    */
    queue:StringAnyTuple[] = [];
    subscribers:StringToFunction = {};

    serviceName:string;
    private queueMessages:boolean;

    private emitter: EventEmitter<any> = EventEmitter ? new EventEmitter() : null;

    // private emitters: any = {
    //     config: {
    //         broadcasting: {
    //             enabled: false,
    //         },
    //         moderating: {
    //             enabled: false
    //         }
    //     }
    // };

    constructor(serviceName: string = "globalEmitterService", queueMessages: boolean = false) {
        this.serviceName = serviceName;
        this.queueMessages = queueMessages;
    }

    broadcast(subscriberName: string, msg?: any) {
        if(this.emitter) {
            this.emitter.emit(msg);
        }else {
            for(var sI in this.subscribers) {
                (this.subscribers[sI])(msg);
            }
        }
        if(this.queueMessages) this.queue.push([subscriberName, msg]);
    }
    subscribe(subscriberName: string, subscriberFunc: Function) {
        var subscription;
        if(this.emitter){
            subscription = this.emitter.subscribe(subscriberFunc);
        }
        this.subscribers[subscriberName] = subscriberFunc;
        return subscription;
    }
}
