export const enum SuggestionVisibility {
	ALL,
	MAP_PARTICIPANTS,
	MAP_MEDIATORS,
	MAP_SAME_GROUP_MEMBERS,
	USER
}

export const enum SuggestionType {
	UNDEFINED,
	REPLICA,
	CLARIFICATION
}

export const enum SuggestionState {
	REQUESTED,
	GRANTED,
	REVOKED
}

/**
 * class for mediation Suggestions
 */
export class Suggestion {
	public static MaxId: number = 0;

	public id: number;
	public reference: any; //it is id or an reference ...//
	//(depending in which layer we are) to a node or other object regarding which participant has a suggestion
	public type: number; //coressponding to enum `Type`
	public mapId: number; // id of map this object belongs to
	public who: any;	// it is iAmId or an reference ...//
	//(depending in which layer we are) to the object creator (whoAmi/RIMA user)
	public visibility: number; //coressponding to enum `Visibility`
	public createdAt: any; //when the object is created
	public updatedAt: any; //when the obect is updated
	public dataContent: Object;
	public decorations: Object;
	public state: number; //coressponding to enum `State`

	constructor(){
		this.id = Suggestion.MaxId++;
		this.reference = null;
		this.type = SuggestionType.UNDEFINED;
		this.mapId = null;
		this.who = 0;
		this.visibility = SuggestionVisibility.MAP_MEDIATORS;
		this.createdAt = null;
		this.updatedAt = null;
		this.dataContent = {};
		this.decorations = {};
		this.state = SuggestionState.REQUESTED;
	}
}
