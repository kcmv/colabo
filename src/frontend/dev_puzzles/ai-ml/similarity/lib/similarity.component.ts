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

  deleteAllSuggestions():void{
    if(confirm("Do you really want to delete all Similarity SUggestions?")){
      this.similarityService.deleteAllSuggestions().subscribe(function(){
        window.alert('Deleting finished');
      });
    }
  }

  similarityRequestsSentNo():number{
    return this.similarityService.similarityRequestsSentNo;
  }

  similarityRequestsReceivedNo():number{
    return this.similarityService.similarityRequestsReceivedNo;
  }

  requestSimilaritySuggestions():void{
    this.similarityService.sendRequestForSimilarityCalc();
  }

}
