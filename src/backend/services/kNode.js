"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var VO_1 = require("./VO");
// node support (import)
knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);
/**
 * @classdesc VKNode is data representation of the knowledge (KnAllEdge) node.
 * It is stored on the server and it connects with other nodes through edges
 * represented with kEdges
 * @class KNode
 * @memberof knalledge
 */
var KNode = /** @class */ (function (_super) {
    __extends(KNode, _super);
    // 		xM: undefined, //manual set x coordinate, set by user
    // 		yM: undefined, //manual set y coordinate, set by user
    // 		widthM: undefined, //manual set width, set by user
    // 		heightM: undefined //manual set height, set by user
    // };
    function KNode() {
        var _this = _super.call(this) || this;
        _this.mapId = null; // id of map this object belongs to
        // dataContent.property = null; // value of node content (Additional Info)
        _this.decorations = {};
        // next higher level of abstraction
        _this.up = {
        /*
            Suggested elements:

            _id: undefined,
            name: undefined,
            type: undefined
        */
        };
        _this.visual = {
            //	visual is an object containing aspects of visual representation of the kNode object. VKNode object is related to it.
            //	NOTE: in the future, each user will have its one or more visual representations of kNode, so accordingly this object is going to be migrated to an independent object related to iAmId (user ID)!
            isOpen: false
        };
        _this.init();
        return _this;
    }
    KNode.prototype.init = function () {
        _super.prototype.init.call(this);
        this.type = KNode.TYPE_KNOWLEDGE; //type of the object, responding to one of the KNode.TYPE_... constants
    };
    KNode.nodeFactory = function (obj) {
        return KNode.factory(obj);
    };
    KNode.factory = function (obj) {
        return VO_1.VO.VOfactory(obj, KNode);
    };
    // static factory(obj:any):KNode {
    // 	let kNode:KNode = new KNode();
    // 	kNode.fill(obj);
    // 	return kNode;
    // }
    KNode.prototype.isIbis = function () {
        return this.type == KNode.TYPE_IBIS_QUESTION || this.type == KNode.TYPE_IBIS_IDEA || this.type == KNode.TYPE_IBIS_ARGUMENT || this.type == KNode.TYPE_IBIS_COMMENT;
    };
    KNode.prototype.fill = function (obj) {
        if (obj) {
            _super.prototype.fill.call(this, obj);
            if ("mapId" in obj) {
                this.mapId = obj.mapId;
            }
            if ("decorations" in obj) {
                this.decorations = obj.decorations;
            } //TODO: deep copy?
            if ("up" in obj) {
                this.up = obj.up;
            } //TODO: deep copy?
            if ("visual" in obj) {
                if (!('visual' in this) || this.visual == null)
                    this.visual = {};
            }
        }
    };
    //TODO: refactor to the VO - like we've done in Edge and Map VOs
    KNode.prototype.toServerCopy = function () {
        var kNode = _super.prototype.toServerCopy.call(this);
        // TODO: fix cloning
        var whats = null;
        if (this.dataContent && this.dataContent.rima && this.dataContent.rima.whats) {
            var whats_1 = this.dataContent.rima.whats;
            this.dataContent.rima.whats = [];
        }
        /* copying all non-system and non-function properties */
        var id;
        for (id in this) {
            if (id[0] === '$')
                continue;
            if (id === 'parents' || id === 'children')
                continue;
            if (id === 'parentsLinks' || id === 'childrenLinks' || id === 'tree' || id === 'what' || id === 'user')
                continue; //Ontov local objects
            if (typeof this[id] == 'function')
                continue;
            //console.log("cloning: %s", id);
            if (this[id] !== undefined) { //JSON.parse breaks at "undefined"
                kNode[id] = (JSON.parse(JSON.stringify(this[id])));
            }
        }
        if (whats) {
            var whatsNew = [];
            /* copying all non-system and non-function properties */
            for (var wI in whats) {
                var what = whats[wI];
                var whatNew = {};
                whatsNew.push(whatNew);
                for (id in what) {
                    if (id[0] == '$')
                        continue;
                    if (typeof what[id] == 'function')
                        continue;
                    //console.log("cloning: %s", id);
                    whatNew[id] = (JSON.parse(JSON.stringify(what[id])));
                }
            }
            this.dataContent.rima.whats = whats;
            kNode.dataContent.rima.whats = whatsNew;
        }
        //TODO:NG2: done in super(), but overriden in the current method
        /* deleting properties that should be set created to default value on server */
        if (kNode.createdAt === undefined || kNode.createdAt === null) {
            delete kNode.createdAt;
        }
        if (kNode.updatedAt === undefined || kNode.updatedAt === null) {
            delete kNode.updatedAt;
        }
        if (kNode.state == VO_1.VO.STATE_LOCAL) {
            delete kNode._id;
        }
        /* deleting local-frontend parameters */
        delete kNode.state;
        return kNode;
    };
    KNode.TYPE_KNOWLEDGE = "type_knowledge";
    KNode.TYPE_IBIS_QUESTION = "type_ibis_question";
    KNode.TYPE_IBIS_IDEA = "type_ibis_idea";
    KNode.TYPE_IBIS_ARGUMENT = "type_ibis_argument";
    KNode.TYPE_IBIS_COMMENT = "type_ibis_comment";
    KNode.TYPE_USERS = "rima.users";
    KNode.TYPE_USERS_GROUP = "rima.users_group";
    KNode.TYPE_USER = "rima.user";
    KNode.TYPE_TAGS = "rima.tags";
    KNode.TYPE_TAGS_GROUP = "rima.tags_group";
    KNode.TYPE_TAG = "rima.tag";
    KNode.UPDATE_TYPE_ALL = 'UPDATE_NODE_TYPE_ALL';
    KNode.UPDATE_TYPE_IMAGE = 'UPDATE_NODE_TYPE_IMAGE';
    KNode.UPDATE_TYPE_VOTE = 'UPDATE_NODE_TYPE_VOTE';
    KNode.UPDATE_TYPE_WHAT = 'UPDATE_NODE_TYPE_WHAT';
    //static UPDATE_TYPE_VISUAL = 'UPDATE_TYPE_VISUAL';
    KNode.DATA_CONTENT_RIMA_WHATS_ADDING = "DATA_CONTENT_RIMA_WHATS_ADDING";
    KNode.DATA_CONTENT_RIMA_WHATS_DELETING = "DATA_CONTENT_RIMA_WHATS_DELETING";
    KNode.CREATE_TYPE = 'CREATE_NODE_TYPE';
    return KNode;
}(VO_1.VO));
exports.KNode = KNode;
var KNodeClass = knalledge.KNode = KNode;
// node support (export)
if (typeof module !== 'undefined') {
    // workarround for TypeScript's `module.exports` readonly
    if ('exports' in module) {
        if (typeof module['exports'] !== 'undefined') {
            module['exports'].KNode = KNode;
        }
    }
    else {
        module['exports'] = KNode;
    }
}
