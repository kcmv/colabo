import { Component, OnInit } from '@angular/core';
import {DialoGameService} from '../dialo-game.service';
import {DialoGameResponse} from './dialoGameResponse';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {CardDecorator} from '../card-decorator//cardDecorator';

@Component({
  selector: 'dialo-game-response',
  templateUrl: './dialo-game-response.component.html',
  styleUrls: ['./dialo-game-response.component.css']
})
export class DialoGameResponseComponent implements OnInit {

  response:DialoGameResponse;
  constructor(
    private dialoGameService: DialoGameService
  ) { }

  ngOnInit() {
    this.response = this.dialoGameService.lastResponse;
    //responseCards[0]
  }

  getResponseCard():KNode{
    return this.response.responseCards[0];
  }

  getDecorators():CardDecorator[]{
    return this.response.decorators;
  }

}
