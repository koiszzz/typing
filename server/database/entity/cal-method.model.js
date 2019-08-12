var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var CalMethodSchema = Schema({
	name : String,
	method : String,
	isUsed : {type: String, default: '否'},
	isDeleted : {type: String, default: '否'},
	createTime : {type: Date, default: Date.now()},
	creator : String
});

CalMethodSchema.virtual('id').get(function(){
	return this._id.toHexString();
});
CalMethodSchema.set('toJSON', {
	virtuals: true
});
CalMethodSchema.set('toObject', {
	virtuals: true
});

var CalMethodModel = mongoose.model('cal-method', CalMethodSchema);

module.exports = CalMethodModel;
