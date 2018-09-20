import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {ColaboFlowService} from '@colabo-colaboflow/core/lib/colabo-flow.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

const MAP_ID = "5b96619b86f3cc8057216a03"; //PSC (PTW2018)
export const TOPICHAT_MSG_TYPE:string = 'topiChat.talk.chatMsg';

@Component({
  selector: 'user-actions-statuses',
  templateUrl: './user-actions-statuses.component.html',
  styleUrls: ['./user-actions-statuses.component.css']
})
export class UserActionsStatusesComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private colaboFlowService:ColaboFlowService
  ) { }

  ngOnInit() {
    this.getCardsPlayedInTheCurrentRound();
  }

  getCardsPlayedInTheCurrentRound(){
    this.knalledgeNodeService.queryInMapofTypeAndContentData(MAP_ID, TOPICHAT_MSG_TYPE, "dialoGameReponse.playRound", this.colaboFlowService.colaboFlowState.playRound)
    .subscribe(this.cardsPlayedInTheCurrentRoundReceived.bind(this));
  }

  cardsPlayedInTheCurrentRoundReceived(cards:KNode[]):void{
    console.log('cardsPlayedInTheCurrentRoundReceived', cards);
  }
}
