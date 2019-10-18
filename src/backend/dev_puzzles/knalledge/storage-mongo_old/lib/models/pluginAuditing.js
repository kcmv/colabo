// pluginAuditing.js
module.exports = exports = function pluginAuditing(schema, options) {
  schema.add({ createdAt: { type: Date, default: Date.now } });
  schema.add({ updatedAt: { type: Date, default: Date.now } });

  schema.pre("save", updateDate);

  schema.pre("update", function(next) {
    console.log("[models/pluginAuditing/schema.pre('update')]"); //TODO: fix and check why this is not called??!
    //this.bio = "Quis ac, aenean egestas?";
    this.updatedAt = new Date();
    next();
  });

  // schema.pre('update', updateDateQuery); //ORIGINAL VERSION, ACCORDING TO DOCUMENTATION
  // schema.post('update', updateDateQueryTest);
  //TODO: for 'findOneAndUpdate':
  //schema.pre('findAndModify',updateDateQuery);

  function updateDate(next) {
    console.log("[models/pluginAuditing / schema.pre('save', updateDate)]");
    this.updatedAt = new Date();
    next();
  }

  function updateDateQuery() {
    console.log("[models/pluginAuditing/updateDateQuery]");
    //this.updatedAt = new Date();
  }

  function updateDateQueryTest() {
    console.log("[models/pluginAuditing/updateDateQueryTest]");
  }
};
