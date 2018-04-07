import { Component, OnInit, Input } from '@angular/core';
import {CoLaboWareData} from './coLaboWareData';
import {CoLaboWareType} from './coLaboWareData';
import {UserProfilingData} from './userProfilingData';

import {MatRadioModule} from '@angular/material/radio';

import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

enum ProfilingStateType {
  OFF = 'OFF',
  USER_ID = 'USER_ID',
  ATTRIBUTE = 'ATTRIBUTE'
}

@Component({
  selector: 'app-users-profiling',
  templateUrl: './users-profiling.component.html',
  styleUrls: ['./users-profiling.component.css']
})
export class UsersProfilingComponent implements OnInit {

  ProfilingStateTypeNames:string[] = [
    'OFF',
    'USER_ID',
    'ATTRIBUTE'
  ];

  @Input() cw_data:string = '0009610521';

  users:KNode[] = [];

  activeUser:KNode = null;

  profilingState: string = ProfilingStateType.OFF;

  constructor() { }

  ngOnInit() {
  }

  profileNewUser():void
  {
    console.log('profileNewUser');
    this.profilingState = ProfilingStateType.USER_ID;
  }

  setUserId(id:string):void
  {
    console.log('setUserId');
    //TODO: +mprinc check if user exists
    this.createUser(id);
  }

  createUser(id:string):void{
    console.log('createUser');
    let user:KNode = new KNode();
    user.type = KNode.TYPE_USER;
    user.name = 'u_'+id;
    this.users.push(user);
    this.profilingState = ProfilingStateType.ATTRIBUTE; //after setting up user, we set up its attributes
    this.activeUser = user;
    console.log('this.activeUser:'+this.activeUser.name);
    let userProfilingData:UserProfilingData = new UserProfilingData();
    userProfilingData.rfid = id;
    user.dataContent.userProfilingData = userProfilingData;
  }

  setUserAttribute(attr:string):void{
    let userProfilingData:UserProfilingData = (<UserProfilingData>this.activeUser.dataContent.userProfilingData);
    userProfilingData.attributes.push(attr); //TODO
  }

  inputUserProfile():void{
    console.log('inputUserProfile');
  }

  sendDemoColabowareInput():void{
      let cwData = new CoLaboWareData();
      cwData.type = CoLaboWareType.RFID;
      cwData.value = this.cw_data;
      this.colabowareInput(cwData);
  }

  colabowareInput(cwData:CoLaboWareData){
    if(cwData.type === CoLaboWareType.RFID){
        console.log('cwData:'+cwData.value);
        switch(this.profilingState){
          case ProfilingStateType.USER_ID:
            this.setUserId(cwData.value);
            break;
          case ProfilingStateType.ATTRIBUTE:
            this.setUserAttribute(cwData.value);
            break;

          case ProfilingStateType.OFF:
          default:
            break;
        }
    }
  }

}
