export type RpcCallback = (error: any, rpcReplay:any) => void;
export type RpcMethodSingle = (call: any, callback: RpcCallback) => void;

export interface RpcMethods {
    [methodName: string]: RpcMethodSingle
}

export enum BpmnSymbolType{
    Event = 'event',
    Activity = 'activity',
    Gateway = 'gateway'
}

export enum EventType {
    Start = 'start',
    Intermediate = 'intermediate',
    End = 'end'
}

export enum EventSubType {
    Message = 'message',
    Timer = 'timer',
    Escalation = 'escalation',
    Conditional = 'conditional',
    Link = 'link',
    Error = 'error',
    Cancel = 'cancel',
    Compensation = 'compensation',
    Signal = 'signal',
    Multiple = 'multiple',
    ParallelMultiple = 'parallelMultiple',
    Terminate = 'terminate'
}

export enum ActivityType {
    Task = 'task',
    SubProcess = 'subProcess',
    Transaction = 'transaction',
    Call = 'call'
}

export enum GatewayType {
    Exclusive = 'task',
    EventBased = 'eventBased',
    Parallel = 'parallel',
    Inclusive = 'inclusive',
    ExclusiveEventBased = 'exclusiveEventBased',
    Complex = 'complex',
    ParallelEventBased = 'parallelEventBased'
}

export type BpmnSymbolSubType = ActivityType | GatewayType | EventType;
export type BpmnSymbolSubSubType = EventSubType;

export enum ActionExecuteRequestUnknownDefaults {
    FlowId = "unknown",
    ActionName = "unknown",
    FlowInstanceId = "unknown"
}

// we introduce this one so we can 
export interface ActionExecuteRequestAny {
    flowId?: any;
    name: any;
    flowInstanceId: any;

    dataIn?: any;
    params?: any;

    implementationId?:any;
    implementerId?: any;
}

export interface ActionExecuteRequestInterface{
    flowId?: string; // name of the flow the action belongs to
    name: string; // name of the action (inside the flow)
    flowInstanceId: string; // id of the flow instance that started
    
    dataIn?: string;
    params?: string;

    implementationId?:string; // id of the implementation used for performing the action (i.e. if it is a person performing it, (s)he has been using a tool implemented and identified with implementationID) ('oven Smederevka')
    implementerId?:string; // id of the person or component performing the action ('baker', or 'oven')
}

export class ActionExecuteRequestClass implements ActionExecuteRequestInterface, ActionExecuteRequestAny {
    flowId?: string; 
    name: string; 
    flowInstanceId: string; 

    dataIn?: string;
    params?: string;

    implementationId?: string;
    implementerId?: string; 
    
    constructor(){
        
    }
    
    init(){

    }
}

export interface ActionExecuteReply {
    id: string; // unique id of the executed action
    dataOut: string; // serialized data output of the action
    params: string; // serialized parameters of the action
    error: string;
}