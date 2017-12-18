/* CRUD Service for SearchVO paired with kSearch backend
 old NG2 pair: src/frontend/app/components/knalledgeSearch/js/services/knalledgeSearchService.js
 */

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
//import 'rxjs/add/operator/toPromise';

//import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from '@colabo-knalledge/knalledge_store_core/cf.service';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

const httpOptions = {
  /*
  https://www.w3.org/TR/sparql11-protocol/#query-operation
  Protocol clients may send protocol requests via the HTTP POST method by including the query directly and unencoded as the HTTP request message body. When using this approach, clients must include the SPARQL query string, unencoded, and nothing else as the message body of the request. Clients MUST set the content type header of the HTTP request to application/sparql-query. Clients may include the optional default-graph-uri and named-graph-uri parameters as HTTP query string parameters in the request URI. Note that UTF-8 is the only valid charset here.
  */
  headers: new HttpHeaders({ 'Content-Type':
  'application/sparql-query',
  'Accept': 'application/sparql-results+json'
  //'application/x-www-form-urlencoded'
  //'application/sparql-results'
  //'application/json'
  //'application/sparql-results+json'
})
  //'application/json' })
};

const SearchAP = "search";

@Injectable()
export class KnalledgeSearchService extends CFService
{

  //http://api.colabo.space/kSearchs/
  // "http://127.0.0.1:888/kSearchs/";
  private apiUrl: string;


	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
  ){
    super();
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
    //TODO: to add safe-failing (if there is no result, no parameter, etc)
     //TODO: check if we do fill mapData in a OK format CF (KN) - as required by visualization code
      let mapData:any = {
        'selectedNode':null,
        'map': {
          'nodes':[], 'edges':[], 'properties':new KMap()
        }
      };
      //let map:KMap = new KMap();
      // map.name = 'Personalities';
      let mapId:string = mapData.map.properties._id;
      mapData.map.properties.name = 'Personalities';
      let rootNode:KNode = new KNode();
      rootNode.name = 'Personalities';
      rootNode.mapId = mapId;
      mapData.map.nodes.push(rootNode);
      mapData.selectedNode = rootNode;
      //let edges:
      let personalities:any = {};
      console.log(fromServer.results.bindings.length);
      //let fromServerJSON = JSON.parse(fromServer);

      /*
        in this for-loop we fill hasf of Personalities Objects that is indexed by their 'UserId'
        with all found properties added to objects
      */
      for( let i in fromServer.results.bindings){
      let binding:any = fromServer.results.bindings[i];
        console.log(binding);
        let id:string = binding.subject.value.substring(binding.subject.value.lastIndexOf("/") + 1);
        if(!(id in personalities)){
          personalities[id] = {};
        }
        let predicate:string = binding.predicate.value.substring(binding.predicate.value.lastIndexOf("/") + 1);
        personalities[id][predicate] = binding.object.value.substring(binding.object.value.lastIndexOf("/") + 1);
      }

      for(let id in personalities){
        let nodePerson:KNode = new KNode();
        nodePerson.name = id;
        nodePerson.mapId = mapId;
        mapData.map.nodes.push(nodePerson);
        let edgePerson:KEdge = new KEdge();
        edgePerson.mapId = mapId;
        edgePerson.sourceId = rootNode._id;
        edgePerson.targetId = nodePerson._id;
        mapData.map.edges.push(edgePerson);
        //TODO: to see if we want to set here: `edge.name = `
        for(let key in personalities[id]){
          //ommitting unwanted values:
          if(key === 'userid'){continue;} //TODO: check if we want to ommit it
          /* TODO:
          should we also do:
          `if(key === '22-rdf-syntax-ns#type'){continue;}`
          that is, we should see how to treat `type` predicate:
          {
            "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
            "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
            "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
          } ,
          */
          let nodeProperty:KNode = new KNode();
          nodeProperty.name = personalities[id][key];
          nodeProperty.mapId = mapId;
          mapData.map.nodes.push(nodeProperty);

          let edgeProperty:KEdge = new KEdge();
          edgeProperty.mapId = mapId;
          edgeProperty.sourceId = nodePerson._id;
          edgeProperty.targetId = nodeProperty._id;
          edgeProperty.name = key;
          mapData.map.edges.push(edgeProperty);
        }
      }

      return mapData;
  }

  getBySparql(): Observable<any>
  {
    console.log('KnalledgeSearchService::getByName('+name+')');
    let url: string = this.apiUrl;//+'by-name/'+name;
    // TODO 'LIMIT 100';
    let query:string = 'SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 5';
    let result:Observable<any> =  this.http.post<any>(url, query, httpOptions)
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
