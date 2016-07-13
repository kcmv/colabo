declare var puzzles;

export const ChangeVisibility:any = {
//TODO: we could not use `export const enum ChangeVisibility {`
//because it could not be exported by `puzzles.changes.ChangeVisibility = ChangeVisibility;` for usage in .js files
	ALL:0,
	MAP_PARTICIPANTS:1,
	MAP_MEDIATORS:2,
	MAP_SAME_GROUP_MEMBERS:3,
	USER:4
};

export const ChangeType:any = {
//export const enum ChangeType {
	UNDEFINED:0,
	STRUCTURAL:1,
	NAVIGATIONAL:2,
	VIEW:3
};

export const ChangePhase:any = {
	UNDISPLAYED:0,
	DISPLAYED:1,
	SEEN:2
};

export const Domain:any = {
	UNDEFINED:0,
	EDGE:1,
	MAP:2,
	NODE:3,
	HOW_AM_I:4,
	WHAT_AM_I:5,
	WHO_AM_I:6
};

export const State:any = {
	LOCAL:0, 			// object is created locally and is still not created on server, so its _id is just local
	NON_SYNCED:1, // object is created already on server but is in meantime updated, so it is not synced
	SYNCED:2 			//all object's changes are synced on server
};

export const Event:any = {
	NODE_CREATED: "node-created",
	NODE_SELECTED: "node-selected",
	NODE_UPDATED: "node-updated",
	NODE_DELETED: "node-deleted",
	EDGE_UPDATED: "edge-updated"
};

export const Actions:any = {
	DATA_CONTENT_RIMA_WHATS_ADDING: "DATA_CONTENT_RIMA_WHATS_ADDING",
	DATA_CONTENT_RIMA_WHATS_DELETING: "DATA_CONTENT_RIMA_WHATS_DELETING",
	UPDATE_NODE_APPEARENCE: "UPDATE_NODE_APPEARENCE",
	UPDATE_NODE_CREATOR: "UPDATE_NODE_CREATOR",
	UPDATE_NODE_NAME: "UPDATE_NODE_NAME",
	UPDATE_NODE_TYPE_VOTE: "UPDATE_NODE_TYPE_VOTE",
	UPDATE_NODE_TYPE: "UPDATE_NODE_TYPE"
};


/**
 * class for mediation Changes
 */
export class Change {
	public static MaxId: number = 0;

	public id: number;
	public value: any;
	public valueBeforeChange: any;
	public reference: any; //it is id or an reference to the object over which the change is done//
	//(depending in which layer we are) to a change or other object regarding which participant has a request
	public type: number; //TODO: change type to `ChangeType` when it is changed back to enum; //coressponding to enum `Type`
	public event: any; //event is on higher level; may be String or enum number
	public action: any; //action is on lower level, depicting the change event; may be String or enum number
	public domain: number; //object type the change is done on; corresponding to enum Domain
	public mapId: string; // id of map this object belongs to
	public iAmId: any;	// it is iAmId or an reference to the user who owns the object (activeUser)
	public sender: any;	// it is iAmId or an reference to the user who sent the change (loggedInUser) - may be same to .iAmId
	//(depending in which layer we are) to the object creator (whoAmi/RIMA user)
	public visibility: number; //coressponding to enum `Visibility`
	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;
	public phase: number; //local - coressponding to enum `Phase`
	public sessionId: string = null;

	/* THIS PROPERTY IS local-to-frontend */
	public state: number = State.LOCAL; //state of the object, responding to some of the enum STATE

	public static changeFactory (obj){
		var change = new Change();
		change.fill(obj);
		return change;
	}

	constructor(){
		this.id = Change.MaxId++;
		this.value = null;
		this.valueBeforeChange = null;
		this.reference = null;
		this.type = ChangeType.UNDEFINED;
		this.event = null;
		this.action = null;
		this.domain = Domain.UNDEFINED;
		this.mapId = null;
		this.iAmId = null;
		this.sender = null;
		this.visibility = ChangeVisibility.ALL;
		// this.createdAt = new Date();
		// this.updatedAt = new Date();
		this.phase = ChangePhase.UNDISPLAYED;
	}

