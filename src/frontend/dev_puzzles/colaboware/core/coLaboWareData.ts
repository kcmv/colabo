export enum CoLaboWareType {
  RFID = 1,
  DICE = 2
}

export class CoLaboWareData{

  type: CoLaboWareType;
  value: string;
}
