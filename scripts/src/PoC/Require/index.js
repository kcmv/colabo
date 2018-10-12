(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';


/* 

https://github.com/visionmedia/debug
https://www.npmjs.com/package/debug

browserify
https://github.com/substack/node-browserify
https://github.com/substack/browserify-handbook
http://browserify.org/#install

cd Require
browserify require-list.js -o bundle.js
<script src="bundle.js"></script>

http://stackoverflow.com/questions/15133879/shim-a-module-in-require-js-that-uses-module-exports-possible
http://stackoverflow.com/questions/23603514/javascript-require-function-giving-referenceerror-require-is-not-defined
http://developer.telerik.com/featured/planning-front-end-javascript-application/
http://requirejs.org/docs/start.html
*/

console.warn("Helo");
//window.myDebug = require("debug");
myDebug.enable("worker:b")
myDebug.disable("worker:a")
var a = myDebug('worker:a');
var b = myDebug('worker:b');
var c = myDebug('worker:b');

setInterval(function(){
  a('doing some work');
  c('c: doing some work');
}, 1000);
 
setInterval(function(){
  b('b: doing some work');
  c('c: doing some work');
}, 1200);

console.warn("Init Done");

}()); // end of 'use strict';