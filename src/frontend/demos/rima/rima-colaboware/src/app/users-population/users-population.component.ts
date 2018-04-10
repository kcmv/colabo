import { Component, OnInit, Input } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {UsersProfilingService} from '../users-profiling/users-profiling.service';


@Component({
  selector: 'users-population',
  templateUrl: './users-population.component.html',
  styleUrls: ['./users-population.component.css']
})
export class UsersPopulationComponent implements OnInit {

  @Input() new_users_list:string = `
  [
    {
      "name": "01. Hawskbill Turtle",
      "number": "01",
      "image": {
        "url": "http://r.ddmcdn.com/s_f/o_1/cx_0/cy_34/cw_2001/ch_2001/w_720/APL/uploads/2015/11/Hawksbill-Turtle-FRONT-PAGE.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009592295"
      }
    },
    {
      "name": "02. Giant Panda",
      "number": "02",
      "image": {
        "url": "http://r.ddmcdn.com/s_f/o_1/cx_11/cy_776/cw_1957/ch_1957/w_720/APL/uploads/2015/11/giant-panda-FRONT-PAGE.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009595752"
      }
    }
  ]
  `;

  constructor(
    private usersProfilingService: UsersProfilingService
  ) { }

  ngOnInit() {

  }

  createNewUsers():void{
    let newUserId = 0;
    let newUsers = JSON.parse(this.new_users_list);

    if(newUserId < newUsers.length){
      this.usersProfilingService.createNewUser(newUsers[newUserId++], newUserCreated.bind(this));
    }

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      if(newUserId < newUsers.length){
        this.usersProfilingService.createNewUser(newUsers[newUserId++], newUserCreated.bind(this));
      }
    }
  }


}
