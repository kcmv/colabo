/*
data required for and created by the user profiling process
*/
export class UserProfilingData{
  rfid:string = null;
  attributes:string[] = [];
  role:number = null;
  group:string = null;

  constructor(rfid:string = null, attributes:string[] = [],role:number = null){
    this.rfid = rfid;
    this.attributes = attributes;
    this.role = role;
  }
}
