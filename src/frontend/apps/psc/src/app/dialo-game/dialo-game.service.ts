import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

export enum DialoGameActions{};

@Injectable({
  providedIn: 'root'
})
export class DialoGameService {

  myCards:KNode[] = [];
  //playedOn:[]; decorations:[];

  constructor() { }

  playCard(id:string):void{

  }
}
