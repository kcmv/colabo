// import { VO } from '@colabo-knalledge/b-core';
import { AuditedAction, AuditedActionClass, AuditedActionSchema } from '@colabo-flow/i-audit';

declare let global:any;
declare let module:any;

// node support (import)
// (not used any more)
// let knalledge:any = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

export interface IAuditDb {
  type:string;
}

export class AuditDbVo extends AuditedActionClass implements IAuditDb {
  static TYPE_COLABOFLOW_AUDIT:string = "colaboflow.audit";

  type:string = undefined;

  constructor() {
    super();
    this.init();
  }

  init():void {
    super.init();
    this.type = AuditDbVo.TYPE_COLABOFLOW_AUDIT; //type of the object, responding to one of the AuditDbVo.TYPE_... constants
  }
}

let auditDb:any = {
  type:String
  // mapId: { type: mongoose.Schema.Types.ObjectId, ref: 'KMap' },
  // iAmId: { type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI' },
  // activeVersion: { type: Number, default: 1 },
  // version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
};

export let AuditDbSchema = Object.assign(auditDb, AuditedActionSchema); 

// (not used any more)
// let AuditClassDbVo = knalledge.AuditDbVo = AuditDbVo;

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
