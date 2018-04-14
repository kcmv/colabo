import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
/*
group of users
*/
export class Group{
  users:KNode[] = [];

  addUser(user:KNode):void{
    this.users.push(user);
  }
}
