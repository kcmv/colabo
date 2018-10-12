import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {KnalledgeSearchService} from '@colabo-knalledge/f-search/knalledge-search.service';

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

  getSchemaBySparql():void{
    console.log('getSchemaBySparql');
    this.knalledgeSearchService.getSchemaBySparql()
    .subscribe(map => this.sparqlReceived(map));
  }

  getDataBySparql():void{
    console.log('getDataBySparql');
    this.knalledgeSearchService.getDataBySparql()
    .subscribe(map => this.sparqlReceived(map));
  }

}
