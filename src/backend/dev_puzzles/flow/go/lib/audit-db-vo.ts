// import { VO } from '@colabo-knalledge/b-core';
import { GoedAction, GoedActionClass, GoedActionAny } from '@colabo-flow/i-go';

declare let global:any;
declare let module:any;

// // import mongoose from 'mongoose';
import * as mongoose from 'mongoose';

// node support (import)
// (not used any more)
// let knalledge:any = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

export interface IGoDb {
  // _id:any;
  type:any;
}

// MongoDB schema
export let GoedActionSchema: GoedActionAny & IGoDb = {
  // introducing the `_id` as part of the schema triggers an `MongooseError`: 'document must have an _id before saving'
  // _id: mongoose.Schema.Types.ObjectId,
  id: String,
  time: String,

  // action types
  bpmn_type: String,
  bpmn_subtype: String,
  bpmn_subsubtype: String,

  flowId: String,
  name: String,

  userId: String,
  sessionId: String,
  flowInstanceId: String,

  implementationId: String,
  implementerId: String,
  
  // DB-speciffic
  type: String,
  success: Boolean
}

export interface IPluginGoing{
  // from the `@colabo-knalledge/b-storage-mongo/lib/models/pluginGoing` plugin
  createdAt: any;
  updatedAt: any;  
}

export class GoDbVo extends GoedActionClass implements IGoDb, IPluginGoing {
  static TYPE_COLABOFLOW_AUDIT:string = "colaboflow.go";

  _id: string;
  type:string = undefined;
  // auto-populated by the `@colabo-knalledge/b-storage-mongo/lib/models/pluginGoing` plugin
  createdAt: any;
  updatedAt: any;

  constructor(goedAction:GoedAction=null) {
    super();
    this.init(goedAction);
  }

  init(goedAction: GoedAction = null):void {
    super.init();
    this.type = GoDbVo.TYPE_COLABOFLOW_AUDIT; //type of the object, responding to one of the GoDbVo.TYPE_... constants
    if (goedAction) Object.assign(this, goedAction);
    // if(this.id){
    //   this._id = this.id;
    //   this.id = undefined;
    // }    
  }
}

// node support (export)
if (typeof module !== 'undefined'){
  // workarround for TypeScript's `module.exports` readonly
  if('exports' in module){
    if (typeof module['exports'] !== 'undefined'){
      module['exports'].GoDbVo = GoDbVo;
    }
  }else{
    module['exports'] = GoDbVo;
  }
}
