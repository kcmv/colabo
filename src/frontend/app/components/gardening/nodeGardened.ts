export const enum ApprovalState {
  NOT_AUDITED,
  //IN_PROCESS, TODO: add complex approval procedure
  APPROVED,
  DISAPPROVED
}

/**
 * class for Knowledge Gardening Plugin
 */
export class NodeGardened {
	// public static MaxId: number = 0;
  //
	// public id: number;
	// public reference: any; //it is id or an reference ...//
	// //(depending in which layer we are) to a node or other object regarding which participant has a request
	// public type: number; //coressponding to enum `Type`
	// public mapId: number; // id of map this object belongs to
	// public who: any;	// it is iAmId or an reference ...//
	// //(depending in which layer we are) to the object creator (whoAmi/RIMA user)
	// public visibility: number; //coressponding to enum `Visibility`
	// public createdAt: any; //when the object is created
	// public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;
	// public state: number; //coressponding to enum `State`
  //
	constructor(){
	// 	this.id = Request.MaxId++;
	// 	this.reference = null;
	// 	this.type = RequestType.UNDEFINED;
	// 	this.mapId = null;
	// 	this.who = 0;
	// 	this.visibility = RequestVisibility.MAP_MEDIATORS;
	// 	this.createdAt = null;
	// 	this.updatedAt = null;
	// 	this.dataContent = {};
	// 	this.decorations = {};
	// 	this.state = RequestState.REQUESTED;
	}

	/**
	 * [returns ApprovalState.NOT_AUDITED if approval is not present in the kNode]
	 * @param  {[type]} kNode [description]
	 * @return {[type]}       [description]
	 */
	static getApprovalState(kNode:any){
    return (kNode.up.gardening && kNode.up.gardening && kNode.up.gardening.approval && kNode.up.gardening.approval.state) ?
    kNode.up.gardening.approval.state :
    ApprovalState.NOT_AUDITED;
  }

  static setApprovalState(kNode:any, state:number){
    if(!kNode.up){kNode.up = {gardening:{approval:{}}};
    }else{
      if(!kNode.up.gardening){kNode.up.gardening = {approval:{}};
      }else{
        if(!kNode.up.gardening.approval){kNode.up.gardening.approval = {};}
      }
    }
    kNode.up.gardening.approval.state = state;
  }
  static createApprovalStatePatch(state:number){
    return {up:{gardening:{approval:{state:state}}}};
  }

  static getApprovalLabel(node:any){
    switch(NodeGardened.getApprovalState(node)){
      case ApprovalState.APPROVED:
        return "A";
      case ApprovalState.DISAPPROVED:
        return  "D";
      default:
      case ApprovalState.NOT_AUDITED:
        return  "?";
    }
  }

  static nextState(node:any){
    var oldState = NodeGardened.getApprovalState(node);
    switch(oldState){
      case ApprovalState.NOT_AUDITED:
        return  ApprovalState.APPROVED;
      case ApprovalState.APPROVED:
        return ApprovalState.DISAPPROVED;
      case ApprovalState.DISAPPROVED:
        return ApprovalState.NOT_AUDITED;
    }
  }
}
