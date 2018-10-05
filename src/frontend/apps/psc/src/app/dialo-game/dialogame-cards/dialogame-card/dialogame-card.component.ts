import { Component, OnInit, Input, Output , OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';
import {DialoGameResponse} from '../../dialo-game-response/dialoGameResponse';

@Component({
  selector: 'dialogame-card',
  templateUrl: './dialogame-card.component.html',
  styleUrls: ['./dialogame-card.component.css']
})
export class DialogameCardComponent implements OnInit, OnChanges {
  @Input() cardData:KNode;
  @Input() response:DialoGameResponse = null;
  @Input() debugInfo:string='';
  //@Output()
  cardCreator:KNode;// = new KNode();

  userIconsPath:string = 'assets/images/user_icons/';

  constructor(
    private rimaAAAService: RimaAAAService
  ) { }

  ngOnInit() {
    console.log("cardData", this.cardData);
    if(this.cardData && (typeof this.cardData !== 'undefined') && 'iAmId' in this.cardData)
    {
      this.rimaAAAService.getUserById(this.cardData.iAmId).subscribe(this.userReceived.bind(this));
    }
    if(this.response === null){ //if the response is not set explicitelly we use the card's response
      if(((typeof this.cardData !== 'undefined')  && 'dataContent' in this.cardData) && ('dialoGameReponse' in this.cardData.dataContent)){ //
        this.response = new DialoGameResponse(this.rimaAAAService);
        if(typeof this.cardData.dataContent.dialoGameReponse !== 'undefined'){
          this.response.fill(this.cardData.dataContent.dialoGameReponse);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    let cardData: KNode = changes.cardData.currentValue as KNode;
    // console.log('prev value: ', cardData.previousValue);
    // console.log('got name: ', cardData.currentValue);
    if(cardData && (typeof cardData !== 'undefined') && 'iAmId' in cardData)
    {
      this.rimaAAAService.getUserById(cardData.iAmId).subscribe(this.userReceived.bind(this));
    }
    //this._name = name.currentValue.toUpperCase();
  }

  hasDecorators():boolean{
    if(this.response !== null && 'decorators' in this.response){
      let decorators:any[] = this.response.decorators;
      return decorators.length > 0;
    }
    return false;
  }

  getDecorators():any[]{
    if(this.response !== null && 'decorators' in this.response){
      let decorators:any[] = this.response.decorators;
      return decorators;
    }
    return [];
  }

  userReceived(user:KNode):void{
    this.cardCreator = user;
    console.log(user, user.name);
  }

  getUserName():string{
    return this.cardCreator ? this.cardCreator.name : 'anonymous';
  }

  getIconImg():string{
    //TODO:
    return 'performer.jpg';
  }

}
