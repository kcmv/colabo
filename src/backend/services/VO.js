"use strict";
exports.__esModule = true;
var VO = /** @class */ (function () {
    function VO() {
        this._id = "" + (VO.MaxId++); //TODO: maxId logic should be migrated here. Unique id. Here it is locally set, but is overriden by unique value, when object is saved in DB
        this.name = "";
        this.type = "";
        this.iAmId = ""; //+0; //id of object creator (whoAmi/RIMA user)
        this.ideaId = 0; //TODO: if would be a reference to a Mongo DB Key, than it should be changed to string
        this.activeVersion = 1; //saying which version of this object is active
        this.version = 1; //each object can have several versions, so after creating new verisons, old are saved for auditing
        this.isPublic = true; //is the object public or visible/accessible only to the author
        this.createdAt = null; //when the object is created
        this.updatedAt = null; //when the obect is
        // TODO:ng2 TS needs dataContent declared,
        // we should check if this makes dataContent ending up
        // at the server even when is it empty
        this.dataContent = {}; //additional data is stored in this object
        /* local-to-frontend */
        this.state = VO.STATE_LOCAL; //state of the object, responding to some of the VO.STATE_... constants
        this.init();
    }
    VO.prototype.init = function () {
    };
    VO.prototype.getId = function () {
        return this._id;
    };
    /*
    this @method is expecting a Type T also as a @parameter. It is because this construct could not be used
    `let vo: T = new T();`
    Namely it could not be translated to JS.
  
    Official Typ Documentation: https://www.typescriptlang.org/docs/handbook/generics.html under the 'Using Type Parameters in Generic Constraints' paragraph
  
    More about the solution here:
    https://stackoverflow.com/a/26696476/4742336
    https://stackoverflow.com/a/39623422/4742336
    https://stackoverflow.com/a/41090446/4742336
  
    we used:
    static VOfactory<T extends VO>(obj:any, typeT : IConstructor<T>): T {
    instead of:
    static VOfactory<T extends VO>(obj:any, typeT : { new(): T;}): T {
    because, according to https://stackoverflow.com/a/41551457/4742336, "This is how the Typescript team recommends doing it" and additionally it is a cleaner and more flexible solution
    */
    VO.VOfactory = function (obj, typeT) {
        var vo = new typeT();
        vo.fill(obj);
        return vo;
    };
    VO.factory = function (obj) {
        //to be implemented by each class inheriting VO
        return VO.VOfactory(obj, VO);
    };
    VO.prototype.fill = function (obj) {
        if (obj) {
            if ("_id" in obj) {
                this._id = obj._id;
            }
            if ("name" in obj) {
                this.name = obj.name;
            }
            if ("type" in obj) {
                this.type = obj.type;
            }
            if ("iAmId" in obj) {
                this.iAmId = obj.iAmId;
            }
            if ("ideaId" in obj) {
                this.ideaId = obj.ideaId;
            }
            if ("activeVersion" in obj) {
                this.activeVersion = obj.activeVersion;
            }
            if ("version" in obj) {
                this.version = obj.version;
            }
            if ("isPublic" in obj) {
                this.isPublic = obj.isPublic;
            }
            if ("dataContent" in obj) {
                this.dataContent = obj.dataContent;
            } //TODO: deep copy?
            if ("createdAt" in obj) {
                this.createdAt = new Date(obj.createdAt);
            }
            if ("updatedAt" in obj) {
                this.updatedAt = new Date(obj.updatedAt);
            }
        }
    };
    /** when object is updated on server we override local object by server version using this function **/
    VO.prototype.overrideFromServer = function (obj) {
        if (obj) {
            if ("_id" in obj) {
                this._id = obj._id;
            }
            if ("createdAt" in obj) {
                this.createdAt = new Date(obj.createdAt);
            }
            if ("updatedAt" in obj) {
                this.updatedAt = new Date(obj.updatedAt);
            }
        }
        this.state = VO.STATE_SYNCED;
    };
    /** before sending to object to server we clean it and fix it for server **/
    VO.prototype.toServerCopy = function () {
        var vo = {};
        /* copying all non-system and non-function properties */
        for (var id in this) {
            if (id[0] == '$')
                continue;
            if (typeof this[id] == 'function')
                continue;
            //console.log("cloning: %s", id);
            if (this[id] !== undefined) { //JSON.parse breaks at "undefined"
                vo[id] = (JSON.parse(JSON.stringify(this[id])));
            }
        }
        /* deleting properties that should be set to default value on server */
        if (vo.createdAt === undefined || vo.createdAt === null) {
            delete vo.createdAt;
        }
        if (vo.updatedAt === undefined || vo.updatedAt === null) {
            delete vo.updatedAt;
        }
        if (vo.state == VO.STATE_LOCAL) {
            delete vo._id;
        }
        /* deleting local-frontend parameters */
        delete vo.state;
        return vo;
    };
    VO.STATE_LOCAL = "STATE_LOCAL";
    VO.STATE_NON_SYNCED = "STATE_NON_SYNCED";
    VO.STATE_SYNCED = "STATE_SYNCED";
    VO.MaxId = 0;
    return VO;
}());
exports.VO = VO;
