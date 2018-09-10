import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import { Observable, of } from 'rxjs';

export enum DialoGameActions{};

@Injectable({
  providedIn: 'root'
})
export class DialoGameService {

  myCards:KNode[] = [];
  //playedOn:[]; decorations:[];

  constructor(
    knalledgeNodeService: KnalledgeNodeService
  ) { }

  playCard(id:string):void{

  }

  getOpeningCards():Observable<KNode[]>{
    let cards:KNode[] = [];
    let card:KNode;
    for(var i:number = 0; i<17;i++){
      card = new KNode();
      card.name = "How the future looks when this goal is fulfilled?";
      if(card.dataContent === null){ card.dataContent = {};}
      card.dataContent.img = "assets/images/sdgs/s/sdg" + (i+1) + '.jpg';
      cards.push(card);
    }
    console.log('getOpeningCards', cards);
    return of(cards);
  }
}
