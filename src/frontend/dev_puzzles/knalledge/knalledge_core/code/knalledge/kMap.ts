import { VO } from './VO';

declare let window:Window;
declare let knalledge:any;
declare let global:any;
declare let module:any;

// map support (import)
knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

/**
 * @classdesc VKMap is data representation of the knowledge (KnAllEdge) map.
 * It is stored on the server and it connects with other maps through edges
 * represented with kEdges
 * @class KMap
 * @memberof knalledge
 */

export class KMap extends VO {
  //name that is displayed, when map is visualized is inherited from the VO class
  rootNodeId:string = null;
  parentMapId:string = "";
  participants:string[] = [];
  //status = ; //
  // TODO:ng2 TS needs dataContent declared,
  // we should check if this makes dataContent ending up
  // at the server even when is it empty
	dataContent:any = null; //additional data is stored in this object
	// dataContent.property = null; // value of map content (Additional Info)
	visual:any = {};

  constructor() {
    super();
    this.init();
  }

  init():void {
    super.init();
    this.isPublic = false;
  }

  static mapFactory(obj:any):KMap { //TODO:remove - kept only for legacy of the old code
  	return KMap.factory(obj);
  }

  static factory(obj:any):KMap {
    return VO.VOfactory<KMap>(obj, KMap);
  }

  fill(obj:any):void {
    if(obj){
      super.fill(obj);
  		if("rootNodeId" in obj){this.rootNodeId = obj.rootNodeId;}
  		if("parentMapId" in obj){this.parentMapId = obj.parentMapId;}
  		if("participants" in obj){this.participants = obj.participants;} //TODO deep copy of array?
  		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
  		if("visual" in obj){this.visual = obj.visual;} //TODO: deep copy?
  	}
  }

}

let KMapClass = knalledge.KMap = KMap;

// map support (export)
if (typeof module !== 'undefined'){
  // workarround for TypeScript's `module.exports` readonly
  if('exports' in module){
    if (typeof module.exports !== 'undefined'){
      module.exports.KMap = KMap;
    }
  }else{
    module.exports = KMap;
  }
}
