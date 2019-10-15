import { Injectable } from "@angular/core";
// import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
// import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';

import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { ColaboFlowService } from "@colabo-flow/f-core";
import { KnalledgeNodeService } from "@colabo-knalledge/f-store_core/knalledge-node.service";
import { KnalledgeEdgeService } from "@colabo-knalledge/f-store_core/knalledge-edge.service";
// import {KnalledgeSearchService} from '@colabo-knalledge/f-search';
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";
import { KEdge } from "@colabo-knalledge/f-core/code/knalledge/kEdge";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import * as config from "@colabo-utils/i-config";

const SDG_SELECTION_TYPE: string = "rima.selected_UN_SDG"; //TODO, to use from the SDGService (when it's exported to a puzzle)

@Injectable({
  providedIn: "root"
})
export class InsightsService {
  static mapId = config.GetGeneral("mapId");

  //TODO: migrate to SDGService:
  static SDGS_NO: number = 17;
  static CWCS_REQUIRED: number = 3; //5;
  static SDGS_REQUIRED: number = 3;
  static SDG_NAMES: string[] = [
    "1. NO POVERTY",
    "2. ZERO HUNGER",
    "3. GOOD HEALTH AND WELL-BEING",
    "4. QUALITY EDUCATION",
    "5. GENDER EQUALITY",
    "6. CLEAN WATER AND SANITATION",
    "7. AFFORDABLE AND CLEAN ENERGY",
    "8. DECENT WORK AND ECONOMIC GROWTH",
    "9. INDUSTRY, INNOVATION AND INFRASTRUCTURE",
    "10. REDUCED INEQUALITY",
    "11. SUSTAINABLE CITIES AND COMMUNITIES",
    "12. RESPONSIBLE CONSUMPTION AND PRODUCTION",
    "13. CLIMATE ACTION",
    "14. LIFE BELOW WATER",
    "15. LIFE ON LAND",
    "16. PEACE AND JUSTICE STRONG INSTITUTIONS",
    "17. PARTNERSHIPS TO ACHIEVE THE GOAL"
  ];

  static TOPICHAT_MSG_TYPE: string = "topiChat.talk.chatMsg";
  cardsPlayed: KNode[][] = new Array<Array<KNode>>(); //first dimension are rounds, second are all cards in that round
  protected getCardsPlayedInitiated: boolean;
  registeredUsers: KNode[] = [];
  myCfStates: KNode[] = [];
  cwcs: KNode[] = [];
  selectedSDGs: KEdge[] = [];
  protected getRegisteredUsersInitiated: boolean;

  constructor(
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private colaboFlowService: ColaboFlowService,
    private rimaAAAService: RimaAAAService
  ) {}

  getRegisteredUsers(forceRefresh: boolean = false): Observable<KNode[]> {
    let result: Observable<KNode[]>;

    if (forceRefresh || !this.getRegisteredUsersInitiated) {
      this.getRegisteredUsersInitiated = true;
      result = this.rimaAAAService
        .getRegisteredUsers(InsightsService.mapId)
        .pipe(
          tap(nodesFromServer => this.assignRegisteredUsers(nodesFromServer))
        );
      return result;
    } else {
      return of(this.registeredUsers);
    }
  }

  assignRegisteredUsers(users: any): void {
    console.log("assignRegisteredUsers", users);
    this.registeredUsers = users;
  }

  getCWCs(forceRefresh: boolean = true): Observable<KNode[]> {
    let result: Observable<KNode[]>;

    if (forceRefresh || this.cwcs.length == 0) {
      result = this.knalledgeNodeService
        .queryInMapofType(
          InsightsService.mapId,
          InsightsService.TOPICHAT_MSG_TYPE
        )
        .pipe(tap(nodesFromServer => this.assignCWCs(nodesFromServer)));
      return result;
    } else {
      return of(this.cwcs);
    }
  }

  assignCWCs(cwcs: any): void {
    this.cwcs = cwcs;
  }

  getSDGSelections(forceRefresh: boolean = true): Observable<KEdge[]> {
    let result: Observable<KEdge[]>;

    if (forceRefresh || this.selectedSDGs.length == 0) {
      result = this.knalledgeEdgeService
        .queryForMapTypeUserWTargetNodes(
          InsightsService.mapId,
          SDG_SELECTION_TYPE
        )
        .pipe(tap(edgesFromServer => this.assignSDGs(edgesFromServer)));
      return result;
    } else {
      return of(this.selectedSDGs);
    }
  }

  assignSDGs(sdgs: any): void {
    this.selectedSDGs = sdgs;
  }

