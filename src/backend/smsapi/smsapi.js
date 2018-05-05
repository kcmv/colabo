var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.post("/message", function (request, response) {
  console.log('request:',request);
  console.log('response:',response);
  console.log(request.body);
  response.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>")
});

app.get("/", function (request, response) {
  console.log('request:',request);
  console.log('response:',response);
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
