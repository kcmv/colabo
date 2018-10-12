var nodemailer = require("nodemailer");
var nodemailerMustache = require('nodemailer-mustache');
var path = require("path");
var sleep = require('sleep');

var sleep_time = 10000; // msec

var smtpTransport = nodemailer.createTransport({
		service: "gmail",  // sets automatically host, port and connection security settings
		auth: {
				user: "collaboscience@gmail.com",
				pass: ""
		}
});

var templatePath = path.resolve(__dirname +'/templates');
console.log("templatePath: %s", templatePath);
// Use the plugin with the Nodemailer transport instance.
smtpTransport.use('compile', nodemailerMustache({
  viewPath: templatePath,
  extName: 'html'
}));

// var subject = "TNC Online Dialogue - Choreographed co-creation and call for action";
// var subject = "TNC test - 9";
var subject = "TNC Online Dialogue -  Call for action -> Choreographed co-creation";

var from = "'CollaboScience' <collaboscience@gmail.com>";
var contacts = 
[
	// {name: "Annika Rockenberger", email: "annika.rockenberger@ilos.uio.no", id: "55690bdad4c636c6847640c8"},
	// {name: "Sasha Rudan", email: "mprinc@gmail.com", id: "556760847125996dc1a4a241"},
	// {name: "Sinisa Rudan", email: "sinisa.rudan@gmail.com", id: "556760847125996dc1a4a24f"},
	// {name: "Aleksandar Tomic", email: "aleksandartomic@hotmail.com", id: "556760847125996dc1a4a20f"},
	// {name: "Allen Byerly", email: "allen@tritl.com", id: "556760847125996dc1a4a210"},
	// {name: "Alf Martin Johansen", email: "amj@inductsoftware.com", id: "556760847125996dc1a4a211"},
	// {name: "", email: "ancudinca@yahoo.com", id: "556760847125996dc1a4a212"},
	// {name: "", email: "boris.mih53@gmail.com", id: "556760847125996dc1a4a213"},
	// {name: "Branka Perovic", email: "branka@brankaperovic.com", id: "556760847125996dc1a4a214"},
	// {name: "Skorc Bojana", email: "bskorc@yahoo.com", id: "556760847125996dc1a4a215"},
	// {name: "Carsten Cierniak", email: "ccern@web.de", id: "556760847125996dc1a4a216"},
	// {name: "Aleksandar Cikaric", email: "cikaric@gmail.com", id: "556760847125996dc1a4a217"},
	// {name: "Robert Stephenson", email: "collaborob@gmail.com", id: "556760847125996dc1a4a218"},
	// {name: "CollaboScience", email: "collaboscience@gmail.com", id: "556760847125996dc1a4a219"},
	// {name: "Petar Papuga", email: "daofa7@gmail.com", id: "556760847125996dc1a4a21a"},
	// {name: "David Price", email: "david.price@debategraph.org", id: "556760847125996dc1a4a21b"},
	// {name: "Dino Karabeg", email: "dino.karabeg@gmail.com", id: "556760847125996dc1a4a21c"},
	// {name: "David Peat", email: "dpeat@fdavidpeat.com", id: "556760847125996dc1a4a21d"},
	// {name: "Jasmina Maric", email: "dpkreculj@yahoo.com", id: "556760847125996dc1a4a21e"},
	// {name: "Peter Dinic", email: "dr.dinic@yahoo.com", id: "556760847125996dc1a4a21f"},
	// {name: "", email: "dragan777@gmail.com", id: "556760847125996dc1a4a220"},
	// {name: "", email: "dragandmc@gmail.com", id: "556760847125996dc1a4a221"},
	// {name: "Dragica Kopjar", email: "dragica.kopjar@gmail.com", id: "556760847125996dc1a4a222"},
	// {name: "Drenka Dobrosavljevic", email: "drenka.dobro@gmail.com", id: "556760847125996dc1a4a223"},
	// {name: "Nina Bulajic", email: "drninabulajic@gmail.com", id: "556760847125996dc1a4a224"},
	// {name: "Erol Karabeg", email: "erol.karabeg@authoritypartners.com", id: "556760847125996dc1a4a225"},
	// {name: "Fea Munizaba", email: "farfej@gmail.com", id: "556760847125996dc1a4a226"},
	// {name: "Fredrik Eive Refsli", email: "fredrik.refsli@nkh.no", id: "556760847125996dc1a4a227"},
	// {name: "Frode Hegland", email: "frode@liquid.info", id: "556760847125996dc1a4a228"},
	// {name: "", email: "georgeflorea@tehnorob.ro", id: "556760847125996dc1a4a229"},
	// {name: "", email: "gorana.bmk@gmail.com", id: "556760847125996dc1a4a22a"},
	// {name: "Sovilj Mirjana", email: "iefpgmir@gmail.com", id: "556760847125996dc1a4a22b"},
	// {name: "Dejan Rakovic", email: "info@dejanrakovic.com", id: "556760847125996dc1a4a22c"},
	// {name: "Ingela Teppy Flatin", email: "ingelaflatin@yahoo.no", id: "556760847125996dc1a4a22d"},
	// {name: "", email: "irinej.papuga@gmail.com", id: "556760847125996dc1a4a22e"},
	// {name: "Jack Park", email: "jackpark@topicquests.org", id: "556760847125996dc1a4a22f"},
	// {name: "Jasmina Masovic", email: "jasmina.masovic@yahoo.com", id: "556760847125996dc1a4a230"},
	// {name: "John Field", email: "johnfield2000@yahoo.co.uk", id: "556760847125996dc1a4a231"},
	// {name: "", email: "jovankukac@yahoo.com", id: "556760847125996dc1a4a232"},
	// {name: "Kennan Salinero", email: "kennan@yamanascience.org", id: "556760847125996dc1a4a233"},
	// {name: "Kim Chandler McDonald", email: "kim@kimmic.com", id: "556760847125996dc1a4a234"},
	// {name: "Lazar Kovacevic", email: "lakinekaki@gmail.com", id: "556760847125996dc1a4a235"},
	// {name: "Leah MacVie", email: "leah@leahmacvie.com", id: "556760847125996dc1a4a236"},
	// {name: "Ljerka Koncar", email: "ljerka.koncar@gmail.com", id: "556760847125996dc1a4a237"},
	// {name: "", email: "ljuluk@orion.rs", id: "556760847125996dc1a4a238"},
	// {name: "Marcel Verwei", email: "marcelverwei@hotmail.com", id: "556760847125996dc1a4a239"},
	// {name: "Magnus Lien", email: "mgns87@gmail.com ", id: "556760847125996dc1a4a23a"},
	// {name: "", email: "milabster@gmail.com", id: "556760847125996dc1a4a23b"},
	// {name: "Miloje Rakocevic", email: "milemirkov@gmail.com", id: "556760847125996dc1a4a23c"},
	// {name: "Mira Sonjic Radic", email: "mira.sonjicradic@gmail.com", id: "556760847125996dc1a4a23d"},
	// {name: "", email: "mirko11ostojic@gmail.com", id: "556760847125996dc1a4a23e"},
	// {name: "", email: "miroroz@gmail.com", id: "556760847125996dc1a4a23f"},
	// {name: "Mei Lin Fung", email: "mlf@alum.mit.edu", id: "556760847125996dc1a4a240"},
	// {name: "Miodrag Novakovic", email: "mrjnovakovic@yahoo.com", id: "556760847125996dc1a4a242"},
	// {name: "Marko Vucinic", email: "mvucinic@gmail.com", id: "556760847125996dc1a4a243"},
	// {name: "", email: "nduca@beotel.rs", id: "556760847125996dc1a4a244"},
	// {name: "Vladimir Jovanovic", email: "niki89@eunet.rs", id: "556760847125996dc1a4a245"},
	// {name: "", email: "parispetrovski75@gmail.com", id: "556760847125996dc1a4a246"},
	// {name: "Pavel Luksha", email: "pavel.luksha@gmail.com", id: "556760847125996dc1a4a247"},
	// {name: "Marijana Putovic", email: "putovicmarijana@gmail.com", id: "556760847125996dc1a4a248"},
	// {name: "Ramon Sanguesa", email: "ramonsang@gmail.com", id: "556760847125996dc1a4a249"},
	// {name: "Renata Baćić", email: "renata.bacic@europe.hr", id: "556760847125996dc1a4a24a"},
	// {name: "Rozalia Forai", email: "rozaliaforai@gmail.com", id: "556760847125996dc1a4a24b"},
	// {name: "Sam Hahn", email: "s@mhahn.com", id: "556760847125996dc1a4a24c"},
	// {name: "", email: "sanja.novisnovi@gmail.com", id: "556760847125996dc1a4a24d"},
	// {name: "Sarah Verwei", email: "sarahverwei@gmail.com", id: "556760847125996dc1a4a24e"},
	// {name: "Dusan Pavlovic", email: "sofi123@open.telekom.rs", id: "556760847125996dc1a4a250"},
	// {name: "Stanley Gould", email: "stanleygould@gmail.com", id: "556760847125996dc1a4a251"},
	// {name: "", email: "teslinariznica@gmail.com", id: "556760847125996dc1a4a252"},
	// {name: "Alexander Laszlo", email: "thelasz@me.com", id: "556760847125996dc1a4a253"},
	// {name: "Timour Shchoukine", email: "timurid@gmail.com", id: "556760847125996dc1a4a254"},
	// {name: "Thomas Moroz", email: "tjmoroz@gmail.com", id: "556760847125996dc1a4a255"},
	// {name: "Tristan Bumm", email: "tristanb@student.hf.uio.no", id: "556760847125996dc1a4a256"},
	// {name: "Vera Stanojevic", email: "verasw@me.com", id: "556760847125996dc1a4a257"},
	// {name: "Vitomir Vukomanovic", email: "vitomirvukomanovic@gmail.com", id: "556760847125996dc1a4a258"},
	// {name: "Bernard Carlson", email: "wc4p@virginia.edu", id: "556760847125996dc1a4a259"},
	// {name: "", email: "z.bojkovic@yahoo.com", id: "556760847125996dc1a4a25a"},
	// {name: "Eugenia Kelbert", email: "zhenia.kel@gmail.com", id: "556760847125996dc1a4a25b"},
	// {name: "", email: "zstevic@etf.rs", id: "556760847125996dc1a4a25c"},
	// {name: "Sasha Rudan", email: "mprinc@gmail.com", id: "556760847125996dc1a4a241"},
	// {name: "Sinisa Rudan", email: "sinisa.rudan@gmail.com", id: "556760847125996dc1a4a24f"}
];

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
		sendMail(smtpTransport, from, subject, contact, contactId);

		setTimeout(sendMails, sleep_time, contactId+1);
	}else{
		console.info("Reached the last contact [contactId:%d], finishing", contactId-1);
	}
};

console.log("-------------------------------------");
console.log("Sending %d contacts", contacts.length);
console.log("-------------------------------------");
sendMails();