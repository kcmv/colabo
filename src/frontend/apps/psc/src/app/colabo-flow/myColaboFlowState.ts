export const enum MyColaboFlowStates{
    NOT_STARTED,
    CHOSING_CHALLENGE_CARD,
    CHOSING_RESPONSE_CARD, //CHALLENGE_CARD_CHOSEN
    CHOSING_DECORATOR_TYPE, //RESPONSE_CARD_CHOSEN
    CHOSING_DECORATOR, //DECORATOR_TYPE_CHOSEN
    PREVIEWING, //DECORATOR_CHOSEN,
    FINISHED
}

export class MyColaboFlowState{
  public state:MyColaboFlowStates = MyColaboFlowStates.NOT_STARTED;

  /**
  * sets the previous state
  * @returns previous state
  */
  goBack():MyColaboFlowStates{
    switch(this.state){
      case MyColaboFlowStates.NOT_STARTED:
        this.state = MyColaboFlowStates.FINISHED; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.CHOSING_CHALLENGE_CARD:
        this.state = MyColaboFlowStates.NOT_STARTED; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.CHOSING_RESPONSE_CARD:
        this.state = MyColaboFlowStates.CHOSING_CHALLENGE_CARD; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.CHOSING_DECORATOR_TYPE:
        this.state = MyColaboFlowStates.CHOSING_RESPONSE_CARD; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.CHOSING_DECORATOR:
        this.state = MyColaboFlowStates.CHOSING_DECORATOR_TYPE; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.PREVIEWING:
        this.state = MyColaboFlowStates.CHOSING_DECORATOR; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.FINISHED:
        this.state = MyColaboFlowStates.PREVIEWING; //TODO: check if this is OK
      break;
    }
    return this.state;
  }
}
