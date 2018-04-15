import { Component, OnInit, Input } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {UsersProfilingService} from '../users-profiling/users-profiling.service';

import {UserProfilingData} from '../users-profiling/userProfilingData';

import {UsersClusteringService} from '../users-clustering/users-clustering.service';

import {Group} from '../users-clustering/group';

@Component({
  selector: 'users-groups',
  templateUrl: './users-groups.component.html',
  styleUrls: ['./users-groups.component.css']
})
export class UsersGroupsComponent implements OnInit {

  @Input() new_users_list:string = `
  `;

  newUserId:number = 0;
  newUsers:KNode[];

  constructor(
    private usersProfilingService: UsersProfilingService,
    private usersClusteringService: UsersClusteringService
  ) { }

  ngOnInit() {

  }

  get groupsNumber():number{
    return this.usersProfilingService.groupsNumber;
  }
  set groupsNumber(groupsNumber:number){
    this.usersProfilingService.groupsNumber = groupsNumber;
  }

  // get groups():KNode[]{
  get groups():Group[]{
    // return this.usersProfilingService.groups;
    return this.usersClusteringService.groups;
  }

  get users():KNode[]{
    return this.usersProfilingService.users;
  }

  get usersWithoutGroups():KNode[]{
    let users = [];

    for(var i=0; i<this.usersProfilingService.users.length; i++){
      let user = this.usersProfilingService.users[i];
      let userProfilingData = (user.dataContent.userProfilingData as UserProfilingData);
      if(!userProfilingData.group)
      {
        users.push(user);
      }
    }

    return users;
  }

  createNewUsers():void{
    this.newUserId = 0;
    this.newUsers = JSON.parse(this.new_users_list);

    if(this.newUserId < this.newUsers.length){
      this.usersProfilingService.createNewUser(this.newUsers[this.newUserId++], newUserCreated.bind(this));
    }

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      if(this.newUserId < this.newUsers.length){
        this.usersProfilingService.createNewUser(this.newUsers[this.newUserId++], newUserCreated.bind(this));
      }
    }
  }


}
