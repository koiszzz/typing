let express = require('express');
let router = express.Router();
let _ = require('loadsh');

let ArticleModel = require('../../../database/entity/article.model');

/**
 * 查询代码生成表
 */
router.get('/models', async function (req, res, next) {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let query = _.omit(req.query, ['page', 'pageSize']);
    let tables = await ArticleModel.find(query, {}, {skip: pageSize * page, limit: pageSize});
    let pageNum = await ArticleModel.countDocuments(query);
    res.json({
        status: true,
        message: '查询成功',
        data: {
            data: tables,
            pageNum: Math.ceil(pageNum / pageSize)
        }
    });
});
/**
 * 新增、编辑代码生成表
 */
router.post('/model', async function (req, res, next) {
    req.body.creator = req.userInfo.eNo;
    if (req.body.id) {
        await ArticleModel.updateOne({_id: req.body.id}, _.omit(req.body, ['id']));
    } else {
        await new ArticleModel(req.body).save();
    }
    res.json({
        status: true,
        message: '保存成功',
    });
});

router.delete('/model', async function (req, res) {
    if (req.query.id) {
        await ArticleModel.deleteOne({_id: req.query.id});
        res.json({
            status: true,
            message: '删除成功'
        });
    } else {
        res.json({
            status: false,
            message: 'ID参数缺失'
        });
    }
});

module.exports = router;
