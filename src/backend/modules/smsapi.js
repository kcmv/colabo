"use strict";
exports.__esModule = true;
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var coLaboArthonService_1 = require("../services/coLaboArthonService");
var SERVER_IN_TESTING_MODE = true;
var REPLY_MAX_WORDS = 30;
var CODE_LENGTH = 3;
var CODE_DELIMITER = ' ';
var CODES;
(function (CODES) {
    CODES["WRONG_CODE"] = "ERR";
    CODES["HELP"] = "HLP";
    CODES["REGISTER"] = "REG";
    CODES["REPLY"] = "REP";
    CODES["UNSUBSCRIBE"] = "UNS"; //TODO: to support the unsubscribe message
})(CODES || (CODES = {}));
var PUSH_MESSAGES;
(function (PUSH_MESSAGES) {
    PUSH_MESSAGES["PROMPT_REPLY"] = "We still haven't received your reply on a poetic prompt. Please, write a reply on one of the 3 prompts."; //TODO set up time for reply
})(PUSH_MESSAGES || (PUSH_MESSAGES = {}));
var HELP_MESSAGES;
(function (HELP_MESSAGES) {
    HELP_MESSAGES["REGISTER"] = "REG your_name your_occupation";
    HELP_MESSAGES["REPLY"] = "REP prompt_ID your_verse";
})(HELP_MESSAGES || (HELP_MESSAGES = {}));
var RESPONSE_MESSAGES;
(function (RESPONSE_MESSAGES) {
    RESPONSE_MESSAGES["TEST_MODE"] = "Please wait. The 'Poesia in strada - Collaborazione poetica sui rifugiati' starts at 22:15, May, 12th";
})(RESPONSE_MESSAGES || (RESPONSE_MESSAGES = {}));
var LANGUAGES;
(function (LANGUAGES) {
    LANGUAGES["EN"] = "EN";
    LANGUAGES["IT"] = "IT";
})(LANGUAGES || (LANGUAGES = {}));
var NUMBERS_FOR_TESTING_MODE = [
    '+381628317008', '+381642830738', '+385989813852',
    '+385996706742' //Sasa
];
var SMSApi = /** @class */ (function () {
    function SMSApi(twimlBody) {
        this.lang = LANGUAGES.IT;
        this.coLaboArthonService = new coLaboArthonService_1.CoLaboArthonService();
        this.twimlBody = twimlBody;
        // console.log('twimlBody.From',twimlBody.From);
        // console.log('typeof twimlBody.From', typeof twimlBody.From);
        this.phoneNoFrom = twimlBody.From.replace(" ", "");
        this.phoneNoTo = twimlBody.To.replace(" ", "");
        this.smsTxt = twimlBody.Body;
        this.prepareSMS();
    }
    SMSApi.prototype.getCodesString = function () {
        //TODO: make it genereates it dynamically:
        return "reg rep hlp";
    };
    SMSApi.prototype.prepareSMS = function () {
        //changing all the multiple empty spaces into one empty space
        //if we also want to cover tabs, newlines, etc, then:
        // this.smsTxt = this.smsTxt.replace(/\s\s+/g, ' ');
        //but so far we want to cover only spaces (and thus not tabs, newlines, etc), so we do:
        this.smsTxt = this.smsTxt.replace(/  +/g, ' ');
        if (typeof this.smsTxt === 'string') {
            //console.log('sms is string');
            this.smsTxt = this.smsTxt.trim();
        }
        else {
            console.error('prepareSMS::type:', typeof this.smsTxt);
            console.error('prepareSMS::sms:', this.smsTxt);
        }
        this.extractCode();
    };
    SMSApi.prototype.extractCode = function () {
        this.code = this.smsTxt.substr(0, CODE_LENGTH).toUpperCase();
        if (this.smsTxt.substr(CODE_LENGTH, 1) !== CODE_DELIMITER) {
            console.error('wrong delimiter:', this.smsTxt.substr(CODE_LENGTH, 1));
            this.code = CODES.WRONG_CODE;
        }
        /* doesn't work with string enums:
        if (!(this.code in CODES)) {
            this.code = CODES.WRONG_CODE;
        }
        */
        if (this.code != CODES.REGISTER && this.code != CODES.REPLY && this.code != CODES.HELP && this.code != CODES.UNSUBSCRIBE) {
            this.code = CODES.WRONG_CODE;
        }
        console.log('code:', this.code);
    };
    SMSApi.prototype.processRequest = function (callback) {
        var responseMessage;
        //TODO: if this is not the REGISTER code, than to check if the sender is regeistered. If not, send him reply to register first
        console.log("[processRequest] this.code: ", this.code);
        switch (this.code) {
            case CODES.REGISTER:
                console.log("[processRequest] registering ...");
                var result = this.registerParticipant(callback);
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
                responseMessage = "You have sent the wrong code. Available codes: " + this.getCodesString();
                //TODO: make it like below, so that the original sent code is contained in message and not like this: "Wrong code 'ERR'. Available codes: reg rep hlp"
                // responseMessage = `Wrong code '${this.code}'. Available codes: ${this.getCodesString()}`;
                break;
        }
        return responseMessage;
    };
    /**
    example:

    */
    SMSApi.prototype.registerParticipant = function (callback) {
        //TODO: cover situation where they used ENTER instead of " " as a delimiter
        console.log('registerParticipant:', this.smsTxt);
        var endOfNameI = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH + 1);
        var name = this.smsTxt.substring(CODE_LENGTH + 1, endOfNameI);
        console.log("name:", name);
        var occupation = this.smsTxt.substring(endOfNameI + 1);
        console.log("occupation:", occupation);
        //TODO: check if the participant is already registered - to avoid creation of a double entry
        //TODO: memorizing the participant:
        var result = this.coLaboArthonService.saveParticipant(name, occupation, this.phoneNoFrom, participantRegeistered);
        function participantRegeistered(kNode, err) {
            if (err === null) {
                callback("Successful registration. Your ID is: " + kNode._id, null);
            }
            else {
                callback("There was a problem with registration. Please try again and check your SMS format", err);
            }
        }
        return result;
        // return true;
    };
    /**
        SMS format: REP  ID_of_the_prompt  your_verse
    */
    SMSApi.prototype.processParticipantsReply = function (callback) {
        var endOfID = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH + 1);
        var referenceId = Number(this.smsTxt.substring(CODE_LENGTH + 1, endOfID));
        console.log("referenceId:", referenceId);
        var reply = this.smsTxt.substring(endOfID + 1);
        console.log("reply:", reply);
        //TODO: check if the reply exceeds the REPLY_MAX_WORDS
        //TODO: !!! set iAmid based on the user found by the this.phoneNoFrom (of this reply message)
        //TODO: check if the referenceId exists!:
        //TODO: manage "\n" in the SMSs with Enters
        var result = this.coLaboArthonService.saveReply(referenceId, reply, this.phoneNoFrom, replyProcessed);
        //TODO return the ID of his new reply to the participant (so he might share it with someone)
        function replyProcessed(msg, err) {
            if (err === null) {
                //TODO support name of the sender in the response message
                callback(msg, null);
            }
            else {
                callback(msg, err);
            }
        }
        return true;
    };
    return SMSApi;
}()); // CLASS END
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/smsapi/index
// curl -v -H "Content-Type: application/json" -X GET http://api.colabo.space/smsapi/index
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
function index(req, res) {
    console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req.params));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>');
}
exports.index = index;
function create(req, res) {
    //console.log("[modules/smsapi.js:create] req: %s", req);
    //console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
    console.log('req.body:', req.body);
    var smsApi = new SMSApi(req.body);
    console.log('smsApi.smsTxt:', smsApi.smsTxt);
    var responseMessage = 'CoLaboArthon: ';
    console.log("[create] smsApi.code: ", smsApi.code);
    function sendMessage(msg) {
        console.log('responseMessage:', responseMessage);
        var twiml = new MessagingResponse();
        twiml.message(responseMessage); // + result)
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
    function processedRequest(msg, err) {
        if (err)
            console.error(err);
        console.log("[smsapi:processedRequest] msg", msg); //id:%s, knode data: %s", knode._id, JSON.stringify(knode));
        responseMessage += msg;
        sendMessage(msg);
    }
    ;
    //responseMessage =
    if (SERVER_IN_TESTING_MODE) {
        console.warn("SERVER_IN_TESTING_MODE");
        if (NUMBERS_FOR_TESTING_MODE.indexOf(smsApi.phoneNoFrom) > -1) {
            responseMessage += "TST_MOD:";
            smsApi.processRequest(processedRequest);
        }
        else {
            sendMessage(RESPONSE_MESSAGES.TEST_MODE);
        }
    }
    else {
        smsApi.processRequest(processedRequest);
    }
}
exports.create = create;
