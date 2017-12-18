import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {KnalledgeSearchService} from '@colabo-knalledge/knalledge_search/knalledge-search.service';

@Component({
  selector: 'app-kn-search',
  templateUrl: './kn-search.component.html',
  styleUrls: ['./kn-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KnSearchComponent implements OnInit {

  constructor(
    private knalledgeSearchService: KnalledgeSearchService
  ) { }

  ngOnInit() {
  }

  sparqlReceived():void{

  }

  getBySparql():void{
    console.log('getBySparql');
    this.knalledgeSearchService.getBySparql()
    .subscribe(this.sparqlReceived);
  }

}
