var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var CodeGenSchema = Schema({
    tableName: String,
    tableDesc: String,
    cells: [Schema.Types.Mixed],
    createTime: {type: Date, default: Date.now()},
    creator: String
});

CodeGenSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CodeGenSchema.set('toJSON', {
    virtuals: true
});

CodeGenSchema.set('toObject', {
    virtuals: true
});

var CodeGenModel = mongoose.model('code-gen', CodeGenSchema);

module.exports = CodeGenModel;