  getCardsPlayed(forceRefresh: boolean = true): Observable<any> {
    let result: Observable<KNode[]>;

    if (forceRefresh || !this.getCardsPlayedInitiated) {
      this.getCardsPlayedInitiated = true;
      result = this.knalledgeNodeService
        .queryInMapofType(
          InsightsService.mapId,
          InsightsService.TOPICHAT_MSG_TYPE
        )
        .pipe(tap(nodesFromServer => this.assignCardsPlayed(nodesFromServer)));
      return result;
    } else {
      return of(this.cardsPlayed);
    }
  }

  getCardsPlayedInTheRound(
    round: number,
    forceRefresh: boolean = false
  ): Observable<KNode[]> {
    let result: Observable<KNode[]>;

    if (
      forceRefresh ||
      this.cardsPlayed.length == 0 ||
      typeof this.cardsPlayed[round] === "undefined" ||
      this.cardsPlayed[round].length == 0
    ) {
      result = this.knalledgeNodeService
        .queryInMapofTypeAndContentData(
          InsightsService.mapId,
          InsightsService.TOPICHAT_MSG_TYPE,
          "dialoGameReponse.playRound",
          round
        )
        .pipe(
          tap(nodesFromServer =>
            this.assignCardsPlayedInTheRound(round, nodesFromServer)
          )
        );
      return result;
    } else {
      if (typeof this.cardsPlayed[round] === "undefined") {
        this.cardsPlayed[round] = [];
      }
      return of(this.cardsPlayed[round]);
    }
  }

  getMyCFStatesForAllUsers(forceRefresh: boolean = true): Observable<KNode[]> {
    let result: Observable<KNode[]>;

    if (forceRefresh || this.myCfStates.length == 0) {
      result = this.knalledgeNodeService
        .queryInMapofType(
          ColaboFlowService.mapId,
          ColaboFlowService.MY_COLABO_FLOW_STATE_TYPE
        )
        .pipe(
          tap(nodesFromServer =>
            this.assignMyCFStatesForAllUsers(nodesFromServer)
          )
        );
      return result;
    } else {
      return of(this.myCfStates);
    }
  }

  assignMyCFStatesForAllUsers(cfStateNodes: KNode[]): void {
    this.myCfStates = cfStateNodes;
  }

  /*
    be aware that this method will reaturn false also in the case when users are not loaded yet
  */
  hasUserPlayedInTheRound(userId: string, round: number): boolean {
    if (typeof this.cardsPlayed[round] === "undefined") {
      return false;
    }

    for (var i: number = 0; i < this.cardsPlayed[round].length; i++) {
      if (this.cardsPlayed[round][i].iAmId == userId) {
        return true;
      }
    }
    return false;
  }

  isCwcPlayed(cwc: KNode): boolean {
    return (
      "dataContent" in cwc &&
      "dialoGameReponse" in cwc.dataContent &&
      "playRound" in cwc.dataContent.dialoGameReponse
    );
  }

  roundPlayed(cwc: KNode): number {
    return "dataContent" in cwc &&
      "dialoGameReponse" in cwc.dataContent &&
      "playRound" in cwc.dataContent.dialoGameReponse
      ? cwc.dataContent.dialoGameReponse.playRound
      : null;
  }

  cardHumanIdPlayedInTheRound(userId: string, round: number): KNode {
    if (typeof this.cardsPlayed[round] === "undefined") {
      return null;
    }

    for (var i: number = 0; i < this.cardsPlayed[round].length; i++) {
      if (this.cardsPlayed[round][i].iAmId == userId) {
        return "dataContent" in this.cardsPlayed[round][i]
          ? this.cardsPlayed[round][i]
          : null;
      }
    }
    return null;
  }

  assignCardsPlayedInTheRound(round: number, cards: any): void {
    console.log("assignCardsPlayedInTheCurrentRound", round, cards);
    if (typeof this.cardsPlayed[round] === "undefined") {
      this.cardsPlayed[round] = [];
    }
    this.cardsPlayed[round] = cards;
  }

  assignCardsPlayed(cardsN: any): void {
    let cards: KNode[] = cardsN as KNode[];
    console.log("assignCardsPlayed", cards);
    let round: number;
    for (var i: number = 0; i < cards.length; i++) {
      if ("dialoGameReponse" in cards[i].dataContent) {
        round = cards[i].dataContent.dialoGameReponse.playRound;
        if (typeof this.cardsPlayed[round] === "undefined") {
          this.cardsPlayed[round] = [];
        }
        this.cardsPlayed[round].push(cards[i]);
      }
    }
  }
}
