var express = require('express')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var http = require('http')


var app = express()

var portHttp = process.argv[2] || process.env.PORT || 8888;

app.configure(function() {
    app.set('port', portHttp);
});

app.post('/upload', upload.single('avatar'), function(req, res, next) {
    console.log("[upload] req.file: %s", req.file);
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

})

app.post('/photos/upload', upload.array('photos', 12), function(req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    res.json({ error_code: 0, err_desc: null });
})

// node upload-test.js 8001
// curl -i -X POST -H "Content-Type: multipart/form-data" -F "avatar=@./test.txt" http://localhost:8001/upload/
// curl -F 'avatar=@./test.txt' http://localhost:8001/upload/

http.createServer(app).listen(app.get('port'), function() {
    console.log("Listening on " + app.get('port'));
});