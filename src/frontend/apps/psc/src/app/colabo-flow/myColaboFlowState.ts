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

  static stateName(state):string{
    switch(state){
      case MyColaboFlowStates.NOT_STARTED:
        return 'not started';
      case MyColaboFlowStates.CHOSING_CHALLENGE_CARD:
        return 'chosing challenge';
      case MyColaboFlowStates.CHOSING_RESPONSE_CARD:
        return 'chosing response';
      case MyColaboFlowStates.CHOSING_DECORATOR_TYPE:
        return 'chosing deco type';
      case MyColaboFlowStates.CHOSING_DECORATOR:
        return 'chosing deco';
      case MyColaboFlowStates.PREVIEWING:
        return 'previewing';
      case MyColaboFlowStates.FINISHED:
        return 'finished';
    }
  }

  /**
  * sets the previous state
  * @returns previous state
  */
  goBack():MyColaboFlowStates{
    console.log('goBack (BF)',this.state);
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
    console.log('goBack (AF)',this.state);
    return this.state;
  }

  isBasicMovePlayed():boolean{
    return this.state !== MyColaboFlowStates.NOT_STARTED && this.state !== MyColaboFlowStates.CHOSING_CHALLENGE_CARD && this.state !== MyColaboFlowStates.CHOSING_RESPONSE_CARD
  }
}
