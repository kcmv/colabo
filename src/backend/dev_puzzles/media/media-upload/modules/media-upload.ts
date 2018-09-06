declare var require: any;
declare var global: any;

var multer = require('multer')

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


export class MediaUpload {
	public static storage:any = multer.diskStorage({ //multers disk storage settings
		destination: function(req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
            var datetimestamp = Date.now();
            // <local file name> - <datetimestamp>.<original extension>
            var storageFileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            console.log("[MediaUpload:storage:filename] storageFileName: %s", storageFileName);
            cb(null, storageFileName);
        }
	});
	public static upload:any = multer({ //multer settings
        // dest: 'uploads/'
        storage: MediaUpload.storage
    });

	constructor(protected req:any, protected res:any){
	}

	post(callback:Function = null){
		console.log("[MediaUpload.post] this.req.file: %s", JSON.stringify(this.req.file));
    
        // this.req.file is the `avatar` file
        // this.req.body will hold the text fields, if there were any

        MediaUpload.upload.single('avatar')(this.req, this.res, function(err) {
            console.log("[MediaUpload.post:upload.single] this.req.file: %s", JSON.stringify(this.req.file));
            if (err) {
                this.res.json({ error_code: 1, err_desc: err });
                return;
            }
            this.res.json({ error_code: 0, err_desc: null, data: this.req.file });
        }.bind(this));
	}
} // CLASS END

// curl -i -X POST -H "Content-Type: multipart/form-data" -F "avatar=@./info.txt" http://localhost:8001/upload/
// curl -F 'avatar=@./info.txt' http://localhost:8001/upload/
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
export function post(req:any, res:any){
	let mediaUpload: MediaUpload = new MediaUpload(req, res);
	mediaUpload.post();
}