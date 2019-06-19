import { ColaboFlowGoActionHostClient} from '../index';

import { ActionExecuteRequestInterface, ActionExecuteRequestClass } from '@colabo-flow/i-go';

// test python
let socketUrl:string = "localhost:50801";
// check-credentials @ ACE
// let socketUrl: string = "localhost:50901";
let colaboFlowGoActionHostClient: ColaboFlowGoActionHostClient = new ColaboFlowGoActionHostClient(socketUrl);

let actionExecuteRequest: ActionExecuteRequestClass = new ActionExecuteRequestClass();
actionExecuteRequest.name = 'search-sounds';
// actionExecuteRequest.name = 'check-authorization';

function finished(error, result) {
    if (!error){
        console.log("[demo::finished] Result: ", result);
    }
}

colaboFlowGoActionHostClient.executeAction(actionExecuteRequest, finished);