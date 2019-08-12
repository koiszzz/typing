var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var UserExtendSchema = Schema({
	no : String,
	name : String,
	certNo : String,
	age : Number
});

UserExtendSchema.virtual('id').get(function(){
	return this._id.toHexString();
});
UserExtendSchema.set('toJSON', {
	virtuals: true
});
UserExtendSchema.set('toObject', {
	virtuals: true
});

var UserExtendModel = mongoose.model('user-extend', UserExtendSchema);

module.exports = UserExtendModel;