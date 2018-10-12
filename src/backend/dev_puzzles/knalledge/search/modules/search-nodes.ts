declare var require: any;
declare var global: any;

// import {KNode} from '../services/kNode';

var dbService = require('@colabo-knalledge/b-storage-mongo');
var accessId = 0;

function resSendJsonProtected(res, data) {
    // http://tobyho.com/2011/01/28/checking-types-in-javascript/
    if (data !== null && typeof data === 'object') { // http://stackoverflow.com/questions/8511281/check-if-a-variable-is-an-object-in-javascript
        res.set('Content-Type', 'application/json');
        // JSON Vulnerability Protection
        // http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
        // https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
        res.send(")]}',\n" + JSON.stringify(data));
    } else if (typeof data === 'string') { // http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
        res.send(data);
    } else {
        res.send(data);
    }
};

var dbConnection = dbService.DBConnect();
var KNodeModel = dbConnection.model('KNode', global.db.kNode.Schema);
var KEdgeModel = dbConnection.model('kEdge', global.db.kEdge.Schema);

class SearchNodes {
	constructor(protected req:any, protected res:any){
	}

	index(callback:Function = null){
		console.log("[puzzle(knalledge/search) - /models/index.js] req: %s", JSON.stringify(this.req.params));
		console.log('req.body:', this.req.body);

		var id = this.req.params.searchParam;
		var id2 = this.req.params.searchParam2;
		var type = this.req.params.type;
		var actionType = this.req.params.actionType;

		var isParents:boolean = true;

		var foundEdges = function (err, kEdges) {
			console.log("[puzzle(knalledge/search) - /models/index.js] in 'foundEdges'", kEdges);
			if (err) {
				// throw err;
				var msg = JSON.stringify(err);
				if (callback) callback(err, null);
				resSendJsonProtected(this.res, { data: null, accessId: accessId, message: msg, success: false });
			} else {
				var kNodeIds = [];
				var kEdge;
				if (isParents){
					for (kEdge of kEdges) {
						kNodeIds.push(kEdge.sourceId);
					}
				}else{
					for (kEdge of kEdges) {
						kNodeIds.push(kEdge.targetId);
					}
				}
				var foundNodes = function (err, kNodes) {
					console.log("[puzzle(knalledge/search) - /models/index.js] in 'foundEdges'", kNodes);
					if (err) {
						// throw err;
						var msg = JSON.stringify(err);
						if (callback) callback(err, null);
						resSendJsonProtected(this.res, { data: null, accessId: accessId, message: msg, success: false });
					} else {
						if (callback) callback(null, kNodes);
						// resSendJsonProtected(this.res, { data: { type: type, actionType: actionType, id: id, id2: id2, edges: kEdges, nodes: kNodes }, accessId: accessId, success: true });
						resSendJsonProtected(this.res, { data: kNodes, accessId: accessId, success: true });
					}
				}
				KNodeModel.find({ '_id': { $in: kNodeIds} }, foundNodes.bind(this));
			}
		}

		if(type == 'parents' &&  actionType == 'in-map'){
			KEdgeModel.find({ 'mapId': id, 'targetId': id2 }, foundEdges.bind(this));
			isParents = true;
		} else if (type == 'children' && actionType == 'in-map') {
			KEdgeModel.find({ 'mapId': id, 'sourceId': id2 }, foundEdges.bind(this));
			isParents = false;
		}else{
			resSendJsonProtected(this.res, { data: null, accessId: accessId, success: false, msg: "Not matching API signature" });
		}

	}
} // CLASS END

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/parents/in-map/58068a04a37162160341d402/59d3fb284b077e6c540f758e
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/children/in-map/58068a04a37162160341d402/59d3bdcf0d1f92de005c85a9
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
export function index(req:any, res:any){
	let searchNodes: SearchNodes = new SearchNodes(req, res);
	searchNodes.index();
}