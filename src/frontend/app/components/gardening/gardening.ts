export const enum ApprovalState {
  NOT_AUDITED,
  //IN_PROCESS, TODO: add complex approval procedure
  APPROVED,
  DISAPPROVED
}

/**
 * class for Knowledge Gardening Plugin
 */
export class Gardening {
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
    return (kNode.gardening && kNode.gardening.approval && kNode.gardening.approval.state) ? kNode.gardening.approval.state :
    ApprovalState.NOT_AUDITED;
  }

  static setApprovalState(kNode:any, state:number){
    if(!kNode.gardening){kNode.gardening = {};}
    if(!kNode.gardening.approval){kNode.gardening.approval = {};}
    kNode.gardening.approval.state = state;
  }
}
