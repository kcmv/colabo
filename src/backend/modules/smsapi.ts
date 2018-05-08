//var exports = module.exports = {};

// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));

class SMSApi {

// let CODES = {
// 	HELP: "hlp",
//   REGISTER: "reg",
//   REPLY: "rep"
// };

	constructor(){}

	protected prepareSMS(msg){
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

	protected getCode(sms){
			//sms.substr(0,)
	}

	public create(req, res){
		console.log("[modules/smsapi.js:create] req: %s", req);
		console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
	  console.log('req.body:',req.body);
		var sms = this.prepareSMS(req.body);
	  res.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>");
	}

// app.post("/message", function (req, response) {
//   console.log('req:',req);
//   console.log('response:',response);
//   console.log(req.body);
//   response.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>")
// });

// app.get("/", function (req, response) {
//   console.log('req:',req);
//   console.log('response:',response);
//   response.sendFile(__dirname + '/views/index.html');
// });
//
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
}

// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
export function index(req, res){
		console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req.params));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>')
}
