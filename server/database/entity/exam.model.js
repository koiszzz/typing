var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var ExamSchema = Schema({
	name : String,
	startTime : Date,
	endTime: Date,
	timeLength : Number,
	articleId : String,
	articleName: String,
	articleType: String,
	cmId: String,
	cmName: String,
	limitIpStart : String,
	limitIpEnd : String,
	status: {type: String, default: '初始化'},
	creator: String,
	CreateTime: {type: Date, default: Date.now()}
});

ExamSchema.virtual('id').get(function(){
	return this._id.toHexString();
});
ExamSchema.virtual('limitIp').get(function () {
	let ip = '';
	if (this.limitIpStart && this.limitIpStart.length > 0) {
		ip += this.limitIpStart;
	} else {
		ip += '~';
	}
	ip += ' - ';
	if (this.limitIpEnd && this.limitIpEnd.length > 0) {
		ip += this.limitIpEnd;
	} else {
		ip += '~';
	}
	return ip;
});
ExamSchema.set('toJSON', {
	virtuals: true
});
ExamSchema.set('toObject', {
	virtuals: true
});

var ExamModel = mongoose.model('exam', ExamSchema);

module.exports = ExamModel;
