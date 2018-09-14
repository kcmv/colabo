export const enum MyColaboFlowStates{
    NOT_STARTED,
    CHALLENGE_CARD_CHOSEN, //CHOSING_RESPONSE_CARD
    RESPONSE_CARD_CHOSEN, //CHOSING_DECORATORS
    DECORATOR_TYPE_CHOSEN,
    DECORATOR_CHOSEN,
    FINISHED
}

export class MyColaboFlowState{
  public state:MyColaboFlowStates = MyColaboFlowStates.NOT_STARTED;
}
