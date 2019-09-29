import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort } from "@angular/material";
import { DataSource } from "@angular/cdk/table";
import { KnalledgeNodeService } from "@colabo-knalledge/f-store_core/knalledge-node.service";
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";
import { KEdge } from "@colabo-knalledge/f-core/code/knalledge/kEdge";
import { ColaboFlowService } from "@colabo-flow/f-core/lib/colabo-flow.service";
import {
  MyColaboFlowState,
  MyColaboFlowStates
} from "@colabo-flow/f-core/lib/myColaboFlowState";
import { InsightsService } from "../insights.service";
import { MatSnackBar } from "@angular/material";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
//TODO: move into a puzzle: import {BottomShDgData, BottomShDg} from './bottom-sh-dg/bottom-sh-dg';

//import {TooltipPosition} from '@angular/material';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

export class UserInsight {
  user: KNode = null;
  myColaboFlowState: MyColaboFlowStates;
  cwcs: KNode[];
  sdgs: number[];
  cardPlayedInRound1: KNode;
  cardPlayedInRound2: KNode;
  cardPlayedInRound3: KNode;

  constructor(
    user: KNode,
    myColaboFlowState: MyColaboFlowStates,
    cwcs: KNode[],
    sdgs: number[],
    cardPlayedInRound1: KNode,
    cardPlayedInRound2: KNode,
    cardPlayedInRound3: KNode
  ) {
    this.user = user;
    // if(!('dataContent' in this.user)){this.user.dataContent = {};}
    this.myColaboFlowState = myColaboFlowState;
    this.cwcs = cwcs;
    this.sdgs = sdgs;
    this.cardPlayedInRound1 = cardPlayedInRound1;
    this.cardPlayedInRound2 = cardPlayedInRound2;
    this.cardPlayedInRound3 = cardPlayedInRound3;
  }

  get id(): string {
    return this.user._id;
  }

  get name(): string {
    return this.user.name;
  }

  get group(): string {
    return this.user.dataContent.group;
  }

  get email(): string {
    return this.user.dataContent.email;
  }
}

