export enum NotificationMsgType {
    Info = 'info',
    Warning = 'warning',
    Error = 'error'
}

export interface NotificationMsg {
    type: NotificationMsgType;
    title: string;
    msg: string;
}

