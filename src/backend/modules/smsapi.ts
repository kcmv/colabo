declare var require: any;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// const CoLaboArthonService = require('../services/coLaboArthonService').CoLaboArthonService;

import {KNode} from '../services/kNode';
import {CoLaboArthonService} from '../services/coLaboArthonService';

const SERVER_IN_TESTING_MODE:boolean =
//false;
true;

const REPLY_MAX_WORDS:number = 30;
const CODE_LENGTH:number = 3;
const CODE_DELIMITER:string = ' ';

enum CODES {
	WRONG_CODE = "ERR",
	HELP = "HLP",
  REGISTER = "REG",
  REPLY = "REP",
	UNSUBSCRIBE = "UNS" //TODO: to support the unsubscribe message
}

enum PUSH_MESSAGES {
	PROMPT_REPLY = "We still haven't received your reply on a poetic prompt. Please, write a reply on one of the 3 prompts." //TODO set up time for reply
}

enum HELP_MESSAGES {
	REGISTER = "REG your_name your_occupation",
	REPLY = "REP prompt_ID your_verse"
}

enum RESPONSE_MESSAGES {
	TEST_MODE = "Please wait. The 'Poesia in strada - Collaborazione poetica sui rifugiati' starts at 22:15, May, 12th"
}

enum LANGUAGES {
	EN = "EN",
	IT = "IT"
}

const NUMBERS_FOR_TESTING_MODE:string[] = [
	'+381628317008','+381642830738','+385989813852', //Sinisa
	'+385996706742'//Sasa
];

class SMSApi {
	public lang:string = LANGUAGES.IT;
	//public lang:string = LANGUAGES.EN;
	protected res:any;
	protected twimlBody:any;
	public phoneNoFrom:string;
	public phoneNoTo:string;
	public smsTxt:string;
	public code:string;
	public coLaboArthonService:CoLaboArthonService;

	constructor(twimlBody:any){
		this.coLaboArthonService = new CoLaboArthonService();
		this.twimlBody = twimlBody;

		// console.log('twimlBody.From',twimlBody.From);
		// console.log('typeof twimlBody.From', typeof twimlBody.From);
		this.phoneNoFrom = twimlBody.From.replace(" ","");
		this.phoneNoTo = twimlBody.To.replace(" ","");
		this.smsTxt = twimlBody.Body;
		this.prepareSMS();
	}

	protected getCodesString():string{
		//TODO: make it genereates it dynamically:
		return "reg rep hlp";
	}

	protected prepareSMS(){
		//changing all the multiple empty spaces into one empty space
		//if we also want to cover tabs, newlines, etc, then:
		// this.smsTxt = this.smsTxt.replace(/\s\s+/g, ' ');
		//but so far we want to cover only spaces (and thus not tabs, newlines, etc), so we do:
		this.smsTxt = this.smsTxt.replace(/  +/g, ' ');

		if (typeof this.smsTxt === 'string') {
			//console.log('sms is string');
			this.smsTxt = this.smsTxt.trim();
		}
		else{
			console.error('prepareSMS::type:', typeof this.smsTxt);
			console.error('prepareSMS::sms:', this.smsTxt);
		}
		this.extractCode();
	}

	protected extractCode():void{
		this.code = this.smsTxt.substr(0,CODE_LENGTH).toUpperCase();
		if(this.smsTxt.substr(CODE_LENGTH,1) !== CODE_DELIMITER){
			console.error('wrong delimiter:',this.smsTxt.substr(CODE_LENGTH,1));
			this.code = CODES.WRONG_CODE;
		}
		/* doesn't work with string enums:
		if (!(this.code in CODES)) {
			this.code = CODES.WRONG_CODE;
		}
		*/

		if(this.code != CODES.REGISTER && this.code != CODES.REPLY && this.code != CODES.HELP && this.code != CODES.UNSUBSCRIBE){
			this.code = CODES.WRONG_CODE;
		}
		console.log('code:',this.code);
	}

