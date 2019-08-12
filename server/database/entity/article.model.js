var mongoose = require('../db.config');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    name: String,
    content: String,
    cmId: String,
    cmName: String,
    articleType: String,
    creator: String,
    createTime: {type: Date, default: Date.now()}
});

ArticleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
ArticleSchema.set('toJSON', {
    virtuals: true
});
ArticleSchema.set('toObject', {
    virtuals: true
});

var ArticleModel = mongoose.model('article', ArticleSchema);

module.exports = ArticleModel;
