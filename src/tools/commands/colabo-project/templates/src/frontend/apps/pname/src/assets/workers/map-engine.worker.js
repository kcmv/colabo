console.log('hello from a webworker');
// addEventListener('message', (message) => {
//     console.log('in webworker', message);
//     postMessage('this is the response ' + message.data);
// });
onmessage = function (e) {
    console.log('Message received from main script: ', e.data);
    var workerResult = 'Result: ' + e.data;
    console.log('Posting message back to main script');
    postMessage(workerResult);
};
//# sourceMappingURL=map-engine.worker.js.map