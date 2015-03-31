/**
 * New node file
 */
var mongoose = require('mongoose');

/* SCHEMA */
var KNodeSchema = mongoose.Schema({
	name: String,
	iAmId: Number,
	activeVersion: { type: Number, default: 1 },
	ideaId: Number,
	version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
	isPublic: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now }, //CHECK AUTOMATIC OPTIONS
	updatedAt: { type: Date, default: Date.now }
	dataContentSerialized: String,
	visual: {
		isOpen: { type: Boolean, default: false },
		manualX: Number,
		manualY: Number
	}
});

var KNodeModel = mongoose.model('KNode', KNodeSchema);

module.exports = KNodeModel; //then we can use it by: var User = require('./app/models/KNodeModel');

/* connecting */
mongoose.connect('mongodb://localhost/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


/* CRUD */
function create(knodeJSON){ //!!! but do we get object of type KNodeModel
	var knode = new KNodeModel(knodeJSON); //testirati
	
	knode.save(function(err) {
		if (err) throw err;
	});
}

function update(knode){
	
}

/*
userSchema.pre('save', function(next) {
	  // get the current date
	  var currentDate = new Date();
	  
	  // change the updated_at field to current date
	  this.updated_at = currentDate;

	  // if created_at doesn't exist, add to that field
	  if (!this.created_at)
	    this.created_at = currentDate;

	  next();
	});
*/

function read(id){
	
	//return KNodeModel.findById(id).exec().onResolve
	
	return KNodeModel.findById(id, function (err, knode) {
		if (err) throw err;
		else return knode;
	});
}

exports.index = function(req, res){
	//to repack data? 
	return read(req.params.searchParam);
}

function delete(id){
	
}
