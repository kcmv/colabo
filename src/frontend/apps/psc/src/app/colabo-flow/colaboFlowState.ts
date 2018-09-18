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
}