	public processRequest(callback:Function):string { //callback back to create
		let responseMessage:string;

		//TODO: if this is not the REGISTER code, than to check if the sender is regeistered. If not, send him reply to register first
		console.log("[processRequest] this.code: ", this.code);
		switch(this.code){
				case CODES.REGISTER:
				console.log("[processRequest] registering ...");
					this.registerParticipant(callback);

					/*TODO: use this!
					if(result){
						//TODO support name of the sender in the response message
						responseMessage = "Welcome to the CoLaboArthon! You've registered successfully ("+result+")";
					}
					else{
						responseMessage = `Sorry! There was an error in your registration. Please, send the SMS in the format: ${HELP_MESSAGES.REGISTER}`;
					}
					*/

				break;
				case CODES.REPLY:
					//TODO CHECK if the participant is not registered yet, tell him to do it first (maybe save his message so that he doesn't have to resend it)
					//TODO CHECK if this is a reply on a PROMPT and then acty differently!
					this.processParticipantsReply(callback);

				break;
				default:
				case CODES.WRONG_CODE:
					let msg = `You have sent a wrong code. Available codes: ${this.getCodesString()}`;
					//TODO: make it like below, so that the original sent code is contained in message and not like this: "Wrong code 'ERR'. Available codes: reg rep hlp"
					// responseMessage = `Wrong code '${this.code}'. Available codes: ${this.getCodesString()}`;
					callback(msg)
				break;
		}
		return responseMessage;
	}

	/**
	example:

	*/
	protected registerParticipant(callback:Function):void{ //calback back to processRequest
		//TODO: cover situation where they used ENTER instead of " " as a delimiter
		console.log('registerParticipant:', this.smsTxt);
		let endOfNameI:number = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH+1);
		let name:string = this.smsTxt.substring(CODE_LENGTH+1,endOfNameI);
		console.log("name:", name);
		let occupation:string = this.smsTxt.substring(endOfNameI+1);
		console.log("occupation:", occupation);

		//TODO: check if the participant is already registered - to avoid creation of a double entry
		//TODO: memorizing the participant:

		this.coLaboArthonService.saveParticipant(name, occupation, this.phoneNoFrom, participantRegeistered);

		function participantRegeistered(kNode:KNode, err:any):void{
			if(err === null){
					callback(`Successful registration. Your ID is: ${kNode.dataContent.humanID}`, null);
			}
			else{
					callback(`There was a problem with registration. Please try again and check your SMS format`, err);
			}
		}
		// return true;
	}

	/**
		SMS format: REP  ID_of_the_prompt  your_verse
	*/
	protected processParticipantsReply(callback:Function):boolean{ //TODO see about the return value
		let endOfID:number = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH+1);
		let referenceId:number = Number(this.smsTxt.substring(CODE_LENGTH+1,endOfID));
		console.log("referenceId:", referenceId);
		let reply:string = this.smsTxt.substring(endOfID+1);
		console.log("reply:", reply);

		//TODO: check if the reply exceeds the REPLY_MAX_WORDS
		//TODO: !!! set iAmid based on the user found by the this.phoneNoFrom (of this reply message)
		//TODO: check if the referenceId exists!:
		//TODO: manage "\n" in the SMSs with Enters
		this.coLaboArthonService.saveReply(referenceId, reply, this.phoneNoFrom, replyProcessed);
		//TODO return the ID of his new reply to the participant (so he might share it with someone)

		function replyProcessed(msg:string, err:any):void{
			if(err === null){
					//TODO support name of the sender in the response message
					callback(msg, null);
			}
			else{
				callback(msg, err);
			}
		}

		return true;
	}
} // CLASS END

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/smsapi/index
// curl -v -H "Content-Type: application/json" -X GET http://api.colabo.space/smsapi/index
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
export function index(req:any, res:any){
		console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req.params));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>')
}

export function create(req:any, res:any){

	//console.log("[modules/smsapi.js:create] req: %s", req);
	//console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
	console.log('req.body:',req.body);
	let smsApi:SMSApi = new SMSApi(req.body);
	console.log('smsApi.smsTxt:', smsApi.smsTxt);

	let responseMessage:string = 'CoLaboArthon: ';

	console.log("[create] smsApi.code: ", smsApi.code);

	function sendMessage(msg:string):void{
		console.log('responseMessage:', responseMessage);
		const twiml = new MessagingResponse();
		responseMessage+=msg;
		twiml.message(responseMessage); // + result)
		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
	}

	function processedRequest(msg:any, err:any) {
		if (err) console.error(err);
		console.log("[smsapi:processedRequest] msg",msg);//id:%s, knode data: %s", knode._id, JSON.stringify(knode));
		sendMessage(msg);
	};

	//responseMessage =
	if(SERVER_IN_TESTING_MODE){
		console.warn(`SERVER_IN_TESTING_MODE`);
		if(NUMBERS_FOR_TESTING_MODE.indexOf(smsApi.phoneNoFrom) > -1){
			responseMessage+="TST_MOD:";
			smsApi.processRequest(processedRequest);
		}
		else{
			sendMessage(RESPONSE_MESSAGES.TEST_MODE);
		}
	}
	else{
			smsApi.processRequest(processedRequest);
	}
}
