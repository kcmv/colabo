import { Component, OnInit, Input } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {UsersProfilingService} from '../users-profiling/users-profiling.service';


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
    private usersProfilingService: UsersProfilingService
  ) { }

  ngOnInit() {

  }

  get users():KNode[]{
    return this.usersProfilingService.users;
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
