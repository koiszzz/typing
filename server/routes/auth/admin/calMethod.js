let express = require('express');
let router = express.Router();
let _ = require('loadsh');
let vm = require('vm');

let CMModel = require('../../../database/entity/cal-method.model');

/**
 * 查询代码生成表
 */
router.get('/models', async function (req, res) {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let query = _.omit(req.query, ['page', 'pageSize']);
    let tables = await CMModel.find(query, {}, {skip: pageSize * page, limit: pageSize});
    let pageNum = await CMModel.countDocuments(query);
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
    if (req.body.id) {
        await CMModel.updateOne({_id: req.body.id}, _.omit(req.body, ['id']));
    } else {
        req.body.creator = req.userInfo.eNo;
        await new CMModel(req.body).save();
    }
    res.json({
        status: true,
        message: '保存成功',
    });
});

router.delete('/model', async function (req, res) {
    if (req.query.id) {
        await CMModel.updateOne({_id: req.query.id}, {isDeleted: '是'});
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
 * 启用计算规则
 */
router.post('/use', async function (req, res) {
    if (req.body.id) {
        await CMModel.updateOne({_id: req.body.id}, {isUsed: '是'});
        res.json({
            status: true,
            message: '启用'
        });
    } else {
        res.json({
            status: false,
            message: 'ID参数缺失'
        });
    }
});
/**
 * 试运行
 */
router.post('/test', async function (req, res) {
    if (req.body.method && req.body.method.length <= 0) {
        res.json({
            status: true,
            message: '请输入计算规则'
        });
        return;
    }
    let sandbox = {
        grade: 0,
        success: 100,
        error: 0,
        correctRate: 0,
        age: 30,
        duration: 60
    };
    vm.createContext(sandbox);
    let code = req.body.method.replace('require\g', '');
    try {
        vm.runInContext(code, sandbox);
    } catch (e) {
        res.json({
            status: false,
            message: e.message
        });
        return;
    }
    res.json({
        status: true,
        message: '测试通过,测试成绩' + sandbox.grade
    })
});

module.exports = router;
