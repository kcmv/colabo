/*
data required for and created by the user Register process
*/
export class UserData{
  firstName:string = null;
  lastName:string = null;
  email:string = null;
  password:string = null;
  attributes:string[] = [];
  role:number = null;
  group:string = null;
  rfid:string = null;
  action:String = null;

  constructor(rfid:string = null, attributes:string[] = [],role:number = null){
    this.rfid = rfid;
    this.attributes = attributes;
    this.role = role;
  }
}
