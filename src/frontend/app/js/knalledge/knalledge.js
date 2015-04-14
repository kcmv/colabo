//if we are providing a global variables we need to get them out of use-strict-function pattern
var knalledge;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

knalledge = {};

}()); // end of 'use strict';