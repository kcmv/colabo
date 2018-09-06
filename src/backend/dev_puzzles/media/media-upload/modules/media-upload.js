"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require('multer');
function resSendJsonProtected(res, data) {
    // http://tobyho.com/2011/01/28/checking-types-in-javascript/
    if (data !== null && typeof data === 'object') {
        res.set('Content-Type', 'application/json');
        // JSON Vulnerability Protection
        // http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
        // https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
        res.send(")]}',\n" + JSON.stringify(data));
    }
    else if (typeof data === 'string') {
        res.send(data);
    }
    else {
        res.send(data);
    }
}
;
class MediaUpload {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    post(callback = null) {
        console.log("[upload] req.file: %s", JSON.stringify(this.req.file));
        // this.req.file is the `avatar` file
        // this.req.body will hold the text fields, if there were any
        MediaUpload.upload.single('avatar')(this.req, this.res, function (err) {
            console.log("[upload:create:upload] this.req.file: %s", JSON.stringify(this.req.file));
            if (err) {
                this.res.json({ error_code: 1, err_desc: err });
                return;
            }
            this.res.json({ error_code: 0, err_desc: null, data: this.req.file });
        }.bind(this));
    }
} // CLASS END
MediaUpload.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        // <local file name> - <datetimestamp>.<original extension>
        var storageFileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        console.log("[upload:create:filename] storageFileName: %s", storageFileName);
        cb(null, storageFileName);
    }
});
MediaUpload.upload = multer({
    // dest: 'uploads/'
    storage: MediaUpload.storage
});
exports.MediaUpload = MediaUpload;
// curl -i -X POST -H "Content-Type: multipart/form-data" -F "avatar=@./info.txt" http://localhost:8001/upload/
// curl -F 'avatar=@./info.txt' http://localhost:8001/upload/
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
function post(req, res) {
    let mediaUpload = new MediaUpload(req, res);
    mediaUpload.post();
}
exports.post = post;
//# sourceMappingURL=media-upload.js.map