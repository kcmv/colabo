export const enum MyColaboFlowStates{
    NOT_STARTED,
    CHALLENGE_CARD_CHOSEN,
    ACTION_CHOSEN,
    RESPONSE_CARD_CHOSEN,
    DECORATIONS_CHOSEN,
    FINISHED
}

export class MyColaboFlowState{
  public state:MyColaboFlowStates = MyColaboFlowStates.NOT_STARTED;
}
