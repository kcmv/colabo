module.exports = function(app) {
    console.log("[puzzle(knalledge/core) - /models/index.js] Registering KnAllEdge core API to: ", app);

    var knodes = app.resource('knodes', require('./modules/kNode'), { id: 'type?/:actionType?/:searchParam?/:searchParam2?' });
    var kedges = app.resource('kedges', require('./modules/kEdge'), { id: 'type?/:searchParam?/:searchParam2?' });
    var kmaps = app.resource('kmaps', require('./modules/kMap'), { id: 'type?/:searchParam?/:searchParam2?' });
}