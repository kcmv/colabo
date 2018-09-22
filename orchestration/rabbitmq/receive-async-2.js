#!/usr/bin/env node

let chalk = require('chalk');
var amqp = require('amqplib');
let url = 'amqp://localhost';
var q = 'hello';
let debug = true;

var open = require('amqplib').connect('amqp://localhost');

async function receiveMsg(){
  return new Promise(async (resolve, reject) => {
    try{
      // Consumer
      let conn = await amqp.connect(url);
      // if(debug) console.log("Conn: ", conn);
      let ch = await conn.createChannel();
      // if(debug) console.log("ch: ", ch);
      await ch.assertQueue(q, {durable: false});
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

      // let msg = await ch.consume(q);
      // if (msg !== null){
      //   console.log(JSON.stringify(msg));
      //   if(msg.content) console.log(msg.content.toString());
      //   ch.ack(msg);
      // }

      return ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });

      // let conn = await amqp.connect(url);
      // // if(debug) console.log("Conn: ", conn);
      // let ch = await conn.createChannel();
      // // if(debug) console.log("ch: ", ch);
      // await ch.assertQueue(q, {durable: false});
      // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

      // let msg = ch.consume(q, {noAck: false});
      // // console.log(" [x] Received %s", msg.content.toString());
      // console.log(" [x] Received %s", JSON.stringify(msg));

      // // ch.consume(q, function(msg) {
      // //   console.log(" [x] Received %s", msg.content.toString());
      // // }, {noAck: false});
    }catch(err){
      reject("There was a problem sending the message: " + err);
    }
  });
}

receiveMsg()
    .then(result => console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), 'action', result))
    .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), 'action', error));
