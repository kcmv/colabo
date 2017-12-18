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

  sparqlReceived(map:any):void{
    console.log(map.toString());
  }

  getBySparql():void{
    console.log('getBySparql');
    this.knalledgeSearchService.getBySparql()
    .subscribe(map => this.sparqlReceived(map));
  }

}
