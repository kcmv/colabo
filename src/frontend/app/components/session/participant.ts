import {Change} from '../change/change';

declare var puzzles;
declare var knalledge;

export const State:any = {
	LOCAL:0, 			// object is created locally and is still not created on server, so its _id is just local
	NON_SYNCED:1, // object is created already on server but is in meantime updated, so it is not synced
	SYNCED:2 			//all object's changes are synced on server
};


/**
 * class for mediation Participants
 */
export class Participant {
	static ACTIONS_NO: number = 30;
	static NON_LOGGED_IN: string = "NON_LOGGED_IN";

	public static MaxId: number = 0;

/* PROPERTIES */
	public whoAmI: knalledge.WhoAmI;
	public actions: Change[] = []; //last actions
	public role: any; //to be designed
	public isPresenter: boolean = false;
	public sessionId: string; //curent session
	public selectedNode: knalledge.KNode;

	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;

	/* THIS PROPERTY IS local-to-frontend */
	public state: number = State.LOCAL; //state of the object, responding to some of the enum STATE
/* PROPERTIES - END */


	public static factory (obj){
		var participant = new Participant();
		participant.fill(obj);
		return participant;
	}

	constructor(){
		this.reset();
	}

	getId() {
		return this.whoAmI._id;
	}


	reset(){
		//TODO:
	// 	this.id = Participant.MaxId++;
	// 	this.createPrivateIdeas = true;
	// 	this.onlyIdeasToQuestion = true;
	// 	this.allowArgumentsToIdeas = false; //allow adding arguments to ideas
	// 	// this.currentPhaseTimeLeft: number;
	// 	// this.currentPhaseTimeSpent: number;
	// 	this.question = null;
	// 	this.phase= ParticipantPhase.INACTIVE;
	// 	this.presenter = null;
	//
	// 	// this.createdAt: any; //when the object is created
	// 	// this.updatedAt: any; //when the obect is updated
	// 	// this.dataContent: Object;
	// 	// this.decorations: Object;
	//
	// 	/* THIS PROPERTY IS local-to-frontend */
	// 	this.state = State.LOCAL; //state of the object, responding to some of the enum STATE
	// /* PROPERTIES - END */
	}


	public fill(obj){
		//TODO
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
	};

	/** when object is updated on server we override local object by server version using this function **/
	public overrideFromServer(obj){
		if(obj){
			//if("id" in obj){this.id = obj.id;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		}
		this.state = State.SYNCED;
	};

	/** before sending to object to server we clean it and fix it for server **/
	public toServerCopy(){
		var forServer:any = {};

		/* copying all non-system and non-function properties */
		for(var id in this){
			if(id[0] === '$') continue;
			if(id === 'parents') continue;
			if(id === 'children') continue;

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
}

//FOR USAGE IN OLD-JS parts:
if (typeof puzzles.participants !== 'undefined'){
	puzzles.participants.State = State;
	puzzles.participants.Participant = Participant;
}
