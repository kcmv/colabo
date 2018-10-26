import { Component, OnInit } from '@angular/core';
import {InsightsService} from '../insights/insights.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
//import { OrderPipe } from 'ngx-order-pipe';
// import { Pipe, PipeTransform } from '@angular/core';
// import { OrderPipe } from 'ngx-order-pipe'; //https://github.com/VadimDez/ngx-order-pipe
// import { environment } from '../../environments/environment';

// import * as config from '@colabo-utils/i-config';

//const MAP_ID = "5b96619b86f3cc8057216a03"; //PSC (PTW2018)
//const MAP_ID = "5b49e7f736390f03580ac9a7"; //Forum Vlasina

@Component({
  selector: 'registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent implements OnInit {
  // static mapId = config.GetGeneral('mapId');
  //users:KNode[];
  users:any[] = []; //[{name:'tes1'},{name:'tes2'},{name:'tes3'}];

  constructor(
    private insightsService:InsightsService
  ) {
  }

  ngOnInit() {
    this.insightsService.getRegisteredUsers().subscribe(this.usersReceived.bind(this));
  }

  private usersReceived(users:any[]):void{
    //console.log('usersReceived', users);
    this.users = users;
  }

}
