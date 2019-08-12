let express = require('express');
let router = express.Router();
let _ = require('loadsh');

let ExamModel = require('../../../database/entity/exam.model');

/**
 * 查询代码生成表
 */
router.get('/models', async function (req, res, next) {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let query = _.omit(req.query, ['page', 'pageSize']);
    let tables = await ExamModel.find(query, {}, {skip: pageSize * page, limit: pageSize});
    let pageNum = await ExamModel.countDocuments(query);
    res.json({
        status: true,
        message: '查询成功',
        data: {
            data: tables,
            pageNum: Math.ceil(pageNum / pageSize)
        }
    });
});

function checkIpLegal(ip) {
    if (ip.length === 0) {
        return true;
    }
    let ips = ip.split('.');
    if (ips.length !== 4) {
        return false;
    }
    return true;
}
/**
 * 新增、编辑代码生成表
 */
router.post('/model', async function (req, res, next) {
    req.body.creator = req.userInfo.eNo;
    if (req.body.limitIpStart && !checkIpLegal(req.body.limitIpStart)) {
        res.json({
            status: false,
            message: '输入的IP不合法'
        });
        return;
    }
    if (req.body.limitIpEnd && !checkIpLegal(req.body.limitIpEnd)) {
        res.json({
            status: false,
            message: '输入的IP不合法'
        });
        return;
    }
    if (req.body.id) {
        await ExamModel.updateOne({_id: req.body.id}, _.omit(req.body, ['id']));
    } else {
        await new ExamModel(req.body).save();
    }
    res.json({
        status: true,
        message: '保存成功',
    });
});

router.delete('/model', async function (req, res) {
    if (req.query.id) {
        await ExamModel.deleteOne({_id: req.query.id});
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
/**
 * 开始考试
 */
router.post('/start', async function (req, res) {
    if (!req.body.id) {
        res.json({
            status: false,
            message: 'ID参数缺失'
        });
        return;
    }
    await ExamModel.updateOne({_id: req.body.id, status: '初始化'}, {
        status: '进行中',
        startTime: Date.now()
    });
    res.json({
        status: true,
        message: '考试开始'
    });
});

/**
 * 结束考试
 */
router.post('/end', async function (req, res) {
    if (!req.body.id) {
        res.json({
            status: false,
            message: 'ID参数缺失'
        });
        return;
    }
    await ExamModel.updateOne({_id: req.body.id, status: '进行中'}, {
        status: '结束',
        endTime: Date.now()
    });
    res.json({
        status: true,
        message: '考试结束'
    });
});

module.exports = router;
