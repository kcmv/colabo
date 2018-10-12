import { Component, OnInit } from '@angular/core';
import {SimilarityService} from './similarity.service';

@Component({
  selector: 'similarity',
  templateUrl: './similarity.component.html',
  styleUrls: ['./similarity.component.css']
})
export class SimilarityComponent implements OnInit {

  constructor(
    private similarityService:SimilarityService
  ) { }

  ngOnInit() {
  }

  requestSimilaritySuggestions():void{
    this.similarityService.sendRequestForSimilarityCalc();
  }

}
