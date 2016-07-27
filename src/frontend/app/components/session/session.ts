import {Participant} from './participant';

declare var puzzles;
declare var knalledge;

export const SessionPhase:any = {
	INACTIVE:0,
	ACTIVE:1,
	PAUSED: 2,
	FINISHED: 3
};

export class SessionPhaseNames {

	public static INACTIVE: string = 'Inactive';
	public static ACTIVE: string = 'Active';
	public static PAUSED: string = 'Paused';
	public static FINISHED: string = 'Finished';

	public static getNameByPhase(phase: number): string{
		switch(phase){
			case SessionPhase.INACTIVE:
				return this.INACTIVE;
			case SessionPhase.ACTIVE:
				return this.ACTIVE;
			case SessionPhase.PAUSED:
				return this.PAUSED;
			case SessionPhase.FINISHED:
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
 * class for mediation Sessions
 */
export class Session {
	public static MaxId: number = 0;

/* PROPERTIES */
	public id: number;
	public name: string;
	public participants: any = {};
	//public presenter: knalledge.WhoAmI = null; retreived from 'participants[i].isPresenter'
	public mustFollowPresenter: boolean = false; //control of participants option of (NOT) receiveNavigation (if **they CAN STOP FOLLOWing**)
	public readOnly: boolean = false;
	public phase:number;
	public mapId: number; //map at which the session is happening
	public collaboSpace: any = {}; //representing state of all relevant puzzles in the Collabospace, e.g. Brainstorming, etc ...
	public creator: knalledge.WhoAmI = null;
	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;

	/* THIS PROPERTY IS local-to-frontend */
	public state: number = State.LOCAL; //state of the object, responding to some of the enum STATE
/* PROPERTIES - END */


	public static factory (obj){
		var session = new Session();
		session.fill(obj);
		return session;
	}

	constructor(){
		this.reset();
	}

	reset(){
		this.id = Session.MaxId++;
		this.name = "Session " + this.id;
		this.participants = {};
		this.mustFollowPresenter = false;
		this.readOnly = false;
		this.phase= SessionPhase.INACTIVE;
		this.mapId = null;
		this.collaboSpace = {};
		this.creator = null;
	}

	public fill(obj){
	//TODO:
	// 	if(obj){
	// 		if("id" in obj){this.id = obj.id;}
	// 		if("createPrivateIdeas" in obj){this.createPrivateIdeas = obj.createPrivateIdeas;}
	// 		if("onlyIdeasToQuestion" in obj){this.onlyIdeasToQuestion = obj.onlyIdeasToQuestion;}
	// 		if("allowArgumentsToIdeas" in obj){this.allowArgumentsToIdeas = obj.allowArgumentsToIdeas;}
	// 		if("currentPhaseTimeLeft" in obj){this.currentPhaseTimeLeft = obj.currentPhaseTimeLeft;}
	// 		if("currentPhaseTimeSpent" in obj){this.currentPhaseTimeSpent = obj.currentPhaseTimeSpent;}
	// 		if("question" in obj){this.question = obj.question;}
	// 		if("phase" in obj){this.phase = obj.phase;}
	// 		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
	// 		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	// 		if("state" in obj){this.state = obj.state;}
	// 		if("presenter" in obj){this.presenter = obj.presenter;}
	//
	// 	}
	}

	/** when object is updated on server we override local object by server version using this function **/
	public overrideFromServer(obj){
		if(obj){
			if("id" in obj){this.id = obj.id;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		}
		this.state = State.SYNCED;
		this.phase = SessionPhase.UNDISPLAYED;
	};

	/** before sending to object to server we clean it and fix it for server **/
	public toServerCopy(){
		var forServer:any = {};
		//TODO:
		/* copying all non-system and non-function properties */
		for(var id in this){
			if(id[0] === '$') continue;
			if(id === 'parents') continue;
			if(id === 'children') continue;

			// if(id === 'question'){
			// 	if(typeof this['question'] !== 'string'){
			// 		if(this['question'] instanceof knalledge.KNode){
			// 			forServer['question'] = this['question']._id;
			// 		}else{
			// 			forServer['question'] = this['question'].kNode._id; //VKNode
			// 		}
			// 	}
			// 	continue;
			// }
			//

			if(id === 'collaboSpace'){
				for (var id in this['collaboSpace']){
					if(typeof this['collaboSpace'].id.toServerCopy === 'function') {
						forServer['collaboSpace'].id = this['collaboSpace'].id.toServerCopy();
					}
				}
			}

			if(id === 'participants'){
				//TODO: we should see in the future if we want to save presenter objects too
				forServer['participants'] = {};
				//var participantsForServer:any = {};
				for (var id in this['participants']){
					if(this['participants'].id instanceof Participant){
						forServer['participants'].id = this['participants'].id.isPresenter;
					}
				}
				continue;
			}

			if((typeof this[id] === 'object') && this[id] !== null ){ //if the property is an object
				if(typeof this[id].getId === 'function') {
					forServer[id] = this[id].getId();
				}
				// if(typeof this[id].toServerCopy === 'function') {
				// 	forServer[id] = this[id].toServerCopy();
				// }
				continue;
			}

			if (typeof this[id] === 'function') continue;
			//console.log("cloning: %s", id);

			if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
				forServer[id] = (JSON.parse(JSON.stringify(this[id])));
			}
		}

		/* deleting properties that should be set created to default value on server */
		if(forServer.createdAt === undefined || forServer.createdAt === null) {delete forServer.createdAt;}
		if(forServer.updatedAt === undefined || forServer.updatedAt === null) {delete forServer.updatedAt;}

		if(forServer.state === State.LOCAL){
			delete forServer._id;
		}

		/* deleting local-frontend parameters */
		delete forServer.state;
		//delete forServer.phase;

		return forServer;
	}

	nextPhase(){
		switch(this.phase){
			// case SessionPhase.INACTIVE:
			// 	this.phase = SessionPhase.IDEAS_GENERATION;
			// break;
			// case SessionPhase.IDEAS_GENERATION:
			// 	this.phase = SessionPhase.SHARING_IDEAS;
			// break;
			// case SessionPhase.SHARING_IDEAS:
			// 	this.phase = SessionPhase.GROUP_DISCUSSION;
			// break;
			// case SessionPhase.GROUP_DISCUSSION:
			// 	this.phase = SessionPhase.VOTING_AND_RANKING;
			// break;
			// case SessionPhase.VOTING_AND_RANKING:
			// 	this.phase = SessionPhase.FINISHED;
			// break;
			// case SessionPhase.FINISHED:
			// 	this.phase = SessionPhase.FINISHED;
			// break;
			default:
				this.phase = SessionPhase.INACTIVE;
		}
	}

	previousPhase(){
		switch(this.phase){
			// case SessionPhase.INACTIVE:
			// 	this.phase = SessionPhase.INACTIVE;
			// break;
			// case SessionPhase.IDEAS_GENERATION:
			// 	this.phase = SessionPhase.INACTIVE;
			// break;
			// case SessionPhase.SHARING_IDEAS:
			// 	this.phase = SessionPhase.IDEAS_GENERATION;
			// break;
			// case SessionPhase.GROUP_DISCUSSION:
			// 	this.phase = SessionPhase.SHARING_IDEAS;
			// break;
			// case SessionPhase.VOTING_AND_RANKING:
			// 	this.phase = SessionPhase.GROUP_DISCUSSION;
			// break;
			// case SessionPhase.FINISHED:
			// 	this.phase = SessionPhase.VOTING_AND_RANKING;
			// break;
			default:
				this.phase = SessionPhase.INACTIVE;
		}
	}
}

//FOR USAGE IN OLD-JS parts:
if (typeof puzzles.sessions !== 'undefined'){
	puzzles.sessions.SessionPhase = SessionPhase;
	puzzles.sessions.State = State;
	puzzles.sessions.Session = Session;
	puzzles.sessions.SessionPhaseNames = SessionPhaseNames;
}
