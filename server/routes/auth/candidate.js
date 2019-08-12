let express = require('express');
let router = express.Router();
let _ = require('loadsh');
let moment = require('moment');
let vm = require('vm');

let ExamModel = require('../../database/entity/exam.model');
let CandidateModel = require('../../database/entity/candidate.model');
let UEModel = require('../../database/entity/user-extend.model');
let ArticleModel = require('../../database/entity/article.model');
let CMModel = require('../../database/entity/cal-method.model');
/**
 * 查询代码生成表
 */
router.get('/exams', async function (req, res, next) {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let query = _.omit(req.query, ['page', 'pageSize']);
    if (!query['status']) {
        query['status'] = '进行中';
    }
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

function checkIp(r, s, e) {
    if ((!s || s.length === 0) && (!e || e.length === 0)) {
        return true;
    }
    if (!r || r.length <= 0) {
        return false;
    }
    let rs = r.split('.');
    if (rs.length !== 4) {
        return false;
    }
    if (s) {
        if (ipCompare(s, r)) {
            return false;
        }
    }
    if (e) {
        if (ipCompare(r, e)) {
            return false;
        }
    }
    return true;
}

function ipCompare(a, b) {
    let m = a.split('.');
    let n = b.split('.');
    for (let i = 0; i < m.length; i++) {
        if (m[i] > n[i]) {
            return false;
        }
    }
    return true;
}

/**
 * 获取成绩
 */
router.get('/models', async function (req, res) {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let query = _.omit(req.query, ['page', 'pageSize']);
    let tables = await CandidateModel.find(query, {}, {skip: pageSize * page, limit: pageSize});
    let pageNum = await CandidateModel.countDocuments(query);
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
 * 初始化
 */
router.post('/init', async function (req, res) {
    if (process.env.NODE_ENV !== 'production' && req.ip !== '::1') {
        res.json({
            status: false,
            message: '测试环境，非法IP'
        });
        return;
    }
    let exam = await ExamModel.findOne({_id: req.body.id, status: '进行中'});
    if (!exam) {
        res.json({
            status: false,
            message: '没有找到该考试，请重新刷新页面'
        });
        return;
    }
    if ((exam.limitIpStart && exam.limitIpStart.length >= 0) || (exam.limitIpEnd && exam.limitIpEnd.length >= 0)) {
        if (!checkIp(req.ip, exam.limitIpStart, exam.limitIpEnd)) {
            res.json({
                status: false,
                message: 'ip不合法'
            });
            return;
        }
    }
    let ur = await UEModel.findOne({no: req.userInfo.eNo});
    let certNo, age;
    if (!ur) {
        certNo = '';
        age = 30;
    } else {
        certNo = ur.certNo;
        age =  parseInt(moment().format('YYYYMMDD')) - parseInt(certNo.substr(6, 8));
    }
    let cModel;
    cModel = await CandidateModel.findOne({
        no: req.userInfo.eNo,
        examId: exam._id
    });
    if (!cModel) {
        let article = await ArticleModel.findOne({_id: exam.articleId});
        if (!article) {
            res.json({
                status: false,
                message: '未找到考试指定的文章'
            });
            return;
        }
        cModel = new CandidateModel({
            no: req.userInfo.eNo,
            name: req.userInfo.eName,
            instNo: req.userInfo.deptCode,
            instName: req.userInfo.deptName,
            certNo: certNo,
            age: age,
            ip: req.ip,
            examId: exam._id,
            examName: exam.name,
            articleType: article.articleType,
            cmId: article.cmId,
            content: article.content,
            initTime: Date.now(),
            duration: exam.timeLength,
        });
        await cModel.save();
    } else {
        if (cModel.consume !== undefined && cModel.consume > cModel.duration - 3) {
            res.json({
                status: false,
                message: '您的考试已经结束，请勿重复参加考试'
            });
            return;
        }
    }
    let message;
    if (cModel.startTime) {
        message = '重新开始考试'
    } else {
        message = '考试初始化完毕'
    }
    res.json({
        status: true,
        message: message,
        data: cModel
    });
});
/**
 * 更新考试信息
 */
router.post('/update', async function (req, res) {
    await CandidateModel.updateOne({_id: req.body.id, finish: false}, _.omit(req.body, ['id']));
    res.json({
        status: true,
        message: '更新考试信息'
    });
    if (req.body.finish) {

    }
});
/**
 * 结束考试
 */
router.post('/finish', async function (req, res) {
    await CandidateModel.updateOne({_id: req.body.id, finish: false}, _.omit(req.body, ['id']));
    const candidate = await CandidateModel.findOne({_id: req.body.id});
    const calMethod = await CMModel.findOne({_id: candidate.cmId});
    if (!calMethod) {
        res.json({
            status: false,
            message: '没有找到考试对应的成绩计算规则'
        });
        return;
    }
    let sandbox = {
        success: candidate.success ? candidate.success : 0,
        error: candidate.error ? candidate : 0,
        jump: candidate.jump ? candidate.jump : 0,
        correctRate: Math.round(candidate.success / (candidate.success + candidate.error) * 100),
        grade: 0,
        age: candidate.age,
        duration: candidate.duration
    };
    console.log(sandbox);
    vm.createContext(sandbox);
    let code = calMethod.method.replace('require\g', '');
    try {
        vm.runInContext(code, sandbox);
    } catch (e) {
        await CandidateModel.updateOne({_id: candidate._id},{calState: '失败'});
        console.log(e);
        res.json({
            status: false,
            message: '成绩计算失败，请联系考官'
        });
        return;
    }
    await CandidateModel.updateOne({_id: candidate._id}, {grade: sandbox.grade, correctRate: sandbox.correctRate, calState: '成功'});
    res.json({
        status: true,
        message: '成绩计算成功'
    });
});

module.exports = router;
