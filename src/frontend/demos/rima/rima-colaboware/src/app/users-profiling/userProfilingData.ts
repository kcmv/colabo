export class UserProfilingData{
  rfid:string = null;
  attributes:string[] = [];

  constructor(rfid:string = null, attributes:string[] = []){
    this.rfid = rfid;
    this.attributes = attributes;
  }
}
