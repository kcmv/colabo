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

  private _state: MyColaboFlowStates = MyColaboFlowStates.NOT_STARTED;
  public get state(): MyColaboFlowStates {
    return this._state;
  }
  public set state(value: MyColaboFlowStates) {
    this._state = value;
  }
  
  public data:any = {};

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
      default:
        return '-';
    }
  }

  public reset():MyColaboFlowStates{
    this.state = MyColaboFlowStates.NOT_STARTED;
    return this.state;
  }

  /**
  * sets the previous state
  * @returns previous state
  */
  public goBack():MyColaboFlowStates{
    console.log('goBack (BF)',this.state);
    switch(this.state){
      case MyColaboFlowStates.NOT_STARTED:
        this.state = MyColaboFlowStates.FINISHED; //TODO: check if this is OK
      break;
      case MyColaboFlowStates.CHOSING_CHALLENGE_CARD:
        this.state = MyColaboFlowStates.NOT_STARTED;
      break;
      case MyColaboFlowStates.CHOSING_RESPONSE_CARD:
        this.state = MyColaboFlowStates.CHOSING_CHALLENGE_CARD;
      break;
      case MyColaboFlowStates.CHOSING_DECORATOR_TYPE:
        this.state = MyColaboFlowStates.CHOSING_RESPONSE_CARD;
      break;
      case MyColaboFlowStates.CHOSING_DECORATOR:
        this.state = MyColaboFlowStates.CHOSING_DECORATOR_TYPE;
      break;
      case MyColaboFlowStates.PREVIEWING:
        this.state = MyColaboFlowStates.CHOSING_DECORATOR;
      break;
      case MyColaboFlowStates.FINISHED:
        this.state = MyColaboFlowStates.PREVIEWING;
      break;
    }
    console.log('goBack (AF)',this.state);
    return this.state;
  }

  public nextState():MyColaboFlowStates{
    console.log('nextState (BF)',this.state);
    switch(this.state){
      case MyColaboFlowStates.NOT_STARTED:
        this.state = MyColaboFlowStates.CHOSING_CHALLENGE_CARD;
      break;
      case MyColaboFlowStates.CHOSING_CHALLENGE_CARD:
        this.state = MyColaboFlowStates.CHOSING_RESPONSE_CARD;
      break;
      case MyColaboFlowStates.CHOSING_RESPONSE_CARD:
        this.state = MyColaboFlowStates.CHOSING_DECORATOR_TYPE;
      break;
      case MyColaboFlowStates.CHOSING_DECORATOR_TYPE:
        this.state = MyColaboFlowStates.CHOSING_DECORATOR;
      break;
      case MyColaboFlowStates.CHOSING_DECORATOR:
        this.state = MyColaboFlowStates.PREVIEWING;
      break;
      case MyColaboFlowStates.PREVIEWING:
        this.state = MyColaboFlowStates.FINISHED;
      break;
      case MyColaboFlowStates.FINISHED:
        this.state = MyColaboFlowStates.NOT_STARTED; //TODO: check if this is OK
      break;
    }
    console.log('nextState (AF)',this.state);
    return this.state;
  }

  isBasicMovePlayed():boolean{
    return this.state !== MyColaboFlowStates.NOT_STARTED && this.state !== MyColaboFlowStates.CHOSING_CHALLENGE_CARD && this.state !== MyColaboFlowStates.CHOSING_RESPONSE_CARD
  }

  serialize():any{
    return {
      'state':this.state,
      'data':this.data
    };
  }

  deserialize(object:any):void{
    this.state = object.state;
    this.data = object.data === null ? {} : object.data;
  }
}
