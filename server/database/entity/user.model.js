var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    id : Number,
    eNo: String,
    eName: String,
    eMobile: String,
    deptCode: String,
    deptName: String,
    deptType: String,
    levelName: String,
    positionName: String,
});

var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;