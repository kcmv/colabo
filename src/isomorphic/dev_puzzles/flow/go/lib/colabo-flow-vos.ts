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
    id?: any;
    time?: any;

    // action types
    bpmn_type: any;
    bpmn_subtype: any;
    bpmn_subsubtype?: any;

    flowId: any;
    name: any;

    userId?: any;
    sessionId?: any;
    flowInstanceId: any;

    implementationId?: any;
    implementerId?: any;
    success: any;
}

export interface ActionExecuteRequest{
    id?: string; // unique id of the audited action
    time?: string; // when did the action happen
    dataIn?: string;

    // action types
    bpmn_type: BpmnSymbolType; // action type (BpmnSymbolType.Event, ...)
    bpmn_subtype: BpmnSymbolSubType; // sub type (ActivityType.Task, EventType.Start, ...)
    bpmn_subsubtype?: BpmnSymbolSubSubType; // sub-sub type (EventSubType.Message, ...)

    flowId: string; // name of the flow the action belongs to
    name: string; // name of the action (inside the flow)

    userId?: string; // id of user initiating the action
    sessionId?: string; // id of the session under which the call is initiated
    flowInstanceId: string; // id of the flow instance that started

    implementationId?: string; // id of the implementation used for performing the action (i.e. if it is a person performing it, (s)he has been using a tool implemented and identified with implementationID) ('oven Smederevka')
    implementerId?: string; // id of the person or component performing the action ('baker', or 'oven')
    success: boolean;
}

export class ActionExecuteRequestClass implements ActionExecuteRequest, ActionExecuteRequestAny {
    id: string;
    time: string;

    // action types
    bpmn_type: BpmnSymbolType;
    bpmn_subtype: BpmnSymbolSubType;
    bpmn_subsubtype: BpmnSymbolSubSubType;

    flowId: string;
    name: string;

    userId: string;
    sessionId: string;
    flowInstanceId: string;

    implementationId: string;
    implementerId: string;
    success: boolean;
    
    // coming from IPluginAuditing
    createdAt: string;
    updatedAt: string;
    
    constructor(){
        
    }
    
    init(){
        
    }
}

export interface ActionExecuteReply {
    id: string; // unique id of the executed action
    dataOut: string; // serialized data output of the action
    params: string; // serialized parameters of the action
}