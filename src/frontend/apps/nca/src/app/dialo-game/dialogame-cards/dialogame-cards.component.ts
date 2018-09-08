import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dialogame-cards',
  templateUrl: './dialogame-cards.component.html',
  styleUrls: ['./dialogame-cards.component.css']
})
export class DialogameCardsComponent implements OnInit {

  cards:any[] = [];

  constructor() { }

  ngOnInit() {
    this.cards = [{name:'sun is there always'}, {name:'girls playing in the garden'}, {name:'love is here'}];
  }

}
