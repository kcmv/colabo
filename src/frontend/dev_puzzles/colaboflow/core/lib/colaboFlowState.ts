export const enum ColaboFlowStates{
  NOT_STARTED,
  OPENNING,
  PLAYING_ROUNDS
}


export class ColaboFlowState{
  public state:ColaboFlowStates = ColaboFlowStates.OPENNING;
  public playRound:number = 1;

  static stateName(state:ColaboFlowStates):string{
    switch(state){
      case ColaboFlowStates.NOT_STARTED:
        return 'not started';
      case ColaboFlowStates.OPENNING:
        return 'openning';
      case ColaboFlowStates.PLAYING_ROUNDS:
        return 'playing';
      default:
        return 'unknown';
    }
  }

  nextState():ColaboFlowStates{
    switch(this.state){
      case ColaboFlowStates.NOT_STARTED:
        this.state = ColaboFlowStates.OPENNING;
        break;
      case ColaboFlowStates.OPENNING:
        this.state = ColaboFlowStates.PLAYING_ROUNDS;
        break;
      case ColaboFlowStates.PLAYING_ROUNDS:
        //keep being in this state:
        //this.state = ColaboFlowStates.OPENNING
        break;
      default:
    }
    this.playRound++;
    return this.state;
  }
}
