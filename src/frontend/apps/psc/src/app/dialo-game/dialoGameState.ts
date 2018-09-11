export const enum DialoGamePhase{
  OPENNING,
  SECOND_ROUND,
  THIRDD_ROUND
}

export class DialoGameState{
  public phase:DialoGamePhase = DialoGamePhase.OPENNING;
}
