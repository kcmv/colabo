declare var puzzles;
declare var knalledge;

export const DemoPuzzleExampleConstants:any = {
	YES:0,
	NO:1
};

export const State:any = {
	LOCAL:0, 			// object is created locally and is still not created on server, so its _id is just local
	NON_SYNCED:1, // object is created already on server but is in meantime updated, so it is not synced
	SYNCED:2 			//all object's changes are synced on server
};


/**
 * class for mediation DemoPuzzles
 */
export class DemoPuzzle {
	public static MaxId: number = 0;

/* PROPERTIES */
	public id: number;
	public name: string;
	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	// public dataContent: Object;
	// public decorations: Object;

	/* THIS PROPERTY IS local-to-frontend */
	public state: number = State.LOCAL; //state of the object, responding to some of the enum STATE
/* PROPERTIES - END */


	public static factory (obj){
		var demoPuzzle = new DemoPuzzle();
		demoPuzzle.fill(obj);
		return demoPuzzle;
	}

	constructor(){
		this.reset();
	}

	reset(){
		this.id = DemoPuzzle.MaxId++;
		this.name = "Hello World";


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
			if("id" in obj){this.id = obj.id;}

			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
			if("state" in obj){this.state = obj.state;}
			if("name" in obj){this.name = obj.name;}

		}
	}

	/** when object is updated on server we override local object by server version using this function **/
	public overrideFromServer(obj){
		if(obj){
			if("id" in obj){this.id = obj.id;}
			if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
			if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		}
		this.state = State.SYNCED;
	}

	/** before sending to object to server we clean it and fix it for server **/
	public toServerCopy(){
		var demoPuzzle:any = {};

		/* copying all non-system and non-function properties */
		for(var id in this){
			if(id[0] === '$') continue;
			if(id === 'parents') continue;
			if(id === 'children') continue;

			if (typeof this[id] === 'function') continue;
			//console.log("cloning: %s", id);
			if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
				demoPuzzle[id] = (JSON.parse(JSON.stringify(this[id])));
			}
		}

		/* deleting properties that should be set created to default value on server */
		if(demoPuzzle.createdAt === undefined || demoPuzzle.createdAt === null) {delete demoPuzzle.createdAt;}
		if(demoPuzzle.updatedAt === undefined || demoPuzzle.updatedAt === null) {delete demoPuzzle.updatedAt;}

		if(demoPuzzle.state === State.LOCAL){
			delete demoPuzzle._id;
		}

		/* deleting local-frontend parameters */
		delete demoPuzzle.state;
		//delete demoPuzzle.phase;

		return demoPuzzle;
	}
}

//FOR USAGE IN OLD-JS parts:
if (typeof puzzles.demoPuzzles !== 'undefined'){
	puzzles.demoPuzzles.DemoPuzzleExampleConstants = DemoPuzzleExampleConstants;
	puzzles.demoPuzzles.State = State;
	puzzles.demoPuzzles.DemoPuzzle = DemoPuzzle;
}
