import { Component, OnInit, Input, NgModule } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {UserProfilingData} from './userProfilingData';

import {UsersProfilingService, ProfilingStateType} from './users-profiling.service';

import { CoLaboWareType } from '@colabo-colaboware/colaboware_core/coLaboWareData';
import { CoLaboWareData } from '@colabo-colaboware/colaboware_core/coLaboWareData';


// @NgModule({
//   declarations: [ UsersPopulationComponent ]
// })

@Component({
  selector: 'app-users-profiling',
  templateUrl: './users-profiling.component.html',
  styleUrls: ['./users-profiling.component.css']
})
export class UsersProfilingComponent implements OnInit {

  @Input() new_user_name:string = 'Unicorn';
  @Input() cw_data:string = '0009610521';

  constructor(
    private usersProfilingService: UsersProfilingService
  ) { }

  ngOnInit() {

  }

  ProfilingStateTypeNames:string[] = this.usersProfilingService.ProfilingStateTypeNames;

  get profilingState():ProfilingStateType{
    return this.usersProfilingService.profilingState;
  }

  get activeUser():KNode{
    return this.usersProfilingService.activeUser;
  }

  fillDemoUsers():void{
    this.usersProfilingService.fillDemoUsers();
  }

  set profilingState(state:ProfilingStateType){
    this.usersProfilingService.profilingState = state;
  }
  profileNewUser():void{
    this.usersProfilingService.profileNewUser();
  }

  inputUserProfile():void{
    console.log('inputUserProfile');
  }

  sendDemoColabowareInput():void{
      let cwData = new CoLaboWareData();
      cwData.type = CoLaboWareType.RFID;
      cwData.value = this.cw_data;

      if(UsersProfilingService.SINISHA)  this.usersProfilingService.colabowareInput(cwData);
      else this.usersProfilingService.selectUser(cwData);
  }

}
