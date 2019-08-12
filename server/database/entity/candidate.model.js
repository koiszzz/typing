var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var CandidateSchema = Schema({
	name : String,
	no : String,
	instNo : String,
	instName : String,
	certNo : String,
	age : Number,
	ip : String,
	examId: String,
    examName: String,
	content : String,
	articleType: String,
	cmId: String,
	rowLength : Number,
	rowData : [String],
	initTime : Date,
	startTime : Date,
	endTime : Date,
	duration : Number,
	consume : Number,
	finish: {type: Boolean, default: false},
    calState: String,
    grade : Number,
    correctRate: Number,
	success: Number,
	error: Number,
	jump: Number,
});

CandidateSchema.virtual('id').get(function(){
	return this._id.toHexString();
});
CandidateSchema.set('toJSON', {
	virtuals: true
});
CandidateSchema.set('toObject', {
	virtuals: true
});

var CandidateModel = mongoose.model('candidate', CandidateSchema);

module.exports = CandidateModel;
