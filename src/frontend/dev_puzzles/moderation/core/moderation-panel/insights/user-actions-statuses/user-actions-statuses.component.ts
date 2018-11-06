import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';
import {InsightsService} from '../insights.service';
//import {TooltipPosition} from '@angular/material';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

export class UserInsight{
  user:KNode = null;
  myColaboFlowState:number;
  cwcs:KNode[];
  sdgs:number[];
  isPlayedCardRound1:boolean;
  isPlayedCardRound2:boolean;
  isPlayedCardRound3:boolean;

  constructor(user:KNode, myColaboFlowState:number, cwcs:KNode[], sdgs:number[], isPlayedCardRound1:boolean, isPlayedCardRound2:boolean, isPlayedCardRound3:boolean){
    this.user = user;
    // if(!('dataContent' in this.user)){this.user.dataContent = {};}
    this.myColaboFlowState = myColaboFlowState;
    this.cwcs = cwcs
    this.sdgs = sdgs;
    this.isPlayedCardRound1 = isPlayedCardRound1;
    this.isPlayedCardRound2 = isPlayedCardRound2;
    this.isPlayedCardRound3 = isPlayedCardRound3;
  }

  get id():string{
    return this.user._id;
  }

  get name():string{
    return this.user.name;
  }

  get email():string{
    return this.user.dataContent.email;
  }
}

@Component({
  selector: 'user-actions-statuses',
  templateUrl: './user-actions-statuses.component.html',
  styleUrls: ['./user-actions-statuses.component.css']
})
export class UserActionsStatusesComponent implements OnInit {
  static CWCS_REQUIRED:number = 5;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'name', 'myColaboFlowState', 'cwcs', 'sdgs', 'isPlayedCardRound1', 'isPlayedCardRound2', 'isPlayedCardRound3'];
  usersData:MatTableDataSource<UserInsight> = null; //any = [];//UserInsight[] = []; TODO

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private colaboFlowService:ColaboFlowService,
    private insightsService:InsightsService
  ) { }

  ngOnInit() {
    this.getCardsPlayedInTheRound();
    if(this.usersData !== null){this.usersData.sort = this.sort;}
    //this.getCWCs();
  }

  getCWCsPrint(us:UserInsight):string{
    //console.log('getCWCsPrint:: UserInsight', us);
    let cwcs:string = '';
    let conn:string = '';
    let cwc:KNode;
    for(var c:number = 0; c < us.cwcs.length; c++){
      // console.log('getCWCsPrint:: us.cwcs', us.cwcs);
      cwc = us.cwcs[c];
      if(('dataContent' in cwc) && ('humanID' in cwc.dataContent)){
        cwcs+= conn + cwc.dataContent.humanID;
        conn = ', ';
      }
    }
    return cwcs;
  }

  correctCWCNo(us:UserInsight):boolean{
    //console.log('correctCWCNo')
    return us.cwcs.length === UserActionsStatusesComponent.CWCS_REQUIRED;
  }

  playRoundChanged():void{
    this.getCardsPlayedInTheRound();
  }

  getCardsPlayedInTheRound():void{
    this.insightsService.getCardsPlayedInTheRound(this.colaboFlowService.colaboFlowState.playRound, true).subscribe(this.cardsPlayedReceived.bind(this));
  }

  getCWCs():void{
    this.insightsService.getCWCs(this.colaboFlowService.colaboFlowState.playRound, true).subscribe(this.cwcsReceived.bind(this));
  }

  cwcsReceived(cwcs:KNode[]):void{
    console.log('cwcsReceived',cwcs);
    let usrD:UserInsight;
    let userDataInTab:UserInsight[] = null
    // if(this.usersData instanceof MatTableDataSource){
    // userDataInTab = (this.usersData as MatTableDataSource<UserInsight>).data;
    userDataInTab = this.usersData.data;
    // }else{
    //   userDataTrans = this.usersData;
    // }

    for(var u:number = 0; u < userDataInTab.length; u++){
      userDataInTab[u].cwcs = [];
    }
    for(var c:number = 0; c < cwcs.length; c++){
      for(var u:number = 0; u < userDataInTab.length; u++){
        usrD = userDataInTab[u];
        if(cwcs[c].iAmId === usrD.user._id){
          usrD.cwcs.push(cwcs[c]);
        }
      }
    }
  }

  private usersReceived(users:KNode[]):void{
    //console.log('usersReceived', users);
    let userInsights = [];
    let usrId:string;
    let user:KNode;
    for(var i:number=0; i<users.length; i++){
      user = users[i];
      usrId = user._id;
      userInsights.push(new UserInsight(user, 0, [], [], this.insightsService.hasUserPlayedInTheRound(usrId, 1), this.insightsService.hasUserPlayedInTheRound(usrId, 2), this.insightsService.hasUserPlayedInTheRound(usrId, 3)));
    }

    // console.log('usersData:B',JSON.stringify(userInsights));
    this.usersData = new MatTableDataSource(userInsights);
    // console.log('usersData:A',JSON.stringify(this.usersData));
    this.usersData.sort = this.sort;
    this.getCWCs();
  }

  // getUserActionsStatusesData():void{
  //
  //   this.usersData = [
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
    //   for(var u:number=0; u<this.usersData.length; u++){
    //     if(this.usersData[u]._id = cards[i].iAmId){
    //       this.usersData[u]
    //     }
    // }
  }

}
