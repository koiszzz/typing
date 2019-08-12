var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var _ = require('loadsh');

var systemConfig = require('../config/system.config');
var secret = require('../config/auth.config').secret;

var UserModel = require('../database/entity/user.model');

/**
 * 登陆
 */
router.post('/login', function (req, res) {
    var user = _.pick(req.body, 'account', 'password');
    if (req.app.get('env') === 'development') {//测试
        if (user.account.length <= 0 && user.password.length <= 0) {
            user.account = '774262';
        }
        UserModel.findOne({eNo: user.account}).exec().then(function (doc) {
            if (doc) {
                var userInfo = _.omit(doc._doc, ['__v', '_id']);
                res.json({
                    status: true,
                    message: '登陆成功!',
                    data: jwt.sign(userInfo, secret, {expiresIn: 24 * 3600, jwtid: 's'})
                });
            } else {
                res.json({
                    status: false,
                    message: '没有找到用户!'
                })
            }
        }).catch(function (err) {
            res.status(400).json({
                status: false,
                message: err
            });
        })
    } else {//生产环境
        if (user.account.length <= 0 && user.password.length <= 0) {
            res.json({
                status: false,
                message: '请输入用户账号和密码!'
            });
            return;
        }
        request.post(systemConfig.YX_PLATEFORM + '/api/auth/login.do', {
            form: {
                tUserName: user.account,
                tPwd: user.password
            }
        }, function (err, response, body) {
            if (err) {
                res.json({
                    status: false,
                    message: '授权服务异常!'
                });
                return;
            }
            var jsonBody = JSON.parse(body);
            if (jsonBody.status) {
                res.json({
                    status: true,
                    message: '登陆成功!',
                    data: jwt.sign(jsonBody.userInfo, secret, {expiresIn: 4 * 3600, jwtid: 's'})
                });
            } else {
                res.json(jsonBody);
            }
        });
    }
});

router.get('/initRole', async function (req, res) {

})

module.exports = router;
