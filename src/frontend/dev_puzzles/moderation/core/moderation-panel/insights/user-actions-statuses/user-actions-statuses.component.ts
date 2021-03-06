import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
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
import { SDGsService } from "@colabo-sdg/core";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
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

/**
 * @property `lastOnline`:Date - equal to `updatedAt`
 * @property `lastOnlineDiff`:number - difference between NOW() and `updatedAt` in miliseconds
 */
export class UserInsight {
  user: KNode = null;
  myColaboFlowState: MyColaboFlowStates;
  cwcs: KNode[];
  sdgs: number[];
  cardPlayedInRound1: KNode;
  cardPlayedInRound2: KNode;
  cardPlayedInRound3: KNode;
  whereIam: string;
  lastOnline: Date;
  lastOnlineDiff: number;

  constructor(
    user: KNode,
    myColaboFlowState: MyColaboFlowStates,
    cwcs: KNode[],
    sdgs: number[],
    cardPlayedInRound1: KNode,
    cardPlayedInRound2: KNode,
    cardPlayedInRound3: KNode,
    whereIam: string,
    lastOnline: Date,
    lastOnlineDiff: number
  ) {
    this.user = user;
    // if(!('dataContent' in this.user)){this.user.dataContent = {};}
    this.myColaboFlowState = myColaboFlowState;
    this.cwcs = cwcs;
    this.sdgs = sdgs;
    this.cardPlayedInRound1 = cardPlayedInRound1;
    this.cardPlayedInRound2 = cardPlayedInRound2;
    this.cardPlayedInRound3 = cardPlayedInRound3;
    this.whereIam = whereIam;
    this.lastOnline = lastOnline;
    this.lastOnlineDiff = lastOnlineDiff;
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
export class UserActionsStatusesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  loadingRegisteredUsers: boolean;
  autoRefreshUsers: number; //seconds between auto-refreshes; if `undefined` then no refreshing
  autoRefreshUsersInterval: NodeJS.Timeout;
  autoRefreshTimeLeft: number;
  loadingResourcesleft: number = 0;
  TOTAL_LOADING_RESOURCES: number = 5; //users' resources loading intitaited from `usersReceived` including the initial users loading as +1;

  public allColumns: string[] = [
    "id",
    "name",
    "status",
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
    "status",
    "group",
    "myColaboFlowState",
    "cwcs",
    "sdgs",
    //'cardPlayedInRound1', 'cardPlayedInRound2', 'cardPlayedInRound3',
    "actions"
  ]; //this.allColumns.slice(0);

  usersData: MatTableDataSource<UserInsight> = null; //any = [];//UserInsight[] = []; TODO

  constructor(
    // private knalledgeNodeService: KnalledgeNodeService,
    private sDGsService: SDGsService,
    private colaboFlowService: ColaboFlowService,
    private insightsService: InsightsService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar // , // private bottomSheet: MatBottomSheet
  ) {
    // console.log("[UserActionsStatusesComponent::constructor]");
  }

  ngOnInit() {
    // console.log("[UserActionsStatusesComponent::ngOnInit]");
    this.getRegisteredUsers();

    if (this.usersData !== null) {
      this.setUpSourceData();
    }
    //this.getCWCs();
  }

  ngOnDestroy() {
    // console.log("[UserActionsStatusesComponent::ngOnDestroy]");
    clearInterval(this.autoRefreshUsersInterval);
    //TODO: cancel all onoging HttpRequests
  }

  protected getRegisteredUsers(forceRefresh: boolean = false): void {
    this.loadingRegisteredUsers = true;
    this.loadingResourcesleft = this.TOTAL_LOADING_RESOURCES;
    this.insightsService
      .getRegisteredUsers(forceRefresh)
      .subscribe(this.usersReceived.bind(this));
  }

  autoRefreshUsersClicked(event: Event): void {
    event.stopPropagation();
  }

  /**
   * @description invoked by the ui selection change
   * @param event
   */
  public autoRefreshUsersChanged(event: Event): void {
    console.log(
      "[autoRefreshUsersChanged] this.autoRefreshUsers: ",
      this.autoRefreshUsers
    );
    this.invokeAutorefresh();
  }

  protected invokeAutorefresh(): void {
    clearInterval(this.autoRefreshUsersInterval);
    if (this.autoRefreshUsers > 0) {
      this.autoRefreshTimeLeft = this.autoRefreshUsers;
      this.autoRefreshUsersInterval = setInterval(() => {
        if (this.autoRefreshTimeLeft > 0) {
          this.autoRefreshTimeLeft -= 1;
        } else {
          console.log("invokeAutorefreshing");
          this.getRegisteredUsers(true);
          clearInterval(this.autoRefreshUsersInterval);
        }
      }, 1000);
    }
  }

  public refreshRegisteredUsers(event: Event): void {
    event.stopPropagation();
    clearInterval(this.autoRefreshUsersInterval); //pausing auto-refresh, when the manaual refresh is invoked. It will be continued in `resourceLoaded` when the loading is finished
    this.autoRefreshTimeLeft = 0; //to hide auto-refresh text when the manaual refresh is invoked
    this.getRegisteredUsers(true);
  }

  protected resourceLoaded(): void {
    this.loadingResourcesleft--;
    if (this.loadingResourcesleft <= 0) {
      this.loadingRegisteredUsers = false;
      if (this.autoRefreshUsers) {
        this.invokeAutorefresh();
      }
    }
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

  hasSDGs(us: UserInsight): boolean {
    //console.log('correctSDGNo')
    return us.sdgs.length > 0;
  }

  deleteSDGSelection(user: UserInsight): void {
    // let that: UserActionsStatusesComponent = this;
    let BottomShDgData: BottomShDgData = {
      title: "SDGs selections",
      message: "You want to delete " + user.name + "'s SDG selection?",
      btn1: "Yes",
      btn2: "No",
      callback: (btnOrder: number) =>
        this.deleteSDGsConfirmation(btnOrder, user)
    };
    let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(BottomShDg, {
      data: BottomShDgData
    }); //, disableClose: true
  }

  protected deleteSDGsConfirmation(btnOrder: number, user: UserInsight): void {
    if (btnOrder === 1) {
      this.sDGsService.deleteSDGSelection(user.id).subscribe(result => {
        if (result) {
          this.snackBar.open(user.name + "'s SDGs selection is deleted", "", {
            duration: 2000
          });
          // let user: UserInsight = this.usersData.data.filter(userInList => {
          //   return userInList.user._id === userId;
          // })[0];
          user.sdgs = [];
          this.setUpSourceData();
        } else {
          this.snackBar.open(
            "There was an ERROR in deleting SDGs selection",
            "",
            { duration: 5000 }
          );
        }
      });
    }
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
    this.resourceLoaded();
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

  clusterizeBySDGs(): void {
    let userDataInTab: UserInsight[] = null;
    let usrD: UserInsight;
    userDataInTab = this.usersData.data;

    let sdgClusterizingInput: any[] = [];
    // any = {
    //   "user_items": []
    // }
    for (var u: number = 0; u < userDataInTab.length; u++) {
      usrD = userDataInTab[u];
      if (usrD.sdgs && usrD.sdgs.length > 0) {
        for (var s: number = 0; s < usrD.sdgs.length; s++) {
          sdgClusterizingInput.push({
            userId: usrD.id,
            itemId: usrD.sdgs[s], //TODO: change to mongoID
            item: usrD.sdgs[s]
            // itemHId: i + 1 //TODO: should be here, but @Lazar wanted it at `item`
          });
        }
      }
    }
    console.log("sdgClusterizingInput", sdgClusterizingInput);
    console.log(
      "sdgClusterizingInput @ JSON",
      JSON.stringify(sdgClusterizingInput, null, 4)
    );
  }

  clusterizeByCWCs(): void {
    let userDataInTab: UserInsight[] = null;
    let usrD: UserInsight;
    userDataInTab = this.usersData.data;

    let cwcClusterizingInput: any[] = [];
    // any = {
    //   "user_items": []
    // }
    for (var u: number = 0; u < userDataInTab.length; u++) {
      usrD = userDataInTab[u];
      if (usrD.cwcs && usrD.cwcs.length > 0) {
        for (var s: number = 0; s < usrD.cwcs.length; s++) {
          cwcClusterizingInput.push({
            userId: usrD.id,
            itemId: usrD.cwcs[s]._id, //TODO: change to mongoID
            item: usrD.cwcs[s].name
            // itemHId: i + 1 //TODO: should be here, but @Lazar wanted it at `item`
          });
        }
      }
    }
    console.log("cwcClusterizingInput", cwcClusterizingInput);
    console.log(
      "cwcClusterizingInput @ JSON",
      JSON.stringify(cwcClusterizingInput, null, 4)
    );
  }

  getSDGSelections(): void {
    this.insightsService
      .getSDGSelections(false)
      .subscribe(this.sDGSelectionsReceived.bind(this));
  }

  sDGSelectionsReceived(sdgs: KEdge[]): void {
    console.log("sDGSelectionsReceived", sdgs);
    this.resourceLoaded();
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
    this.resourceLoaded();
    let userInsights = [];
    let usrId: string;
    let user: KNode;
    for (var i: number = 0; i < users.length; i++) {
      user = users[i];
      usrId = user._id;
      userInsights.push(
        new UserInsight(user, null, [], [], null, null, null, "N/A", null, NaN)
      );
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

  whereIsUser(user: UserInsight): string {
    return user.whereIam;
  }

  getMyCFStates(): void {
    this.insightsService
      .getMyCFStatesForAllUsers()
      .subscribe(this.myCFStatesForAllUsersReceived.bind(this));
  }

  lastOnline(user: UserInsight): string {
    let options: any = { day: "numeric", year: "numeric", month: "long" };
    let now: Date = new Date();
    let result: string = "N/A";
    const SECOND: number = 1000; // 1 0000 ms
    const MINUTE: number = 60 * 1000; // 60 0000 ms
    const HOUR: number = 60 * 60 * 1000;
    if (user.lastOnline) {
      if (user.lastOnlineDiff < 0) {
        result = "error";
      } else if (user.lastOnline.toDateString() !== now.toDateString()) {
        //if not today, display the day
        result = user.lastOnline.toLocaleDateString("en-GB");
      } else if (user.lastOnlineDiff >= HOUR) {
        //display the hours
        result = user.lastOnline.toLocaleTimeString("en-GB");
      } else if (user.lastOnlineDiff >= MINUTE) {
        // display how many minutes ago
        result = Math.round(user.lastOnlineDiff / 1000 / 60) + "m ago";
      } else if (user.lastOnlineDiff > 10 * SECOND) {
        // display how many seconds ago
        result = Math.round(user.lastOnlineDiff / 1000) + "s ago";
      } else {
        // if it's in last 10 seconds, we consider the user being ONLINE
        result = "online";
      }
    }
    return result;
  }

  tooltip(user: UserInsight): string {
    return "";
  }

  onlineIcon(user: UserInsight): string {
    let now: Date = new Date();
    let icon: string = "device_unknown"; //UNDEFINED_ICON;
    const OFF_TIME: number = 60 * 1000; // 60 0000 ms
    const AWAY_TIME: number = 20 * 1000; // 20 0000 ms
    if (user.lastOnlineDiff && user.lastOnlineDiff > 0) {
      if (user.lastOnlineDiff > OFF_TIME) {
        icon = "voice_over_off"; //OFFLINE_ICON
      } else if (user.lastOnlineDiff > AWAY_TIME) {
        icon = "schedule"; //AWAY_ICON
      } else {
        icon = "offline_pin"; //this is ONLINE sign actually
      }
    }
    return icon;
  }

  myCFStatesForAllUsersReceived(cfStateNodes: KNode[]): void {
    console.log("[myCFStatesForAllUsersReceived] cfStateNodes", cfStateNodes);
    this.resourceLoaded();

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
          usrD.whereIam = cfStateNodes[c].dataContent.MyColaboFlowState[
            "whereIam"
          ]
            ? (cfStateNodes[c].dataContent.MyColaboFlowState[
                "whereIam"
              ] as string)
            : "N/A";
          usrD.lastOnlineDiff = cfStateNodes[c].dataContent["lastOnlineDiff"];
          usrD.lastOnline = cfStateNodes[c].updatedAt;
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
    this.resourceLoaded();
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
