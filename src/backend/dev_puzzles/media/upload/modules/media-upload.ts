const MODULE_NAME: string = "@colabo-media/b-upload";

declare var require: any;
declare var global: any;

// https://www.npmjs.com/package/multer
var multer = require('multer')
const fileName:string = 'avatar';
var fs = require('fs');

console.log("[%s] fileName: %s", MODULE_NAME, fileName);

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);

var Jimp = require('jimp');

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
            console.log("[MediaUpload.destination] \n\t req.body: %s \n\t req.params: %s \n\t req.file: %s \n\t file: %s",
                JSON.stringify(req.body), JSON.stringify(req.params), JSON.stringify(req.file), JSON.stringify(file));
                
            // checking tmpUpload folder
            try {
                console.info("checking for the tmpUpload folder '%s'", puzzleConfig.tmpUpload);
                fs.accessSync(puzzleConfig.tmpUpload, fs.constants.F_OK)
            } catch (err) {
                console.info("\t no folder, creating it ...");
                try {
                    fs.mkdirSync(puzzleConfig.tmpUpload, { recursive: true, mode: 0o775});
                    console.info("\t created");
                } catch (err) {
                    console.error("\t Problem with creating the folder '%s'", puzzleConfig.imagesFolder);
                }
            }
            
            // checking imagesFolder folder
            try {
                console.info("checking for the imagesFolder folder '%s'", puzzleConfig.imagesFolder);
                fs.accessSync(puzzleConfig.imagesFolder, fs.constants.F_OK)
            } catch (err) {
                console.info("\t no folder, creating it ...");
                try {
                    fs.mkdirSync(puzzleConfig.imagesFolder, { recursive: true, mode: 0o775 });
                    console.info("\t created");
                } catch (err) {
                    console.error("\t Problem with creating the folder '%s'", puzzleConfig.imagesFolder);
                }
            }
            cb(null, puzzleConfig.tmpUpload);
        },
        filename: function(req, file, cb) {
            console.log("[MediaUpload.filename] \n\t req.body: %s \n\t req.params: %s \n\t req.file: %s \n\t file: %s",
                JSON.stringify(req.body), JSON.stringify(req.params), JSON.stringify(req.file), JSON.stringify(file));

            var datetimestamp = Date.now();
            // <local file name> - <datetimestamp>.<original extension>
            var storageFileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            console.log("[MediaUpload:filename] storageFileName: %s", storageFileName);
            cb(null, storageFileName);
        }
	});
	public static upload:any = multer({ //multer settings
        // dest: puzzleConfig.tmpUpload
        // putSingleFilesInArray
        // https://github.com/expressjs/multer/issues/96
        // https://github.com/expressjs/multer/issues/74
        storage: MediaUpload.storage
    });

	constructor(protected req:any, protected res:any){
        
	}

	post(callback:Function = null){
        let uploadType:string = this.req.body.uploadtype;
        let iAmId:string = this.req.body.iamid;
        console.log("[MediaUpload.post] uploadType: %s, iAmId: %s", uploadType, iAmId);

        // this.req.file is the <fileName> file
        // this.req.body will hold the text fields, if there were any
        // console.log("[MediaUpload.post] this.req.file: %s", JSON.stringify(this.req.file));

        console.log("[MediaUpload.post] \n\t  this.req.body: %s \n\t this.req.params: %s \n\t this.req.file: %s", JSON.stringify(this.req.body),
            JSON.stringify(this.req.params), JSON.stringify(this.req.file));

        MediaUpload.upload.single(fileName)(this.req, this.res, function(err) {
            console.log("[MediaUpload.post:upload.single] \n\t  this.req.body: %s \n\t this.req.params: %s \n\t this.req.file: %s", JSON.stringify(this.req.body),
                JSON.stringify(this.req.params), JSON.stringify(this.req.file));
            if (err) {
                this.res.json({ error_code: 1, err_desc: err });
                return;
            }else{
                var oldPath = this.req.file.path;
                // var oldPathWithoutExtension = oldPath.substring(0, oldPath.lastIndexOf("."));
                var newPath = puzzleConfig.imagesFolder + "/"
                    + uploadType + "-" + iAmId + ".jpg";
                console.log("[MediaUpload.post:upload.single] oldPath: %s \n\t -> newPath: %s", oldPath, newPath);

                // https://www.npmjs.com/package/jimp
                Jimp.read(oldPath)
                    .then(img => {
                        return img
                            // .resize(256, 256) // resize
                            // .quality(60) // set JPEG quality
                            // .greyscale() // set greyscale
                            .write(newPath); // save
                    })
                    .then(() => {
                        this.res.json({ error_code: 0, err_desc: null, data: "Media saved at: " + newPath });
                    })
                    .catch(err => {
                        console.error(err);
                        this.res.json({ error_code: 1, err_desc: err });
                    });
            }
        }.bind(this));
	}
} // CLASS END

// curl -i -X POST -H "Content-Type: multipart/form-data" -F "fileName=@./info.txt" http://localhost:8001/upload/
// curl -F 'fileName=@./info.txt' http://localhost:8001/upload/
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
export function post(req:any, res:any){
	let mediaUpload: MediaUpload = new MediaUpload(req, res);
	mediaUpload.post();
}