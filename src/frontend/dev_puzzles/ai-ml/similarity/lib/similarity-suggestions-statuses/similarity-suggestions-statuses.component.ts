import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';
import {InsightsService} from '@colabo-moderation/f-core/moderation-panel/insights/insights.service';
import {SimilarityService} from '../similarity.service';

//import {TooltipPosition} from '@angular/material';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

export class UserSuggestions{
  user:KNode = null;
  myColaboFlowState:number;
  cwcs:KNode[];
  sdgs:number[];
  suggestionsForRound1:KNode;
  suggestionsForRound2:KNode;
  suggestionsForRound3:KNode;

  constructor(user:KNode, myColaboFlowState:number, cwcs:KNode[], sdgs:number[], suggestionsForRound1:KNode, suggestionsForRound2:KNode, suggestionsForRound3:KNode){
    this.user = user;
    // if(!('dataContent' in this.user)){this.user.dataContent = {};}
    this.cwcs = cwcs;
    this.suggestionsForRound1 = suggestionsForRound1;
    this.suggestionsForRound2 = suggestionsForRound2;
    this.suggestionsForRound3 = suggestionsForRound3;
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
  selector: 'similarity-suggestions-statuses',
  templateUrl: './similarity-suggestions-statuses.component.html',
  styleUrls: ['./similarity-suggestions-statuses.component.css']
})
export class SimilaritySuggestionsStatusesComponent implements OnInit {
  static CWCS_REQUIRED:number = 5;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'name', 'cwcs', 'suggestionsForRound1', 'suggestionsForRound2', 'suggestionsForRound3'];
  usersData:MatTableDataSource<UserSuggestions> = null; //any = [];//UserSuggestions[] = []; TODO

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private colaboFlowService:ColaboFlowService,
    private insightsService:InsightsService,
    private similarityService:SimilarityService
  ) { }

  ngOnInit() {
    // this.getCardsPlayedInTheRound();
    console.log('[SimilaritySuggestionsStatusesComponent].ngOnInit');
    this.insightsService.getRegisteredUsers().subscribe(this.usersReceived.bind(this));
    if(this.usersData !== null){this.usersData.sort = this.sort;}
    //this.getCWCs();
  }

  getCWCsPrint(us:UserSuggestions):string{
    //console.log('getCWCsPrint:: UserSuggestions', us);
    let cwcs:string = '';
    let conn:string = '';
    let cwc:KNode;
    for(var c:number = 0; c < us.cwcs.length; c++){
      // console.log('getCWCsPrint:: us.cwcs', us.cwcs);
      cwc = us.cwcs[c]; 
      if(('dataContent' in cwc) && ('humanID' in cwc.dataContent)){
        // cwcs+= conn + '<span matTooltip="CWC">'+cwc.dataContent.humanID+'</span>';
        // cwcs+= conn + '<span matTooltip="'+cwc.name+'">'+cwc.dataContent.humanID+ (this.insightsService.isCwcPlayed(cwc) ? 'p' : '') + '</span>';
        cwcs+= conn + '<B>' + cwc.dataContent.humanID + (this.insightsService.isCwcPlayed(cwc) ? ' (p:' +this.insightsService.roundPlayed(cwc) + ')' : '') + '</B>: ' + cwc.name;
        // conn = ', ';
        conn = ', \n<br/>';
      }
    }
    //console.log('[getCWCsPrint] cwcs',cwcs);
    return cwcs;
  }

  correctCWCNo(us:UserSuggestions):boolean{
    //console.log('correctCWCNo')
    return us.cwcs.length === InsightsService.CWCS_REQUIRED;
  }

  getCWCs():void{
    this.insightsService.getCWCs(true).subscribe(this.cwcsReceived.bind(this));
  }

  cwcsReceived(cwcs:KNode[]):void{
    console.log('cwcsReceived',cwcs);
    let usrD:UserSuggestions;
    let userDataInTab:UserSuggestions[] = null
    // if(this.usersData instanceof MatTableDataSource){
    // userDataInTab = (this.usersData as MatTableDataSource<UserSuggestions>).data;
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
    let UserSuggestionss = [];
    let usrId:string;
    let user:KNode;
    for(var i:number=0; i<users.length; i++){
      user = users[i];
      usrId = user._id;
      UserSuggestionss.push(new UserSuggestions(user, 0, [], [], null, null, null));
    }

    // console.log('usersData:B',JSON.stringify(UserSuggestionss));
    this.usersData = new MatTableDataSource(UserSuggestionss);
    // console.log('usersData:A',JSON.stringify(this.usersData));
    this.usersData.sort = this.sort;
    this.getCWCs();
    this.getSimilaritySuggestions();
  }

  getSimilaritySuggestions():void{
    this.similarityService.getSimilaritySuggestions().subscribe(this.similaritySuggestionsReceived.bind(this));
  }

  private similaritySuggestionsReceived(similarities:KNode[]):void{
    console.log('similaritySuggestionsReceived',similarities);
    let usrD:UserSuggestions;
    let userDataInTab:UserSuggestions[] = null
    // if(this.usersData instanceof MatTableDataSource){
    // userDataInTab = (this.usersData as MatTableDataSource<UserSuggestions>).data;
    userDataInTab = this.usersData.data;
    // }else{
    //   userDataTrans = this.usersData;
    // }

    for(var s:number = 0; s < similarities.length; s++){
      for(var u:number = 0; u < userDataInTab.length; u++){
        usrD = userDataInTab[u];
        if(similarities[s].iAmId === usrD.user._id){
          switch(similarities[s].dataContent.result.playRound){
            case 1:
              usrD.suggestionsForRound1 = similarities[s];
            break;
            case 2:
              usrD.suggestionsForRound2 = similarities[s];
            break;
            case 3:
              usrD.suggestionsForRound3 = similarities[s];
            break;
          }
        }
      }
    }
  }

  printSuggestion(suggestion:KNode):string{
    return suggestion === null ? '-' : JSON.stringify(suggestion.dataContent.result.suggestions as Array<any>);
  }
}
