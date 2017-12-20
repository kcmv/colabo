import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {KnalledgeSearchService} from '@colabo-knalledge/knalledge_search/knalledge-search.service';

@Component({
  selector: 'app-kn-search',
  templateUrl: './kn-search.component.html',
  styleUrls: ['./kn-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KnSearchComponent implements OnInit {

  public querySchema:string = "SELECT DISTINCT * WHERE {  ?class a owl:Class.  OPTIONAL { ?class rdfs:label ?label}  OPTIONAL { ?class rdfs:comment ?description}}";
  public attribute:string = 'gender';
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
    this.knalledgeSearchService.getSchemaBySparql(this.querySchema)
    .subscribe(map => this.sparqlReceived(map));
  }

  getDataBySparql():void{
    console.log('getDataBySparql');
    this.knalledgeSearchService.getDataBySparql()
    .subscribe(map => this.sparqlReceived(map));
  }

  getAttributeStatistics():void{
    console.log('getAttributeStatistics');
    this.knalledgeSearchService.getAttributeStatistics(this.attribute)
    .subscribe(map => this.sparqlReceived(map));
  }
}
