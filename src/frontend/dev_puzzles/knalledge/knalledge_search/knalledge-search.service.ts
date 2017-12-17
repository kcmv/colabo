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
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
    this.apiUrl = 'https://query.wikidata.org/sparql'; //CFService.serverAP + '/' + SearchAP + '/';
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
  getByName(name:string, callback?:Function): Observable<any[]>
  {
    console.log('KnalledgeSearchService::getByName('+name+')');
    let url: string = this.apiUrl;//+'by-name/'+name;

    let result:Observable<any[]> = this.http.get<any>(url);
      // .pipe(
        // map(SearchsFromServer => CFService.processVOs(SearchsFromServer, KSearch)),
        // catchError(this.handleError('KnalledgeSearchService::getByName', null))
      // );
    console.log('result:');
    console.log(result);
    //if(callback){result.subscribe(Searchs => callback(Searchs));}
    return result;
  }

}
