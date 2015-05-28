var nodemailer = require("nodemailer");
var nodemailerMustache = require('nodemailer-mustache');
var path = require("path");
var sleep = require('sleep');

var sleep_time = 10000; // msec

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
var subject = "TNC test - 9";
var from = "'CollaboScience' <collaboscience@gmail.com>";
var contacts = [
	{name: "Sasha Rudan", email: "mprinc@gmail.com", id: "556760847125996dc1a4a241"},
	{name: "CollaboScience", email: "collaboscience@gmail.com", id: "556760847125996dc1a4a219"},
	{name: "Sinisa Rudan", email: "sinisa.rudan@gmail.com", id: "556760847125996dc1a4a24f"}
]

var sendMail = function(smtpTransport, from, subject, contact, id){
	var mailOptions = {
			from: from, // sender address.  Must be the same as authenticated user if using Gmail.
			to: contact.emailFull, // receiver
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
					console.log("Message sent [i:%d, %s]: %s", id, contact.emailFull, info.response);
			}

			// smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
	});
};

var sendMails = function(contactId){
	if(typeof contactId == 'undefined') contactId = 0;

	if(contactId<contacts.length){
		var contact = contacts[contactId];
		contact.emailFull = contact.name + " <" + contact.email + ">";
		if(typeof contact.token == 'undefined' || !contact.token) contact.token = 5;

		console.info("Sending mail [contactId:%d]: %s", contactId, contact.emailFull);
		sendMail(smtpTransport, from, subject, contact, contactId+1);

		setTimeout(sendMails, sleep_time, contactId+1);
	}
};

sendMails();