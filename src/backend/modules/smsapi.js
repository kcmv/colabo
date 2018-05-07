// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));


exports.create = function(req, res){
	console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
  console.log('request.body:',request.body);
	var data = req.body;
  res.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>");
}

// app.post("/message", function (request, response) {
//   console.log('request:',request);
//   console.log('response:',response);
//   console.log(request.body);
//   response.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>")
// });


exports.index = function(req, res){
		console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>')
}

// app.get("/", function (request, response) {
//   console.log('request:',request);
//   console.log('response:',response);
//   response.sendFile(__dirname + '/views/index.html');
// });
//
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
