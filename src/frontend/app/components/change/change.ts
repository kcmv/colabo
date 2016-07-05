declare var change;

export const enum ChangeVisibility {
	ALL,
	MAP_PARTICIPANTS,
	MAP_MEDIATORS,
	MAP_SAME_GROUP_MEMBERS,
	USER
}

export const enum ChangeType {
	UNDEFINED,
	STRUCTURAL,
	NAVIGATIONAL,
	VIEW
}

export const enum ChangePhase {
	UNDISPLAYED,
	DISPLAYED,
	SEEN
}

export const enum Domain {
	UNDEFINED,
	EDGE,
	MAP,
	NODE,
	HOW_AM_I,
	WHAT_AM_I,
	WHO_AM_I
}

export const enum State {
	LOCAL, 			// object is created locally and is still not created on server, so its _id is just local
	NON_SYNCED, // object is created already on server but is in meantime updated, so it is not synced
	SYNCED 			//all object's changes are synced on server
}


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
	public type: ChangeType; //coressponding to enum `Type`
	public domain: Domain; //object type the change is done on; corresponding to enum Domain
	public mapId: string; // id of map this object belongs to
	public iAmId: any;	// it is iAmId or an reference ...//
	//(depending in which layer we are) to the object creator (whoAmi/RIMA user)
	public visibility: ChangeVisibility; //coressponding to enum `Visibility`
	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;
	public phase: ChangePhase; //local - coressponding to enum `Phase`

	/* THIS PROPERTY IS local-to-frontend */
	public state: State = State.LOCAL; //state of the object, responding to some of the enum STATE

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
		this.domain = Domain.UNDEFINED;
		this.mapId = null;
		this.iAmId = null;
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
			if("domain" in obj){this.domain = obj.domain;}
			if("mapId" in obj){this.mapId = obj.mapId;}
			if("iAmId" in obj){this.iAmId = obj.iAmId;}
			if("visibility" in obj){this.visibility = obj.visibility;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
			if("phase" in obj){this.phase = obj.phase;}
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
	};
}

if (typeof change !== 'undefined') change.Change = Change;
