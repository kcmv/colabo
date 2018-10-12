declare var require: any;
declare var module: any;

import {MediaUpload, post} from './modules/media-upload';

export function initialize(app) {
    console.log("[puzzle(media/upload) - /models/index.js] Registering KnAllEdge media upload API to: ", app);

    var mediaUpload = app.post('/upload', MediaUpload.upload.single('avatar'), post);
}