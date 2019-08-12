let express = require('express');
let router = express.Router();
let _ = require('loadsh');

let UserExtendModel = require('../../database/entity/user-extend.model');

router.get('/ext', async function (req, res) {
    let e = await UserExtendModel.findOne({no: req.userInfo.eNo});
    if (!e) {
        res.json({
            status: false,
            message: '没有找到证件信息'
        });
        return ;
    }
    res.json({
        status: true,
        message: '证件查询成功',
        data: e
    });
});
/**
 * 保存用户额外信息
 */
router.post('/ext', async function (req, res) {
    let body = _.assign(req.body, {no: req.userInfo.eNo});
    await UserExtendModel.findOneAndUpdate({no: req.userInfo.eNo}, body, {upsert: true});
    res.json({
        status: true,
        message: '保存成功'
    });
});

module.exports = router;