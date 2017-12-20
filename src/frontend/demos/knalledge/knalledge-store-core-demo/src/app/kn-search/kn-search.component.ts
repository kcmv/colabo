import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {KnalledgeSearchService} from '@colabo-knalledge/knalledge_search/knalledge-search.service';

@Component({
  selector: 'app-kn-search',
  templateUrl: './kn-search.component.html',
  styleUrls: ['./kn-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KnSearchComponent implements OnInit {

  public queryDemo:string = "SELECT DISTINCT * WHERE {  ?class a owl:Class.  OPTIONAL { ?class rdfs:label ?label}  OPTIONAL { ?class rdfs:comment ?description}}";
  public attribute:string = 'gender';
  constructor(
    private knalledgeSearchService: KnalledgeSearchService
  ) { }

  ngOnInit() {
  }

  sparqlReceived(map:any):void{
    console.log(map.toString());
  }

  doDemoSparql():void{
    this.knalledgeSearchService.demoSparql(this.queryDemo)
    .subscribe(map => this.sparqlReceived(map));
  }

  getSchemaBySparql():void{
    console.log('getSchemaBySparql');
    //TODO: add a checkbox for fillStatistics parameter
    this.knalledgeSearchService.getSchemaBySparql(true)
    .subscribe(map => this.sparqlReceived(map));
  }

  getDataBySparql():void{
    console.log('getDataBySparql');
    this.knalledgeSearchService.getDataBySparql()
    .subscribe(map => this.sparqlReceived(map));
  }

  /*
    if we provide the `gender` parameter, we will get statistics filtered by that gender value
  */
  getAttributeStatistics(gender:number=null):void{
    console.log('getAttributeStatistics');
    this.knalledgeSearchService.getAttributeStatistics(this.attribute, (gender!==null ? 'gender' : null),gender)
    .subscribe(map => this.sparqlReceived(map));
  }
}
