// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));

var CODES = {
	HELP: "hlp",
  REGISTER: "reg",
  REPLY: "rep"
};

function prepareSMS(msg){
	var sms = msg.sms;
	if (typeof sms === 'string') {
		console.log('sms is string');

	}
	else{
		console.log('type:', typeof sms);
		console.log('sms:', sms);
	}

	return sms.trim();
}

function getCode(sms){
		//sms.substr(0,)
}

// curl -v -XPOST -H "Content-type: application/json" -d '{"sms": "from: +381 64 2830738; body:reg. Sinisa Rudan. poet"}' 'http://127.0.0.1:8001/smsapi'
exports.create = function(req, res){
	console.log("[modules/smsapi.js:create] req: %s", req);
	console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
  console.log('req.body:',req.body);
	var sms = prepareSMS(req.body);
  res.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>");
}

// app.post("/message", function (req, response) {
//   console.log('req:',req);
//   console.log('response:',response);
//   console.log(req.body);
//   response.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>")
// });

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/smsapi
exports.index = function(req, res){
		console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>');
}

// app.get("/", function (req, response) {
//   console.log('req:',req);
//   console.log('response:',response);
//   response.sendFile(__dirname + '/views/index.html');
// });
//
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
