/* CRUD Service for SearchVO paired with kSearch backend
 old NG2 pair: src/frontend/app/components/knalledgeSearch/js/services/knalledgeSearchService.js
 */
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
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

// http://blog.rangle.io/configurable-services-in-angular-2/
export function provideKnalledgeSearchService(apiUrl){
  return {
    provide: KnalledgeSearchService,
    useFactory: (http: HttpClient) => new KnalledgeSearchService(apiUrl, http),
    deps: [HttpClient]
  }
}

@Injectable()
export class KnalledgeSearchService extends CFService
{
	constructor(
    private apiUrl:string,
    private http: HttpClient
    //@Inject('ENV') private ENV
  ){
    super();
    console.log('KnalledgeSearchService:constructor');
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
  private rdfDataToKN(fromServer:any):any{
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
      let mapId:string = mapData.properties._id;
      mapData.properties.name = 'Personalities';
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

  /**
  * @returns {any} mapData, where in `map.nodes array` each sub-node of the rootNode is representing each class received (with node.name = class_name). Each sub-node of the class-node represents received label of that class (with node.name = label_name).
  */

  private rdfSchemaToKN(fromServer:any, fillStatistics:boolean):any{
    //TODO: to add safe-failing (if there is no result, no parameter, etc)
    //TODO: check if we do fill mapData in a OK format CF (KN) - as required by visualization code

    var attributeForStatistics:string = 'gender';
    var nodeForStatistics:KNode = null;
    var fillingNamesTranslation:any = {'1':'Male','0':'Female','-1':'undef'}; //TODO: check real values
    var mapData:any = {
      'selectedNode':null,
      'map': {
        'nodes':[], 'edges':[]
      },
      'properties':new KMap()
    };

    var blackList = [
      // myPersonality
      'cNEU', 'cCON', 'sEXT', 'cEXT', 'cAGR', 'sOPN', 'cOPN', 'sCON', 'sAGR', 'sNEU',
      // Demographic
      'mf_random', 'mf_whatever', 'mf_networking', 'mf_relationship', 'mf_friendship', 'mf_dating'];

    //let map:KMap = new KMap();
    // map.name = 'Personalities';
    var mapId:string = mapData.properties._id;

    function fillingStatistics(statistics):void{
      console.log('fillingStatistics');
      // gender: [
      //   {value: '-1', count: 150},
      let count:number = 0; //total count for percentage
      for(let i:number=0; i<statistics[attributeForStatistics].length; i++){
        count += parseInt(statistics[attributeForStatistics][i].count);
      }

      for(let i:number=0;i<statistics[attributeForStatistics].length;i++){
        //nodeLabel is named by the `label`
        let nodeStatVal:KNode = new KNode();
        nodeStatVal.name = fillingNamesTranslation[statistics[attributeForStatistics][i].value] + ' (' + Math.round(100 * parseInt(statistics[attributeForStatistics][i].count) / count) + '%)';
        nodeStatVal.mapId = mapId;
        mapData.map.nodes.push(nodeStatVal);

        //edgeStatVal connects nodeStatVal with the nodeForStatistics which percentage it represents
        let edgeStatVal:KEdge = new KEdge();
        edgeStatVal.mapId = mapId;
        edgeStatVal.sourceId = nodeForStatistics._id;
        edgeStatVal.targetId = nodeStatVal._id;
        //edgeStatVal.name = key;
        mapData.map.edges.push(edgeStatVal);
      }
      console.log('finished `fillingStatistics`');
    }

    mapData.properties.name = 'Classes';
    let rootNode:KNode = new KNode();
    rootNode.name = 'Classes';
    rootNode.mapId = mapId;
    rootNode.visual = {isOpen: true};
    mapData.map.nodes.push(rootNode);
    mapData.selectedNode = rootNode;

    mapData.properties.rootNodeId = mapData.selectedNode._id;
    mapData.properties.type = "cf";
    mapData.properties.participants = [];
    mapData.properties.dataContent = {
      "mcm":{"authors":"S.Rudan"}
    };
    mapData.properties.visual = {};
    mapData.properties.state = "STATE_SYNCED";

    //let edges:
    let classes:any = {};

    classes['myPersonality'] = {};
    classes['myPersonality']['ExtrovertScore'] = -1;
    classes['myPersonality']['IntrovertScore'] = -1;
    classes['myPersonality']['Agreeableness_Score'] = -1;
    classes['myPersonality']['Age'] = -1;

    classes['fbPhotos'] = {};
    classes['fbPhotos']['Locale'] = -1;
    classes['fbPhotos']['User_Topic_Membership'] = -1;
    classes['fbPhotos']['User_Group_Diads'] = -1;
    classes['fbPhotos']['Like_Id'] = -1;
    console.log(fromServer.results.bindings.length);
    //let fromServerJSON = JSON.parse(fromServer);

    /*
      in this for-loop we fill hasf of Personalities Objects that is indexed by their 'UserId'
      with all found properties added to objects
    */
    for( let i in fromServer.results.bindings){
      let binding:any = fromServer.results.bindings[i];
      //console.log(binding);
      let cls:string = binding.class.value.substring(binding.class.value.lastIndexOf("/") + 1);
      if(!(cls in classes)){
        classes[cls] = {};
      }
      let label:string = binding.label.value.substring(binding.label.value.lastIndexOf("/") + 1);
      if(blackList.indexOf(label) >= 0) continue;
      classes[cls][label] = 1;
    }

    for(let id in classes){
      //nodeClass is named by the `class` it represents
      let nodeClass:KNode = new KNode();
      nodeClass.name = id;
      nodeClass.mapId = mapId;
      mapData.map.nodes.push(nodeClass);

      //edgeClass connects nodeClass with the rootNode
      let edgeClass:KEdge = new KEdge();
      edgeClass.mapId = mapId;
      edgeClass.sourceId = rootNode._id;
      edgeClass.targetId = nodeClass._id;
      mapData.map.edges.push(edgeClass);
      //TODO: to see if we want to set here: `edge.name = `
      for(let key in classes[id]){
        /* TODO: eventual ommitting unwanted values, like this:
        if(key === 'userid'){continue;} //TODO: check if we want to ommit it
        */

        //nodeLabel is named by the `label`
        let nodeLabel:KNode = new KNode();
        nodeLabel.name = key;
        nodeLabel.mapId = mapId;
        mapData.map.nodes.push(nodeLabel);

        if(fillStatistics && key === attributeForStatistics){
          nodeForStatistics = nodeLabel;
        }

        //edgeLabel connects nodeLabel with the nodeClass it belongs to
        let edgeLabel:KEdge = new KEdge();
        edgeLabel.mapId = mapId;
        edgeLabel.sourceId = nodeClass._id;
        edgeLabel.targetId = nodeLabel._id;
        //edgeLabel.name = key;
        mapData.map.edges.push(edgeLabel);
      }
    }

    if(fillStatistics && nodeForStatistics !== null){

      //workaround before serialization of Observeables:
      let statistics:any = {'gender': [
        {value: "1", count: "135814"},
        {value: "0", count: "74272"},
        {value: "-1", count: "4057"}
      ]};
      fillingStatistics(statistics);
      console.log('after call to `fillingStatistics`');


      /*TODO: do it like this when serialization of Observeables is done:
        this.getAttributeStatistics(attributeForStatistics)
        .subscribe(statistics => fillingStatistics(statistics));
      */
    }

    return mapData;
  }

  /**
   * Gets all statistics for the specified attribute
   * @param {any} fromServer RDF response from the server
   * @example fromServer:
   "results": {
      "bindings": [
      {
       "attribute": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" } ,
       ".1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "value": "135814" }
      } ,
      {
       "attribute": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" } ,
       ".1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "value": "74272" }
      } ,
   * @param {string} attribute name of the attribute which statistics we work on
   * @returns {any}
   * @example result:
         {
           gender: [
             {value: '-1', count: 150},
             {value: '0', count: 110},
             {value: '1', count: 230},
           ]
         }
   */
  rdfStatisticsToKN(fromServer:any, attribute:string):any{
    let statistics:any = {};
    statistics[attribute] = [];
    console.log('fromServer.results.bindings.length:'+fromServer.results.bindings.length);
    //let fromServerJSON = JSON.parse(fromServer);

    /*
      in this for-loop we fill hasf of Personalities Objects that is indexed by their 'UserId'
      with all found properties added to objects
    */
    for( let i in fromServer.results.bindings){
      let binding:any = fromServer.results.bindings[i];
      //console.log(binding);
      let value:string = binding.attribute.value;
      let count:string = binding[".1"].value;
      statistics[attribute].push({'value':value, 'count':count});
    }
    return statistics;
  }

  /**
   * Gets all statistics for the specified attribute
   * @param {string} attribute name of the attribute we want to get statistics for (e.g. 'age' or 'gender')
   * @param {string} filterAtr name of the attribute by which we want to filter statistics (e.g. 'age' or 'gender')
   * @param {string} filterVal value for which we check `filterAtr` and return only rows that have `filterAtr` equal to filterVal (e.g. for 'gender' we would provide here 1 or 0)
   * @param {number} limit if <=0, than unlimiteed
   * @returns {Observable<any>} For the form of the result check the `rdfStatisticsToKN` method
   */
  getAttributeStatistics(attribute:string, filterAtr:string = null, filterVal:number = null, limit:number = 100):Observable<any>
  {
    // {'1':'Male','0':'Female','-1':'undef'}
    var ageForAll =
    {"age":[{"value":"-1","count":"135799"},{"value":"22","count":"7665"},{"value":"21","count":"7089"},{"value":"20","count":"6479"},{"value":"23","count":"6031"},{"value":"19","count":"5304"},{"value":"24","count":"5135"},{"value":"25","count":"4306"},{"value":"26","count":"3675"},{"value":"18","count":"3545"},{"value":"27","count":"3244"},{"value":"28","count":"2721"},{"value":"29","count":"2408"},{"value":"30","count":"1996"},{"value":"17","count":"1893"},{"value":"31","count":"1773"},{"value":"32","count":"1649"},{"value":"33","count":"1293"},{"value":"34","count":"1073"},{"value":"35","count":"968"},{"value":"36","count":"845"},{"value":"37","count":"788"},{"value":"42","count":"742"},{"value":"38","count":"704"},{"value":"40","count":"623"},{"value":"39","count":"614"},{"value":"41","count":"600"},{"value":"16","count":"568"},{"value":"43","count":"470"},{"value":"44","count":"408"},{"value":"45","count":"400"},{"value":"46","count":"317"},{"value":"47","count":"298"},{"value":"48","count":"297"},{"value":"49","count":"267"},{"value":"50","count":"241"},{"value":"51","count":"208"},{"value":"52","count":"193"},{"value":"53","count":"170"},{"value":"54","count":"130"},{"value":"55","count":"121"},{"value":"56","count":"107"},{"value":"57","count":"90"},{"value":"58","count":"87"},{"value":"15","count":"64"},{"value":"59","count":"57"},{"value":"60","count":"55"},{"value":"62","count":"53"},{"value":"61","count":"48"},{"value":"63","count":"37"},{"value":"64","count":"32"},{"value":"67","count":"26"},{"value":"103","count":"25"},{"value":"65","count":"24"},{"value":"66","count":"24"},{"value":"102","count":"23"},{"value":"72","count":"17"},{"value":"100","count":"15"},{"value":"69","count":"15"},{"value":"74","count":"15"},{"value":"101","count":"14"},{"value":"107","count":"14"},{"value":"99","count":"14"},{"value":"82","count":"13"},{"value":"68","count":"12"},{"value":"104","count":"11"},{"value":"70","count":"10"},{"value":"92","count":"10"},{"value":"95","count":"10"},{"value":"110","count":"9"},{"value":"71","count":"9"},{"value":"73","count":"9"},{"value":"109","count":"8"},{"value":"93","count":"8"},{"value":"14","count":"7"},{"value":"2","count":"7"},{"value":"75","count":"7"},{"value":"97","count":"7"},{"value":"112","count":"6"},{"value":"83","count":"6"},{"value":"84","count":"6"},{"value":"85","count":"6"},{"value":"91","count":"6"},{"value":"96","count":"6"},{"value":"98","count":"6"},{"value":"76","count":"5"},{"value":"78","count":"5"},{"value":"81","count":"5"},{"value":"89","count":"5"},{"value":"105","count":"4"},{"value":"106","count":"4"},{"value":"111","count":"4"},{"value":"79","count":"4"},{"value":"80","count":"4"},{"value":"94","count":"4"},{"value":"87","count":"3"},{"value":"90","count":"3"},{"value":"108","count":"2"},{"value":"77","count":"2"},{"value":"86","count":"2"}]};

    var ageForFemale =
    {"age":[{"value":"-1","count":"43665"},{"value":"22","count":"3269"},{"value":"21","count":"2945"},{"value":"20","count":"2682"},{"value":"23","count":"2525"},{"value":"24","count":"2123"},{"value":"19","count":"2103"},{"value":"25","count":"1752"},{"value":"26","count":"1389"},{"value":"18","count":"1370"},{"value":"27","count":"1275"},{"value":"28","count":"1012"},{"value":"29","count":"881"},{"value":"30","count":"729"},{"value":"17","count":"719"},{"value":"31","count":"613"},{"value":"32","count":"597"},{"value":"33","count":"477"},{"value":"34","count":"370"},{"value":"35","count":"341"},{"value":"36","count":"299"},{"value":"37","count":"297"},{"value":"42","count":"266"},{"value":"38","count":"230"},{"value":"41","count":"208"},{"value":"16","count":"204"},{"value":"40","count":"199"},{"value":"39","count":"198"},{"value":"43","count":"170"},{"value":"44","count":"136"},{"value":"45","count":"125"},{"value":"46","count":"99"},{"value":"48","count":"99"},{"value":"47","count":"98"},{"value":"49","count":"85"},{"value":"50","count":"75"},{"value":"53","count":"60"},{"value":"51","count":"59"},{"value":"52","count":"57"},{"value":"54","count":"43"},{"value":"56","count":"41"},{"value":"55","count":"37"},{"value":"57","count":"30"},{"value":"58","count":"26"},{"value":"60","count":"24"},{"value":"15","count":"22"},{"value":"59","count":"16"},{"value":"102","count":"13"},{"value":"61","count":"13"},{"value":"62","count":"13"},{"value":"103","count":"12"},{"value":"63","count":"12"},{"value":"64","count":"11"},{"value":"66","count":"10"},{"value":"65","count":"8"},{"value":"67","count":"7"},{"value":"68","count":"7"},{"value":"82","count":"7"},{"value":"100","count":"6"},{"value":"101","count":"6"},{"value":"104","count":"6"},{"value":"69","count":"6"},{"value":"72","count":"6"},{"value":"110","count":"5"},{"value":"112","count":"5"},{"value":"2","count":"5"},{"value":"99","count":"5"},{"value":"71","count":"4"},{"value":"74","count":"4"},{"value":"92","count":"4"},{"value":"93","count":"4"},{"value":"95","count":"4"},{"value":"98","count":"4"},{"value":"70","count":"3"},{"value":"78","count":"3"},{"value":"89","count":"3"},{"value":"106","count":"2"},{"value":"107","count":"2"},{"value":"109","count":"2"},{"value":"111","count":"2"},{"value":"14","count":"2"},{"value":"73","count":"2"},{"value":"75","count":"2"},{"value":"76","count":"2"},{"value":"83","count":"2"},{"value":"85","count":"2"},{"value":"88","count":"2"},{"value":"90","count":"2"},{"value":"91","count":"2"},{"value":"96","count":"2"},{"value":"105","count":"1"},{"value":"79","count":"1"},{"value":"80","count":"1"},{"value":"81","count":"1"},{"value":"84","count":"1"},{"value":"86","count":"1"},{"value":"87","count":"1"},{"value":"94","count":"1"}]};

    var ageForMale =
    {"age":[{"value":"-1","count":"89838"},{"value":"22","count":"4258"},{"value":"21","count":"3977"},{"value":"20","count":"3676"},{"value":"23","count":"3367"},{"value":"19","count":"3109"},{"value":"24","count":"2883"},{"value":"25","count":"2440"},{"value":"26","count":"2195"},{"value":"18","count":"2137"},{"value":"27","count":"1893"},{"value":"28","count":"1640"},{"value":"29","count":"1455"},{"value":"30","count":"1207"},{"value":"17","count":"1163"},{"value":"31","count":"1113"},{"value":"32","count":"1005"},{"value":"33","count":"785"},{"value":"34","count":"670"},{"value":"35","count":"604"},{"value":"36","count":"521"},{"value":"42","count":"464"},{"value":"37","count":"458"},{"value":"38","count":"455"},{"value":"39","count":"401"},{"value":"40","count":"401"},{"value":"41","count":"374"},{"value":"16","count":"360"},{"value":"43","count":"290"},{"value":"45","count":"266"},{"value":"44","count":"262"},{"value":"46","count":"205"},{"value":"47","count":"197"},{"value":"48","count":"191"},{"value":"49","count":"175"},{"value":"50","count":"158"},{"value":"51","count":"146"},{"value":"52","count":"132"},{"value":"53","count":"108"},{"value":"54","count":"86"},{"value":"55","count":"81"},{"value":"56","count":"63"},{"value":"58","count":"60"},{"value":"57","count":"53"},{"value":"15","count":"42"},{"value":"59","count":"41"},{"value":"62","count":"39"},{"value":"61","count":"35"},{"value":"60","count":"30"},{"value":"63","count":"24"},{"value":"64","count":"19"},{"value":"67","count":"17"},{"value":"65","count":"16"},{"value":"66","count":"14"},{"value":"103","count":"12"},{"value":"107","count":"12"},{"value":"102","count":"10"},{"value":"72","count":"10"},{"value":"74","count":"10"},{"value":"69","count":"9"},{"value":"100","count":"8"},{"value":"99","count":"8"},{"value":"101","count":"7"},{"value":"73","count":"7"},{"value":"109","count":"6"},{"value":"70","count":"6"},{"value":"97","count":"6"},{"value":"14","count":"5"},{"value":"68","count":"5"},{"value":"71","count":"5"},{"value":"75","count":"5"},{"value":"82","count":"5"},{"value":"84","count":"5"},{"value":"92","count":"5"},{"value":"95","count":"5"},{"value":"104","count":"4"},{"value":"81","count":"4"},{"value":"83","count":"4"},{"value":"85","count":"4"},{"value":"93","count":"4"},{"value":"105","count":"3"},{"value":"110","count":"3"},{"value":"76","count":"3"},{"value":"80","count":"3"},{"value":"91","count":"3"},{"value":"94","count":"3"},{"value":"96","count":"3"},{"value":"106","count":"2"},{"value":"108","count":"2"},{"value":"111","count":"2"},{"value":"2","count":"2"},{"value":"77","count":"2"},{"value":"78","count":"2"},{"value":"79","count":"2"},{"value":"87","count":"2"},{"value":"89","count":"2"},{"value":"98","count":"2"},{"value":"112","count":"1"},{"value":"86","count":"1"},{"value":"90","count":"1"}]}

    var ageForUndef =
    {"age":[{"value":"-1","count":"2296"},{"value":"21","count":"167"},{"value":"23","count":"139"},{"value":"22","count":"138"},{"value":"24","count":"129"},{"value":"20","count":"121"},{"value":"25","count":"114"},{"value":"19","count":"92"},{"value":"26","count":"91"},{"value":"27","count":"76"},{"value":"29","count":"72"},{"value":"28","count":"69"},{"value":"30","count":"60"},{"value":"31","count":"47"},{"value":"32","count":"47"},{"value":"18","count":"38"},{"value":"34","count":"33"},{"value":"37","count":"33"},{"value":"33","count":"31"},{"value":"36","count":"25"},{"value":"35","count":"23"},{"value":"40","count":"23"},{"value":"38","count":"19"},{"value":"41","count":"18"},{"value":"39","count":"15"},{"value":"46","count":"13"},{"value":"42","count":"12"},{"value":"17","count":"11"},{"value":"43","count":"10"},{"value":"44","count":"10"},{"value":"45","count":"9"},{"value":"50","count":"8"},{"value":"48","count":"7"},{"value":"49","count":"7"},{"value":"57","count":"7"},{"value":"16","count":"4"},{"value":"52","count":"4"},{"value":"47","count":"3"},{"value":"51","count":"3"},{"value":"55","count":"3"},{"value":"56","count":"3"},{"value":"53","count":"2"},{"value":"64","count":"2"},{"value":"67","count":"2"},{"value":"100","count":"1"},{"value":"101","count":"1"},{"value":"103","count":"1"},{"value":"104","count":"1"},{"value":"110","count":"1"},{"value":"54","count":"1"},{"value":"58","count":"1"},{"value":"60","count":"1"},{"value":"62","count":"1"},{"value":"63","count":"1"},{"value":"70","count":"1"},{"value":"72","count":"1"},{"value":"74","count":"1"},{"value":"79","count":"1"},{"value":"82","count":"1"},{"value":"91","count":"1"},{"value":"92","count":"1"},{"value":"95","count":"1"},{"value":"96","count":"1"},{"value":"97","count":"1"},{"value":"99","count":"1"}]};
    //TODO: add conditional statistics, e.g: statistic for gender of people with age=<AGE>
    console.log('KnalledgeSearchService::getAttributeStatistics()');

    // Undef will be properly accessed
    // male, female and all will be returned from cache
    if([null,0,1].indexOf(filterVal) >= 0){
      // create observable
      const simpleObservable = new Observable((observer) => {
        // observable execution
        // {'1':'Male','0':'Female','-1':'undef'}
        switch(filterVal){
            case 1: // male
              observer.next(ageForMale);
              break;
            case 0: // female
              observer.next(ageForFemale);
              break;
            case null: // all
              observer.next(ageForAll);
              break;
        }
        observer.complete();
      });
      return simpleObservable;
    }


    let url: string = this.apiUrl;//+'by-name/'+name;
    let query:string = 'prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix mp: <http://mypersonality.ddm.cs.umu.se/0.1/> prefix xsd:   <http://www.w3.org/2001/XMLSchema#>';
    query+=
    "SELECT ?attribute count(*)\
       WHERE {\
         ?person mp:"+attribute+" ?attribute . " +
          (filterAtr !==null ? ("?person mp:"+filterAtr+" ?filterVar .\
          filter(xsd:int(?filterVar) = '"+filterVal+"'^^xsd:int)") : "" ) +
        "}\
      GROUP BY ?attribute\
      ORDER BY DESC (count(*))";
      // "SELECT ?attribute count(*)\
      //  WHERE {\
      //    ?person mp:"+attribute+" ?attribute .\
      //    ?age = 25 .\
      //  }\
      // GROUP BY ?attribute\
      // ORDER BY DESC (count(*))";
      //
      // filter(xsd:int(?gender) = "1"^^xsd:int)

      // "SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object . FILTER (?name='http://mypersonality.ddm.cs.umu.se/0.1/gender')";
      // regex(?predicate,“http://mypersonality.ddm.cs.umu.se/0.1/gender”)
      //COUNT(?person) AS alices
      //"SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object . regex(?predicate,“http://mypersonality.ddm.cs.umu.se/0.1/gender”)}");
      //"SELECT ?predicate count(?predicate) WHERE {?subject ?predicate ?object} GROUP BY ?predicate");
      //"SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object}");
    query += (limit > 0 ? ' LIMIT '+limit : '');
    console.log('query:'+query);
    let result:Observable<any> =  this.http.post<any>(url, query, httpOptions)
      .pipe(
        map( fromServer => this.rdfStatisticsToKN(fromServer,attribute) )
        // catchError(this.handleError('KnalledgeSearchService::getByName', null))
      );
    console.log('result:');
    console.log(result);
    //if(callback){result.subscribe(Searchs => callback(Searchs));}
    return result;
  }

  demoSparql(querySparql:string):Observable<any>{
    console.log('KnalledgeSearchService::demoSparql()');
    let url: string = this.apiUrl;//+'by-name/'+name;
    let query:string = 'prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix mp: <http://mypersonality.ddm.cs.umu.se/0.1/>';
    query+= querySparql;
    console.log('query:'+query);
    let result:Observable<any> =  this.http.post<any>(url, query, httpOptions)
      // .pipe(
      //   map( fromServer => this.rdfSchemaToKN(fromServer) )
      //   // catchError(this.handleError('KnalledgeSearchService::getByName', null))
      // );
    console.log('result:');
    console.log(result);
    return result;
  }

  getSchemaBySparql(fillStatistics:boolean = false): Observable<any>
  {
    console.log('KnalledgeSearchService::getSchemaBySparql()');
    let url: string = this.apiUrl;//+'by-name/'+name;
    var limit =  ' LIMIT 100';
    let query:string = 'prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>';
    query+= "SELECT DISTINCT * WHERE {  ?class a owl:Class.  OPTIONAL { ?class rdfs:label ?label}  OPTIONAL { ?class rdfs:comment ?description}}";
    query += limit;
    console.log('query:'+query);

    let result:Observable<any> =  this.http.post<any>(url, query, httpOptions)
      .pipe(
        map( fromServer => this.rdfSchemaToKN(fromServer, fillStatistics) )
        // catchError(this.handleError('KnalledgeSearchService::getByName', null))
      );
    console.log('result:');
    console.log(result);
    //if(callback){result.subscribe(Searchs => callback(Searchs));}
    return result;
  }

  getDataBySparql(): Observable<any>
  {
    console.log('KnalledgeSearchService::getDataBySparql()');
    let url: string = this.apiUrl;//+'by-name/'+name;
    var limit =  ' LIMIT 100';
    let query:string = 'prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object}';
    query += limit;
    let result:Observable<any> =  this.http.post<any>(url, query, httpOptions)
      .pipe(
        map( fromServer => this.rdfDataToKN(fromServer) )
        // catchError(this.handleError('KnalledgeSearchService::getByName', null))
      );
    console.log('result:');
    console.log(result);
    //if(callback){result.subscribe(Searchs => callback(Searchs));}
    return result;
  }

}
