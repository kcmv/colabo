export const enum ColaboFlowStates{
  NOT_STARTED,
  OPENNING,
  SECOND_ROUND,
  THIRD_ROUND
}

export class ColaboFlowState{
  public state:ColaboFlowStates = ColaboFlowStates.OPENNING;
}
