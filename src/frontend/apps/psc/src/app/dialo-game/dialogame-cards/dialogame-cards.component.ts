import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'dialogame-cards',
  templateUrl: './dialogame-cards.component.html',
  styleUrls: ['./dialogame-cards.component.css']
})
export class DialogameCardsComponent implements OnInit {

  cards:any[] = [];

  constructor(
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.cards = [
      {_id:'5b8bf3f23663ad0d5425e878', name:'sun is always here', iAmId: '5b8bf3f23663ad0d5425e86d'},
      {_id:'5b8bf3f23663ad0d5425e879', name:'girls are playing in the garden', iAmId: '5b812567a7a78a1ba15ba0d8'},
      {_id:'5b8bf3f23663ad0d5425e87A', name:'love is here', iAmId: '5b8bf3f23663ad0d5425e86d'}];
  }

  onClick(event:any, id:string):void {
    console.log("onClicked",event, id);
    this.openSnackBar("You've selected the challenge card.","Now choose your response card!");
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
