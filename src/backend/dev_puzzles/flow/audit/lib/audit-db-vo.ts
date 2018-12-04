// import { VO } from '@colabo-knalledge/b-core';
import { AuditedAction, AuditedActionClass, AuditedActionAny } from '@colabo-flow/i-audit';

declare let global:any;
declare let module:any;

// // import mongoose from 'mongoose';
import * as mongoose from 'mongoose';

// node support (import)
// (not used any more)
// let knalledge:any = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

export interface IAuditDb {
  // _id:any;
  type:any;
}

// MongoDB schema
export let AuditedActionSchema: AuditedActionAny & IAuditDb = {
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

export interface IPluginAuditing{
  // from the `@colabo-knalledge/b-storage-mongo/lib/models/pluginAuditing` plugin
  createdAt: any;
  updatedAt: any;  
}

export class AuditDbVo extends AuditedActionClass implements IAuditDb, IPluginAuditing {
  static TYPE_COLABOFLOW_AUDIT:string = "colaboflow.audit";

  _id: string;
  type:string = undefined;
  // auto-populated by the `@colabo-knalledge/b-storage-mongo/lib/models/pluginAuditing` plugin
  createdAt: any;
  updatedAt: any;

  constructor(auditedAction:AuditedAction=null) {
    super();
    this.init(auditedAction);
  }

  init(auditedAction: AuditedAction = null):void {
    super.init();
    this.type = AuditDbVo.TYPE_COLABOFLOW_AUDIT; //type of the object, responding to one of the AuditDbVo.TYPE_... constants
    if (auditedAction) Object.assign(this, auditedAction);
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
      module['exports'].AuditDbVo = AuditDbVo;
    }
  }else{
    module['exports'] = AuditDbVo;
  }
}
