/* CRUD Service for SearchVO paired with kSearch backend
 old NG2 pair: src/frontend/app/components/knalledgeSearch/js/services/knalledgeSearchService.js
 */

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
//import 'rxjs/add/operator/toPromise';

//import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from './cf.service';

const httpOptions = {
  /*
  https://www.w3.org/TR/sparql11-protocol/#query-operation
  Protocol clients may send protocol requests via the HTTP POST method by including the query directly and unencoded as the HTTP request message body. When using this approach, clients must include the SPARQL query string, unencoded, and nothing else as the message body of the request. Clients MUST set the content type header of the HTTP request to application/sparql-query. Clients may include the optional default-graph-uri and named-graph-uri parameters as HTTP query string parameters in the request URI. Note that UTF-8 is the only valid charset here.
  */
  headers: new HttpHeaders({ 'Content-Type':
  'application/sparql-query'
  //'application/x-www-form-urlencoded'
  //'application/sparql-results'
  //'application/json'
  //'application/sparql-results+json'
})
  //'application/json' })
};

const SearchAP = "search";

@Injectable()
export class KnalledgeSearchService //extends CFService
{

  //http://api.colabo.space/kSearchs/
  // "http://127.0.0.1:888/kSearchs/";
  private apiUrl: string;


	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
  ){
    //super();
    console.log('KnalledgeSearchService:constructor');
    //this.apiUrl = this.ENV.server.backend + '/' + SearchAP + '/';
    this.apiUrl = 'http://fdbsun1.cs.umu.se:3030/demo3models/query';
    //'https://query.wikidata.org/sparql'; //CFService.serverAP + '/' + SearchAP + '/';
  }


  /**
   * Gets all KN Searchs from the server that have a specific name
   * @param {string} name name of the Search
   * @param {function} callback Function to be called when the Search is retrieved
   * @returns {Observable<KSearch[]>} array of Searchs retreived (there could be multiple Searchs with the same name)
   * @example: curl --header "Accept: application/sparql-results+json"
   -G 'https://query.wikidata.org/sparql' --data-urlencode query='
   SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 25'

   */

  private rdfToKN(fromServer):any{
      console.log(fromServer);
      let fromServerJSON = JSON.parse(fromServer);
      for( let binding in fromServer.results.bindings){
        console.log(binding);
      }
      return "TODO";
  }

  getBySparql(): Observable<any[]>
  {
    console.log('KnalledgeSearchService::getByName('+name+')');
    let url: string = this.apiUrl;//+'by-name/'+name;
    let query:string = 'SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 100';
    let result:Observable<any[]> =  this.http.post<any>(url, query, httpOptions)
      .pipe(
        map( fromServer => this.rdfToKN(fromServer) )
        // catchError(this.handleError('KnalledgeSearchService::getByName', null))
      );
    console.log('result:');
    console.log(result);
    //if(callback){result.subscribe(Searchs => callback(Searchs));}
    return result;
  }

}
