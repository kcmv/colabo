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
	public static FINISHED: string = 'Finish';

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
			case BrainstormingPhase.VOTING_AND_RANKING:
				return this.VOTING_AND_RANKING;
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

export const BrainstrormingDecorations:any = {
	PRIVATE : "private",
	PRESENTED : "presented"
};


/**
 * class for mediation Brainstormings
 */
export class Brainstorming {
	public static MaxId: number = 0;
	public static DECORATION: string = "brainstorming";
/* PROPERTIES */
	public _id: number;
	public createPrivateIdeas: boolean; //create private ideas at the 1st phase
	//allow only addition of ideas to the brainstorming question node - no free knowlegdge gardening:
	public onlyIdeasToQuestion: boolean;
	public allowArgumentsToIdeas: boolean; //allow adding arguments to ideas
	public currentPhaseTimeLeft: number;
	public currentPhaseTimeSpent: number;
	public question: knalledge.KNode;
	public phase;
	//public presenter: knalledge.WhoAmI; migrated to `Session`

	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;

	/* THIS PROPERTY IS local-to-frontend */
	public state: number = State.LOCAL; //state of the object, responding to some of the enum STATE
/* PROPERTIES - END */


	public static factory (obj){
		var brainstorming = new Brainstorming();
		brainstorming.fill(obj);
		return brainstorming;
	}

	constructor(){
		this.reset();
	}

	reset(){
		this._id = Brainstorming.MaxId++;
		this.createPrivateIdeas = true;
		this.onlyIdeasToQuestion = true;
		this.allowArgumentsToIdeas = false; //allow adding arguments to ideas
		// this.currentPhaseTimeLeft: number;
		// this.currentPhaseTimeSpent: number;
		this.question = null;
		this.phase= BrainstormingPhase.INACTIVE;
		//this.presenter = null;

		// this.createdAt: any; //when the object is created
		// this.updatedAt: any; //when the obect is updated
		// this.dataContent: Object;
		// this.decorations: Object;

		/* THIS PROPERTY IS local-to-frontend */
		this.state = State.LOCAL; //state of the object, responding to some of the enum STATE
	/* PROPERTIES - END */
	}

	public fill(obj){
		if(obj){
			if("_id" in obj){this._id = obj._id;}
			if("createPrivateIdeas" in obj){this.createPrivateIdeas = obj.createPrivateIdeas;}
			if("onlyIdeasToQuestion" in obj){this.onlyIdeasToQuestion = obj.onlyIdeasToQuestion;}
			if("allowArgumentsToIdeas" in obj){this.allowArgumentsToIdeas = obj.allowArgumentsToIdeas;}
			if("currentPhaseTimeLeft" in obj){this.currentPhaseTimeLeft = obj.currentPhaseTimeLeft;}
			if("currentPhaseTimeSpent" in obj){this.currentPhaseTimeSpent = obj.currentPhaseTimeSpent;}
			if("question" in obj){this.question = obj.question;}
			if("phase" in obj){this.phase = obj.phase;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
			if("state" in obj){this.state = obj.state;}
			//if("presenter" in obj){this.presenter = obj.presenter;}

		}
	};

	/** when object is updated on server we override local object by server version using this function **/
	public overrideFromServer(obj){
		if(obj){
			if("_id" in obj){this._id = obj._id;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		}
		this.state = State.SYNCED;
		//this.phase = BrainstormingPhase.UNDISPLAYED;
	};

	/** before sending to object to server we clean it and fix it for server **/
	public toServerCopy(){
		var brainstorming:any = {};

		/* copying all non-system and non-function properties */
		for(var id in this){
			if(id[0] === '$') continue;
			if(id === 'parents') continue;
			if(id === 'children') continue;

			if(id === 'question'){
				if(typeof this['question'] !== 'string'){
					if(this['question'] instanceof knalledge.KNode){
						brainstorming['question'] = this['question']._id;
					}else{
						brainstorming['question'] = this['question'].kNode._id; //VKNode
					}
				}
				continue;
			}
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

		/* deleting local-frontend parameters */
		delete brainstorming.state;
		//delete brainstorming.phase;

		return brainstorming;
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

	previousPhase(){
		switch(this.phase){
			case BrainstormingPhase.INACTIVE:
				this.phase = BrainstormingPhase.INACTIVE;
			break;
			case BrainstormingPhase.IDEAS_GENERATION:
				this.phase = BrainstormingPhase.INACTIVE;
			break;
			case BrainstormingPhase.SHARING_IDEAS:
				this.phase = BrainstormingPhase.IDEAS_GENERATION;
			break;
			case BrainstormingPhase.GROUP_DISCUSSION:
				this.phase = BrainstormingPhase.SHARING_IDEAS;
			break;
			case BrainstormingPhase.VOTING_AND_RANKING:
				this.phase = BrainstormingPhase.GROUP_DISCUSSION;
			break;
			case BrainstormingPhase.FINISHED:
				this.phase = BrainstormingPhase.VOTING_AND_RANKING;
			break;
			default:
				this.phase = BrainstormingPhase.INACTIVE;
		}
	}
}

//FOR USAGE IN OLD-JS parts:
if (typeof puzzles.brainstormings !== 'undefined'){
	puzzles.brainstormings.BrainstormingPhase = BrainstormingPhase;
	puzzles.brainstormings.State = State;
	puzzles.brainstormings.Brainstorming = Brainstorming;
	puzzles.brainstormings.BrainstormingPhaseNames = BrainstormingPhaseNames;
	puzzles.brainstormings.BrainstrormingDecorations = BrainstrormingDecorations;
}
