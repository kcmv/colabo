'use strict';

/**
 * New node file
 */
var deepAssign = require('deep-assign');
//var Promise = require("bluebird");

var mockup = { fb: { authenticate: false }, db: { data: false } };
var accessId = 0;

var multer = require('multer');
var dbService = require('@colabo-knalledge/knalledge-storage-mongo/dbService');
var dbConnection = dbService.connect();

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


var KNodeModel = dbConnection.model('KNode', global.db.kNode.Schema);

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        // <local file name> - <datetimestamp>.<original extension>
        var storageFileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        console.log("[upload:create:filename] storageFileName: %s", storageFileName);
        cb(null, storageFileName);
    }
});

var upload = multer({ //multer settings
    // dest: 'uploads/'
    storage: storage
}).single('avatar');

// curl -i -X POST -H "Content-Type: multipart/form-data" -F "avatar=@./test.txt" http://localhost:8001/upload/
// curl -F 'avatar=@./test.txt' http://localhost:8001/upload/

exports.create = function(req, res) {
    console.log("[upload:create] req.file: %s", req.file);
    upload(req, res, function(err) {
        console.log("[upload:create:upload] req.file: %s", res.file);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    });
}