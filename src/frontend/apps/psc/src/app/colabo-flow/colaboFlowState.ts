export const enum ColaboFlowStates{
  OPENNING,
  SECOND_ROUND,
  THIRD_ROUND
}

export class ColaboFlowState{
  public state:ColaboFlowStates = ColaboFlowStates.OPENNING;
}
