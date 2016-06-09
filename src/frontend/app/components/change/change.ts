export const enum ChangeVisibility {
	ALL,
	MAP_PARTICIPANTS,
	MAP_MEDIATORS,
	MAP_SAME_GROUP_MEMBERS,
	USER
}

export const enum ChangeType {
	UNDEFINED
}

export const enum ChangeState {
	UNDISPLAYED,
	DISPLAYED,
	SEEN
}

/**
 * class for mediation Changes
 */
export class Change {
	public static MaxId: number = 0;

	public id: number;
	public reference: any; //it is id or an reference ...//
	//(depending in which layer we are) to a node or other object regarding which participant has a request
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
		this.id = Change.MaxId++;
		this.reference = null;
		this.type = ChangeType.UNDEFINED;
		this.mapId = null;
		this.who = 0;
		this.visibility = ChangeVisibility.MAP_MEDIATORS;
		this.createdAt = null;
		this.updatedAt = null;
		this.dataContent = {};
		this.decorations = {};
		this.state = ChangeState.UNDISPLAYED;
	}
}
