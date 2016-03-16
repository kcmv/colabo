import {EventEmitter} from 'angular2/core';

interface StringToFunction {
    [name: string]: Function;
}

interface StringToString {
    [name: string]: string;
}

type StringAnyTuple = [string, any];

export class GlobalEmitterService {
    /**
     * queue of messages
     * @type {StringToString}
    */
    queue:StringAnyTuple[] = [];
    subscribers:StringToFunction = {};

    serviceName:string;
    private queueMessages:boolean;

    private emitter: EventEmitter<any> = new EventEmitter();

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
        this.emitter.emit(msg);
        if(this.queueMessages) this.queue.push([subscriberName, msg]);
    }
    subscribe(subscriberName: string, subscriberFunc: Function) {
        this.emitter.subscribe(subscriberFunc);
        this.subscribers[subscriberName] = subscriberFunc;
    }
}
