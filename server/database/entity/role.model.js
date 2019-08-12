var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var RoleSchema = Schema({
	no : String,
	roleName : String,
	creator : String,
	createTime : Date
});

RoleSchema.virtual('id').get(function(){
	return this._id.toHexString();
});
RoleSchema.set('toJSON', {
	virtuals: true
});
RoleSchema.set('toObject', {
	virtuals: true
});

var RoleModel = mongoose.model('role', RoleSchema);

module.exports = RoleModel;