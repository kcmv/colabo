// pluginAuditing.js
export function pluginAuditing(schema, options) {
  schema.add({ createdAt: { type: Date, default: Date.now } });
  schema.add({ updatedAt: { type: Date, default: Date.now } });

  /*
  schema.pre("update", updateDateQuery); //ORIGINAL VERSION, ACCORDING TO DOCUMENTATION
  schema.post("update", updateDateQueryPost);
  schema.pre("save", onSaveDate);
*/

  //TODO: for 'findOneAndUpdate':
  //schema.pre('findAndModify',updateDateQuery);

  function updateDateQuery() {
    // console.log("[models/pluginAuditing/ updateDateQuery]");
    this.updatedAt = new Date();
    // console.log("this.updatedAt", this.updatedAt);
    // console.log("this", this);
  }

  function updateDateQueryPost() {
    // console.log("[models/pluginAuditing/updateDateQueryPost]");
    this.updatedAt = new Date();
  }

  function onSaveDate(next) {
    // console.log("[models/pluginAuditing / onSaveDate]");
    this.updatedAt = new Date();
    next();
  }
}
