var nodemailer = require("nodemailer");
var nodemailerMustache = require('nodemailer-mustache');
var path = require("path");

var smtpTransport = nodemailer.createTransport({
		service: "gmail",  // sets automatically host, port and connection security settings
		auth: {
				user: "collaboscience@gmail.com",
				pass: "0310karlovac91"
		}
});

var templatePath = path.resolve(__dirname +'/templates');
console.log("templatePath: %s", templatePath);
// Use the plugin with the Nodemailer transport instance.
smtpTransport.use('compile', nodemailerMustache({
  viewPath: templatePath,
  extName: 'html'
}));

// var subject = "Choreographed co-creation and call for action - TNC Online Dialogue";
var subject = "TNC test - 5";
var from = "CollaboScience <collaboscience@gmail.com>";
var contacts = [
	{
		name: "Sasa Rudan",
		email: "Sasa Rudan <mprinc@gmail.com>",
		id: "5",
		token: "1"
	},
	{
		name: "Sinisa Rudan",
		email: "Sinisa Rudan <sinisa.rudan@gmail.com>",
		id: "7",
		token: "3"
	},
	{
		name: "Sasha Mile Rudan",
		email: "Sasha Mile Rudan <sasharu@ifi.uio.no>",
		id: "7",
		token: "3"
	}
];

var sendMail = function(smtpTransport, from, subject, contact){
	var mailOptions = {
			from: from, // sender address.  Must be the same as authenticated user if using Gmail.
			to: contact.email, // receiver
			subject: subject, // subject
			template: 'invitation',
			context: contact,
			// text: "Hello from CollaboScience!", // body
			// 	html: "Hello from <b>CollaboScience</b>!" // html body
	};

	smtpTransport.sendMail(mailOptions, function(error, info){  //callback
			if(error){
					return console.log(error);
			}else{
					console.log("Message sent: " + info.response);
			}

			// smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
	});
};

for (var i=0; i<contacts.length; i++){
	var contact = contacts[i];
	sendMail(smtpTransport, from, subject, contact);
}