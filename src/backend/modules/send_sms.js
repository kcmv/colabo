// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'AC3ce3ec0158e2b2f0a6857d973e42c2f1';
const authToken = 'bb351db9b14d7e54f93e31b9e92d1574';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'CoLaboArthon - Hi!',
     from: '+447480487843',
     to: '+381642830738'
   })
  .then(function(message) {console.log(message.sid);})
  //.then(message => console.log(message.sid))
  .done();
