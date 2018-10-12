import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';
import {InsightsService} from '../insights.service';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

export class UserInsight{
  _id:string;
  name:string;
  sdgs:number[];
  isPlayedCardRound1:boolean;
  isPlayedCardRound2:boolean;
  isPlayedCardRound3:boolean;

  constructor(_id:string, name:string, sdgs:number[], isPlayedCardRound1:boolean, isPlayedCardRound2:boolean, isPlayedCardRound3:boolean){
    this._id = _id;
    this.name = name;
    this.sdgs = sdgs;
    this.isPlayedCardRound1 = isPlayedCardRound1;
    this.isPlayedCardRound2 = isPlayedCardRound2;
    this.isPlayedCardRound3 = isPlayedCardRound3;
  }
}

@Component({
  selector: 'user-actions-statuses',
  templateUrl: './user-actions-statuses.component.html',
  styleUrls: ['./user-actions-statuses.component.css']
})
export class UserActionsStatusesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'isPlayedCardRound1', 'isPlayedCardRound2', 'isPlayedCardRound3'];
  dataSource:UserInsight[] = [];

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private colaboFlowService:ColaboFlowService,
    private insightsService:InsightsService
  ) { }

  ngOnInit() {
    this.getCardsPlayedInTheRound();
  }

  playRoundChanged():void{
    this.getCardsPlayedInTheRound();
  }

  getCardsPlayedInTheRound():void{
    this.insightsService.getCardsPlayedInTheRound(this.colaboFlowService.colaboFlowState.playRound, true).subscribe(this.cardsPlayedReceived.bind(this));
  }

  private usersReceived(users:KNode[]):void{
    //console.log('usersReceived', users);
    this.dataSource = [];
    let usrId:string;
    for(var i:number=0; i<users.length; i++){
      usrId = users[i]._id;
      this.dataSource.push(new UserInsight(users[i]._id, users[i].name, [], this.insightsService.hasUserPlayedInTheRound(usrId, 1), this.insightsService.hasUserPlayedInTheRound(usrId, 2), this.insightsService.hasUserPlayedInTheRound(usrId, 3)));
    }
  }

  // getUserActionsStatusesData():void{
  //
  //   this.dataSource = [
  //     {position: 1, name: 'Sinisa', weight: 1.0079, symbol: 'H'},
  //     {position: 2, name: 'Sasa', weight: 4.0026, symbol: 'He'},
  //     {position: 3, name: 'Test', weight: 6.941, symbol: 'Li'},
  //     {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  //     {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  //     {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  //     {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  //     {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  //     {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  //     {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  //   ];
  // }

  cardsPlayedReceived(cards:KNode[]):void{
    console.log('cardsPlayedReceived', cards);

    this.insightsService.getRegisteredUsers().subscribe(this.usersReceived.bind(this));
    //TODO: so far not doing anything just to have the cards in service
    // //resetting 'hasUserPlayedInTheRound' for the case that this method returns after the 'usersReceived' method
    // for(var c:number=0; c<cards.length; c++){
    //   for(var u:number=0; u<this.dataSource.length; u++){
    //     if(this.dataSource[u]._id = cards[i].iAmId){
    //       this.dataSource[u]
    //     }
    // }
  }

}