	// public isIbis(){
	// 	return this.type == Change.TYPE_IBIS_QUESTION || this.type == Change.TYPE_IBIS_IDEA ||
	// 	this.type == Change.TYPE_IBIS_ARGUMENT || this.type == Change.TYPE_IBIS_COMMENT;
	// }

	public fill(obj){
		if(obj){
			if("id" in obj){this.id = obj.id;}
			if("value" in obj){this.value = obj.value;}
			if("valueBeforeChange" in obj){this.valueBeforeChange = obj.valueBeforeChange;}
			if("reference" in obj){this.reference = obj.reference;}
			if("type" in obj){this.type = obj.type;}
			if("event" in obj){this.event = obj.event;}
			if("action" in obj){this.action = obj.action;}
			if("domain" in obj){this.domain = obj.domain;}
			if("mapId" in obj){this.mapId = obj.mapId;}
			if("iAmId" in obj){this.iAmId = obj.iAmId;}
			if("sender" in obj){this.sender = obj.sender;}
			if("visibility" in obj){this.visibility = obj.visibility;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
			if("phase" in obj){this.phase = obj.phase;}
			if("sessionId" in obj){this.sessionId = obj.sessionId;}
		}
	};

	/** when object is updated on server we override local object by server version using this function **/
	public overrideFromServer(obj){
		if(obj){
			if("id" in obj){this.id = obj.id;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		}
		this.state = State.SYNCED;
		this.phase = ChangePhase.UNDISPLAYED;
	};

	/** before sending to object to server we clean it and fix it for server **/
	public toServerCopy(){
		var change:any = {};

		/* copying all non-system and non-function properties */
		for(var id in this){
			if(id[0] === '$') continue;
			if(id === 'parents') continue;
			if(id === 'children') continue;
			if (typeof this[id] === 'function') continue;
			//console.log("cloning: %s", id);
			if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
				change[id] = (JSON.parse(JSON.stringify(this[id])));
			}
		}

		/* deleting properties that should be set created to default value on server */
		if(change.createdAt === undefined || change.createdAt === null) {delete change.createdAt;}
		if(change.updatedAt === undefined || change.updatedAt === null) {delete change.updatedAt;}

		if(change.state === State.LOCAL){
			delete change._id;
		}

		//TODO: check this:
		if(typeof change['iAmId'] !== 'string'){
			change['iAmId'] = change['iAmId']._id;
		}
		if(typeof change['reference'] !== 'string'){
			change['reference'] = change['reference']._id;
		}

		/* deleting local-frontend parameters */
		delete change.state;
		delete change.phase;

		return change;
	}

	public getEventText():string {
		switch (this.event){
			case Event.NODE_CREATED:
				return "created";
			case Event.NODE_SELECTED:
				return "selected";
			case Event.NODE_UPDATED:
				return "updated";
			case Event.NODE_DELETED:
				return "deleted";
			case Event.EDGE_UPDATED:
				return "updated";
			default:
				return "unknown action";
		}
	}

	public getEventIcon():string {
		switch (this.event){
			case Event.NODE_CREATED:
				return "fa-plus-circle";
			case Event.NODE_SELECTED:
				return "fa-arrows";
			case Event.NODE_UPDATED:
				return "fa-pencil-square-o";
			case Event.NODE_DELETED:
				return "fa-trash";
			case Event.EDGE_UPDATED:
				return "fa-link";
			default:
				return "fa-question-circle"; //"fa-question-circle-o";
		}
	}

	public isNode(): boolean{
		return this.domain === Domain.NODE;
	}

	public isEdge(): boolean{
		return this.domain === Domain.EDGE;
	}
}

if (typeof puzzles.changes !== 'undefined'){
	puzzles.changes.ChangeVisibility = ChangeVisibility;
	puzzles.changes.ChangeType = ChangeType;
	puzzles.changes.ChangePhase = ChangePhase;
	puzzles.changes.Domain = Domain;
	puzzles.changes.State = State;
	puzzles.changes.Change = Change;
}
