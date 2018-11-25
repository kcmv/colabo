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

export interface AuditedAction{
    _id: string; // unique id of the audited action
    time: string; // when did the action happen

    // action types
    type: BpmnSymbolType; // action type (BpmnSymbolType.Event, ...)
    subtype: BpmnSymbolSubType; // sub type (ActivityType.Task, EventType.Start, ...)
    subsubtype: BpmnSymbolSubSubType; // sub-sub type (EventSubType.Message, ...)

    flowId?: string; // name of the flow the action belongs to
    name: string; // name of the action (inside the flow)

    userId: string; // id of user initiating the action
    sessionId: string; // id of the session under which the call is initiated
    flowInstanceId: string; // id of the flow instance that started

    implementationId: string; // id of the implementation used for performing the action (i.e. if it is a person performing it, (s)he has been using a tool implemented and identified with implementationID) ('oven Smederevka')
    implementerId: string; // id of the person or component performing the action ('baker', or 'oven')
}