@Component({
  selector: "user-actions-statuses",
  templateUrl: "./user-actions-statuses.component.html",
  styleUrls: ["./user-actions-statuses.component.css"]
})
export class UserActionsStatusesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public allColumns: string[] = [
    "id",
    "name",
    "group",
    "myColaboFlowState",
    "cwcs",
    "sdgs",
    "cardPlayedInRound1",
    "cardPlayedInRound2",
    "cardPlayedInRound3",
    "actions"
  ];
  public displayedColumns: string[] = [
    "id",
    "name",
    "group",
    "myColaboFlowState",
    "cwcs",
    "sdgs",
    //'cardPlayedInRound1', 'cardPlayedInRound2', 'cardPlayedInRound3',
    "actions"
  ]; //this.allColumns.slice(0);

  usersData: MatTableDataSource<UserInsight> = null; //any = [];//UserInsight[] = []; TODO

  constructor(
    private knalledgeNodeService: KnalledgeNodeService,
    private colaboFlowService: ColaboFlowService,
    private insightsService: InsightsService,
    private snackBar: MatSnackBar // , // private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.insightsService
      .getRegisteredUsers()
      .subscribe(this.usersReceived.bind(this));

    if (this.usersData !== null) {
      this.setUpSourceData();
    }
    //this.getCWCs();
  }

  displayColumnChanged(val: string): void {
    console.log("displayColumnChanged:" + val);
    let ind: number;
    if ((ind = this.displayedColumns.indexOf(val)) > -1) {
      this.displayedColumns.splice(ind, 1);
    } else {
      //putting at the original column-position (instead just at the end) to preserve the original order of columns:
      let originalIndex: number = this.allColumns.indexOf(val);
      let foundBefore: boolean = false;
      for (var i: number = 0; i < this.displayedColumns.length; i++) {
        let column: string = this.displayedColumns[i];
        if (this.allColumns.indexOf(column) > originalIndex) {
          this.displayedColumns.splice(i > 0 ? i : 0, 0, val);
          console.log("foundBefore, i=", i, "column", column);
          foundBefore = true;
          break;
        }
      }
      if (!foundBefore) {
        this.displayedColumns.push(val);
      }
    }
  }

  isColumnDisplayed(name: string): boolean {
    return this.displayedColumns.includes(name);
  }

  protected setUpSourceData(): void {
    this.usersData.sort = this.sort;
    // this.usersData.paginator = this.paginator;
  }

  public applyFilter(filterValue: string) {
    let filterValuePrep = filterValue.trim().toLowerCase();
    console.log("applyFilter", filterValuePrep);
    if (this.usersData !== null) {
      console.log("[applyFilter] this.usersData", this.usersData);
      this.usersData.filter = filterValuePrep;
    }
  }

  getCWCsPrint(us: UserInsight): string {
    //console.log('getCWCsPrint:: UserInsight', us);
    let cwcs: string = "";
    let conn: string = "";
    let cwc: KNode;
    for (var c: number = 0; c < us.cwcs.length; c++) {
      // console.log('getCWCsPrint:: us.cwcs', us.cwcs);
      cwc = us.cwcs[c];
      // cwcs+= conn + '<span matTooltip="CWC">'+cwc.dataContent.humanID+'</span>';
      // cwcs+= conn + '<span matTooltip="'+cwc.name+'">'+cwc.dataContent.humanID+ (this.insightsService.isCwcPlayed(cwc) ? 'p' : '') + '</span>';

      cwcs +=
        conn +
        "<B>" +
        ("dataContent" in cwc && "humanID" in cwc.dataContent
          ? cwc.dataContent.humanID + " "
          : "") +
        (this.insightsService.isCwcPlayed(cwc)
          ? " (p:" + this.insightsService.roundPlayed(cwc) + ")"
          : "") +
        "</B>: " +
        //+ '(<span matTooltip="Sinisa Test CWC">TT</span>) '
        cwc.name;

      // conn = ', ';
      conn = ", \n<br/>";
    }
    //console.log('[getCWCsPrint] cwcs',cwcs);
    return cwcs;
  }

  correctCWCNo(us: UserInsight): boolean {
    //console.log('correctCWCNo')
    return us.cwcs.length === InsightsService.CWCS_REQUIRED;
  }

  printSDGs(us: UserInsight): string {
    // 'http://localhost:8891/assets/images/sdgs/s/sdg' + us.sdgs[i] + '.jpg'; //sdgs contains humanIDs
    return us.sdgs.length > 0 ? us.sdgs.toString() : "no SDGs\nselected";
  }

  correctSDGNo(us: UserInsight): boolean {
    //console.log('correctSDGNo')
    return us.sdgs.length === InsightsService.SDGS_REQUIRED;
  }

  deleteSDGSelection(userId: string): void {
    console.log("deleteSDGSelection", userId);
  }

  playRoundChanged(): void {
    this.getCardsPlayed();
  }

  // getCardsPlayedInTheRound():void{
  //   this.insightsService.getCardsPlayedInTheRound(this.colaboFlowService.colaboFlowState.playRound, true).subscribe(this.cardsPlayedReceived.bind(this));
  // }

  getCardsPlayed(): void {
    this.insightsService
      .getCardsPlayed(true)
      .subscribe(this.cardsPlayedReceived.bind(this));
  }

  getCWCs(): void {
    this.insightsService.getCWCs(true).subscribe(this.cwcsReceived.bind(this));
  }

  cwcsReceived(cwcs: KNode[]): void {
    console.log("cwcsReceived", cwcs);
    let usrD: UserInsight;
    let userDataInTab: UserInsight[] = null;
    // if(this.usersData instanceof MatTableDataSource){
    // userDataInTab = (this.usersData as MatTableDataSource<UserInsight>).data;
    userDataInTab = this.usersData.data;
    // }else{
    //   userDataTrans = this.usersData;
    // }

    for (var u: number = 0; u < userDataInTab.length; u++) {
      userDataInTab[u].cwcs = [];
    }
    for (var c: number = 0; c < cwcs.length; c++) {
      for (var u: number = 0; u < userDataInTab.length; u++) {
        usrD = userDataInTab[u];
        if (cwcs[c].iAmId === usrD.user._id) {
          usrD.cwcs.push(cwcs[c]);
        }
      }
    }
  }

  onUserDeleted(event: any, userId: string): void {
    console.log("onUserDeleted(" + event + "," + userId + ")");
    this.usersData.data.splice(
      this.usersData.data.findIndex(userInList => {
        return userInList.user._id === userId;
      }),
      1
    );
    this.setUpSourceData();
  }

  getSDGSelections(): void {
    this.insightsService
      .getSDGSelections(false)
      .subscribe(this.sDGSelectionsReceived.bind(this));
  }

  sDGSelectionsReceived(sdgs: KEdge[]): void {
    console.log("sDGSelectionsReceived", sdgs);
    let usrD: UserInsight;
    let userDataInTab: UserInsight[] = null;
    // if(this.usersData instanceof MatTableDataSource){
    // userDataInTab = (this.usersData as MatTableDataSource<UserInsight>).data;
    userDataInTab = this.usersData.data;
    // }else{
    //   userDataTrans = this.usersData;
    // }

    for (var u: number = 0; u < userDataInTab.length; u++) {
      userDataInTab[u].sdgs = [];
    }
    for (var s: number = 0; s < sdgs.length; s++) {
      for (var u: number = 0; u < userDataInTab.length; u++) {
        usrD = userDataInTab[u];
        if (sdgs[s].iAmId === usrD.user._id) {
          usrD.sdgs.push((sdgs[s].targetId as any).dataContent.humanID); //TODO: expects that the current situation in which humanIDs of SDGs are equal SDG Number.
        }
      }
    }
  }

  private usersReceived(users: KNode[]): void {
    //console.log('usersReceived', users);
    let userInsights = [];
    let usrId: string;
    let user: KNode;
    for (var i: number = 0; i < users.length; i++) {
      user = users[i];
      usrId = user._id;
      userInsights.push(new UserInsight(user, null, [], [], null, null, null));
    }

    // console.log('usersData:B',JSON.stringify(userInsights));
    this.usersData = new MatTableDataSource(userInsights);
    // console.log('usersData:A',JSON.stringify(this.usersData));
    this.setUpSourceData();
    this.getCWCs();
    this.getMyCFStates();
    this.getCardsPlayed();
    this.getSDGSelections();
  }

  printCardPlayed(card: KNode): string {
    return card && "dataContent" in card
      ? card.dataContent.humanID + ": " + card.name
      : "-";
  }

  getMyCFStates(): void {
    this.insightsService
      .getMyCFStatesForAllUsers()
      .subscribe(this.myCFStatesForAllUsersReceived.bind(this));
  }

  myCFStatesForAllUsersReceived(cfStateNodes: KNode[]): void {
    console.log("[myCFStatesForAllUsersReceived] cfStateNodes", cfStateNodes);

    let usrD: UserInsight;
    let userDataInTab: UserInsight[] = null;
    userDataInTab = this.usersData.data;

    for (var u: number = 0; u < userDataInTab.length; u++) {
      userDataInTab[u].myColaboFlowState = null;
    }
    for (var c: number = 0; c < cfStateNodes.length; c++) {
      for (var u: number = 0; u < userDataInTab.length; u++) {
        usrD = userDataInTab[u];
        if (cfStateNodes[c].iAmId === usrD.user._id) {
          usrD.myColaboFlowState = cfStateNodes[c].dataContent[
            "MyColaboFlowState"
          ].state as MyColaboFlowStates;
        }
      }
    }
  }

  getMyColaboFlowStateName(state: MyColaboFlowStates): string {
    return MyColaboFlowState.stateName(state);
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

  //TODO: cardsPlayedReceived is partially refactored - we should finish this ti be more effective - not having individual cardHumanIdPlayedInTheRound calls etc:
  cardsPlayedReceived(): void {
    // console.log('cardsPlayedReceived', cards);

    let usrD: UserInsight;
    let userDataInTab: UserInsight[] = null;
    // if(this.usersData instanceof MatTableDataSource){
    // userDataInTab = (this.usersData as MatTableDataSource<UserInsight>).data;
    userDataInTab = this.usersData.data;
    // }else{
    //   userDataTrans = this.usersData;
    // }

    for (var u: number = 0; u < userDataInTab.length; u++) {
      usrD = userDataInTab[u];
      usrD.cardPlayedInRound1 = this.insightsService.cardHumanIdPlayedInTheRound(
        usrD.id,
        1
      );
      usrD.cardPlayedInRound2 = this.insightsService.cardHumanIdPlayedInTheRound(
        usrD.id,
        2
      );
      usrD.cardPlayedInRound3 = this.insightsService.cardHumanIdPlayedInTheRound(
        usrD.id,
        3
      );
    }

    //TODO: so far not doing anything just to have the cards in service
    // //resetting 'hasUserPlayedInTheRound' for the case that this method returns after the 'usersReceived' method
    // for(var c:number=0; c<cards.length; c++){
    //   for(var u:number=0; u<this.usersData.length; u++){
    //     if(this.usersData[u]._id = cards[i].iAmId){
    //       this.usersData[u]
    //     }
    // }
  }

  resetCWCtoUnplayed(cwc: KNode): void {
    if (confirm("Do you really want to reset this CWC to unplayed?")) {
      this.colaboFlowService
        .resetCWCtoUnplayed(cwc)
        .subscribe(this.cwcReseted.bind(this));
    }
  }

  cwcReseted(cwc: KNode): void {
    window.alert('CWC "' + cwc.name + '" is reseted');
  }
}
