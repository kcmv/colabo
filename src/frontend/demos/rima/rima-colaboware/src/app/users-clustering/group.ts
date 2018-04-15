import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
/*
group of users
*/

export class Group{
  static MaxId = 0;

  _id:string = "" + (++Group.MaxId);
  name:string = "";

  refugee:KNode = null;
  local:KNode = null;
  activist:KNode = null;

  // users:KNode[] = [];
  //
  // addUser(user:KNode):void{
  //   this.users.push(user);
  // }
}
