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
// node support (import)
knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);
var VO_1 = require("./VO");
/**
 * @classdesc KEdge is data representation of the knowledge (KnAllEdge) edge.
 * It is stored on the serverver and it connects other nodes (kNode)
 * @class KEdge
 * @memberof knalledge
 */
var KEdge = /** @class */ (function (_super) {
    __extends(KEdge, _super);
    //	NOTE: in the future, each user will have its one or more visual representations of kNode, so accordingly this object is going to be migrated to an independent object related to iAmId (user ID)!
    //sid = ++KEdge.S_ID;
    /*for debugging all moments where this object is created: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
    try {
        throw new Error('myError');
    }
    catch(e) {
    // console.warn((new Error).lineNumber)
        console.warn(this.sid + ':' + e.stack);
    }*/
    function KEdge() {
        var _this = _super.call(this) || this;
        _this.mapId = null; // id of map this object belongs to
        _this.sourceId = null; // id of the source node this edge is connected to
        _this.targetId = null; // id of the target node this edge is connected to
        _this.value = 0; //value assigned to the edge
        // next higher level of abstraction
        _this.up = {
        /*
            Suggested elements:
    
            _id: undefined,
            name: undefined,
            type: undefined,
            sourceId: undefined,
            targetId: undefined
        */
        };
        _this.visual = null; //	visual is an object containing aspects of visual representation of the kNode object. VKNode object is related to it.
        _this.init();
        return _this;
    }
    KEdge.prototype.init = function () {
        _super.prototype.init.call(this);
        this.isPublic = false;
        this.type = KEdge.TYPE_KNOWLEDGE; //type of the object, responding to one of the KEdge.TYPE_... constants
    };
    KEdge.edgeFactory = function (obj) {
        return KEdge.factory(obj);
    };
    KEdge.factory = function (obj) {
        return VO_1.VO.VOfactory(obj, KEdge);
    };
    KEdge.prototype.fill = function (obj) {
        if (obj) {
            _super.prototype.fill.call(this, obj);
            if ("mapId" in obj) {
                this.mapId = obj.mapId;
            }
            if ("sourceId" in obj) {
                this.sourceId = obj.sourceId;
            }
            if ("targetId" in obj) {
                this.targetId = obj.targetId;
            }
            if ("value" in obj) {
                this.value = obj.value;
            }
            if ("visual" in obj) {
                this.visual = obj.visual;
            } // Still Visual is not used so we are not filling it like for kNode
        }
    };
    KEdge.TYPE_KNOWLEDGE = "type_knowledge";
    KEdge.TYPE_IBIS_QUESTION = "type_ibis_question";
    KEdge.TYPE_IBIS_IDEA = "type_ibis_idea";
    KEdge.TYPE_IBIS_ARGUMENT = "type_ibis_argument";
    KEdge.TYPE_IBIS_COMMENT = "type_ibis_comment";
    KEdge.TYPE_USERS = "rima.users";
    KEdge.TYPE_USERS_GROUP = "rima.users_group";
    KEdge.TYPE_USER = "rima.user";
    KEdge.TYPE_TAGS = "rima.tags";
    KEdge.TYPE_TAGS_GROUP = "rima.tags_group";
    KEdge.TYPE_TAG = "rima.tag";
    KEdge.TYPE_USER_INTEREST = "rima.user_interest";
    return KEdge;
}(VO_1.VO));
exports.KEdge = KEdge;
var KEdgeClass = knalledge.KEdge = KEdge;
// node support (export)
if (typeof module !== 'undefined') {
    // workarround for TypeScript's `module.exports` readonly
    if ('exports' in module) {
        if (typeof module['exports'] !== 'undefined') {
            module['exports'].KEdge = KEdge;
        }
    }
    else {
        module['exports'] = KEdge;
    }
}
