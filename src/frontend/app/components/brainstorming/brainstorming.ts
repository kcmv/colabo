declare var puzzles;
declare var knalledge;

export const BrainstormingPhase:any = {
	INACTIVE:0,
	IDEAS_GENERATION:1,
	SHARING_IDEAS:2,
	GROUP_DISCUSSION:3,
	VOTING_AND_RANKING:4,
	FINISHED:5
};

export class BrainstormingPhaseNames {
	public static INACTIVE: string = 'Inactive';
	public static IDEAS_GENERATION: string = 'Ideas Generation';
	public static SHARING_IDEAS: string = 'Sharing Ideas';
	public static GROUP_DISCUSSION: string = 'Group Discussion';
	public static VOTING_AND_RANKING: string = 'Voting and Ranking';
	public static FINISHED: string = 'Finished';

	public static getNameByPhase(phase: number): string{
		switch(phase){
			case BrainstormingPhase.INACTIVE:
				return this.INACTIVE;
			case BrainstormingPhase.IDEAS_GENERATION:
				return this.IDEAS_GENERATION;
			case BrainstormingPhase.SHARING_IDEAS:
				return this.SHARING_IDEAS;
			case BrainstormingPhase.GROUP_DISCUSSION:
				return this.GROUP_DISCUSSION;
			case BrainstormingPhase.GROUP_DISCUSSION:
				return this.GROUP_DISCUSSION;
			case BrainstormingPhase.FINISHED:
				return this.FINISHED;
		}
	}
}

export const State:any = {
	LOCAL:0, 			// object is created locally and is still not created on server, so its _id is just local
	NON_SYNCED:1, // object is created already on server but is in meantime updated, so it is not synced
	SYNCED:2 			//all object's changes are synced on server
};


/**
 * class for mediation Brainstormings
 */
export class Brainstorming {
	public static MaxId: number = 0;

	public id: number;
	public value: any;
	public question: knalledge.KNode;
	public valueBeforeBrainstorming: any;
	public reference: any; //it is id or an reference to the object over which the brainstorming is done//
	//(depending in which layer we are) to a brainstorming or other object regarding which participant has a request
	public type: number; //TODO: brainstorming type to `BrainstormingType` when it is brainstormingd back to enum;
	//coressponding to enum `Type`
	public event: any; //event is on higher level; may be String or enum number
	public action: any; //action is on lower level, depicting the brainstorming event; may be String or enum number
	public domain: number; //object type the brainstorming is done on; corresponding to enum Domain
	public mapId: string; // id of map this object belongs to
	public iAmId: any;	// it is iAmId or an reference to the user who owns the object (activeUser)
	public sender: any;	// it is iAmId or an reference to the user who sent the brainstorming (loggedInUser) - may be same to .iAmId
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

	public static factory (obj){
		var brainstorming = new Brainstorming();
		brainstorming.fill(obj);
		return brainstorming;
	}

	constructor(){
		this.id = Brainstorming.MaxId++;
		this.value = null;
		this.valueBeforeBrainstorming = null;
		this.reference = null;
		// this.type = BrainstormingType.UNDEFINED;
		this.event = null;
		this.action = null;
		// this.domain = Domain.UNDEFINED;
		this.mapId = null;
		this.iAmId = null;
		this.sender = null;
		// this.visibility = BrainstormingVisibility.ALL;
		// this.createdAt = new Date();
		// this.updatedAt = new Date();
		this.phase = BrainstormingPhase.INACTIVE;
	}

	nextPhase(){
		switch(this.phase){
			case BrainstormingPhase.INACTIVE:
				this.phase = BrainstormingPhase.IDEAS_GENERATION;
			break;
			case BrainstormingPhase.IDEAS_GENERATION:
				this.phase = BrainstormingPhase.SHARING_IDEAS;
			break;
			case BrainstormingPhase.SHARING_IDEAS:
				this.phase = BrainstormingPhase.GROUP_DISCUSSION;
			break;
			case BrainstormingPhase.GROUP_DISCUSSION:
				this.phase = BrainstormingPhase.VOTING_AND_RANKING;
			break;
			case BrainstormingPhase.VOTING_AND_RANKING:
				this.phase = BrainstormingPhase.FINISHED;
			break;
			case BrainstormingPhase.FINISHED:
				this.phase = BrainstormingPhase.FINISHED;
			break;
			default:
				this.phase = BrainstormingPhase.INACTIVE;
		}
	}

	public fill(obj){
		if(obj){
			if("id" in obj){this.id = obj.id;}
			if("value" in obj){this.value = obj.value;}
			if("valueBeforeBrainstorming" in obj){this.valueBeforeBrainstorming = obj.valueBeforeBrainstorming;}
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
		this.phase = BrainstormingPhase.UNDISPLAYED;
	};

	/** before sending to object to server we clean it and fix it for server **/
	public toServerCopy(){
		var brainstorming:any = {};

		/* copying all non-system and non-function properties */
		for(var id in this){
			if(id[0] === '$') continue;
			if(id === 'parents') continue;
			if(id === 'children') continue;
			if (typeof this[id] === 'function') continue;
			//console.log("cloning: %s", id);
			if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
				brainstorming[id] = (JSON.parse(JSON.stringify(this[id])));
			}
		}

		/* deleting properties that should be set created to default value on server */
		if(brainstorming.createdAt === undefined || brainstorming.createdAt === null) {delete brainstorming.createdAt;}
		if(brainstorming.updatedAt === undefined || brainstorming.updatedAt === null) {delete brainstorming.updatedAt;}

		if(brainstorming.state === State.LOCAL){
			delete brainstorming._id;
		}

		//TODO: check this:
		if(typeof brainstorming['iAmId'] !== 'string'){
			brainstorming['iAmId'] = brainstorming['iAmId']._id;
		}
		if(typeof brainstorming['reference'] !== 'string'){
			brainstorming['reference'] = brainstorming['reference']._id;
		}

		/* deleting local-frontend parameters */
		delete brainstorming.state;
		delete brainstorming.phase;

		return brainstorming;
	}
}

if (typeof puzzles.brainstormings !== 'undefined'){
	puzzles.brainstormings.BrainstormingPhase = BrainstormingPhase;
	puzzles.brainstormings.State = State;
	puzzles.brainstormings.Brainstorming = Brainstorming;
}
