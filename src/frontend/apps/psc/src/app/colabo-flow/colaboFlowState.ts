export const enum ColaboFlowStates{
  NOT_STARTED,
  OPENNING,
  PLAYING_ROUNDS
}

export class ColaboFlowState{
  public state:ColaboFlowStates = ColaboFlowStates.OPENNING;
  public playRound:number = 1;
}
