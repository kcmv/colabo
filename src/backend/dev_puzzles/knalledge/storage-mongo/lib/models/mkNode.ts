var mongoose = require("mongoose");

/* SCHEMA */
export var kNodeSchema = mongoose.Schema({
  //think of _id:Number, instead of ObjectId
  name: String,
  type: String,
  mapId: { type: mongoose.Schema.Types.ObjectId, ref: "KMap" },
  iAmId: { type: mongoose.Schema.Types.ObjectId, ref: "WhoAmI" },
  activeVersion: { type: Number, default: 1 },
  ideaId: Number,
  version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
  isPublic: { type: Boolean, default: true },
  dataContent: { type: mongoose.Schema.Types.Mixed },
  up: { type: mongoose.Schema.Types.Mixed },
  decorations: { type: mongoose.Schema.Types.Mixed },
  visual: {
    isOpen: { type: Boolean, default: false },
    xM: Number,
    yM: Number,
    widthM: 0,
    heightM: 0
  }
});

import { pluginAuditing } from "./pluginAuditing";

kNodeSchema.plugin(pluginAuditing, {});

/*
kNodeSchema.pre("update", kNodeSchemaupdateDateQuery); //ORIGINAL VERSION, ACCORDING TO DOCUMENTATION
kNodeSchema.post("update", kNodeSchemaupdateDateQueryPost);
kNodeSchema.pre("save", kNodeSchemaonPreSaveDate);
kNodeSchema.post("save", kNodeSchemaonPostSaveDate);

function kNodeSchemaupdateDateQuery() {
  console.log("[models/pluginAuditing/ kNodeSchemaupdateDateQuery]");
  this.updatedAt = new Date();
  console.log("this.updatedAt", this.updatedAt);
  console.log("this", this);
}

function kNodeSchemaupdateDateQueryPost() {
  console.log("[models/pluginAuditing/kNodeSchemaupdateDateQueryPost]");
  this.updatedAt = new Date();
}

function kNodeSchemaonPreSaveDate(next) {
  console.log("[models/pluginAuditing / kNodeSchemaonPreSaveDate]");
  this.updatedAt = new Date();
  next();
}

function kNodeSchemaonPostSaveDate(next) {
  console.log("[models/pluginAuditing / kNodeSchemaonPostSaveDate]");
  this.updatedAt = new Date();
  next();
}
*/
kNodeSchema.statics.findInMapAfterTime = function(map, time, cb) {
  //console.log('kNodeSchema::findInMapAfterTime: %s, %s (%d)', map, time, time.getTime());
  return this.find(
    { $and: [{ mapId: map }, { updatedAt: { $gt: time } }] },
    cb
  );
};
