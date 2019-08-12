let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let _ = require('lodash');
let moment = require('moment');

let secret = require('../config/auth.config').secret;
/**
 *路由
 **/
let admin = require('./auth/admin');
let candidate = require('./auth/candidate');
let user = require('./auth/user');

app.enable('trust proxy')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req,res,next) {
    let token = req.header('Authorization');
    try {
        if(!token) {
            throw new Error('没有授权密钥');
        }
        let tokenArray = token.split(' ');
        if(tokenArray.length <= 0) {
            throw new Error('授权信息有误');
        }
        let decode = jwt.verify(tokenArray[1],secret);
        //设置request的userInfo信息方便后面的方法使用
        req.userInfo = decode;
        console.info(JSON.stringify({
            user: decode.eNo,
            time: moment().format('YYYY-MM-DD LTS'),
            url: req.path,
            params: _.isEmpty(req.body)?req.query:req.body,
            method:req.method
        }));
        next();
    }catch (err){
        console.error(err.message);
        res.status(400).json(err.message);
    }
});


/**
 * 去掉空格 和 分隔符
 * @param data
 * @returns {*}
 */
function formatData(data) {
    if (_.isUndefined(data) || _.isNull(data)) {
        return data;
    }
    if (_.isArray(data)) {
        data.map(function (value) {
            value = formatData(value);
            return value;
        })
    }
    if (_.isObject(data)) {
        Object.keys(data).map(function (value) {
            data[value] = formatData(data[value]);
        });
    }

    if (_.isString(data)) {
        data = data.trim();
        data = data.replace(/\t/g, '');
    }
    return data;
}
/**
 * 格式化数据流 去除空格和分隔符
 */
app.use(function (req, res, next) {
    try {
        if (!_.isEmpty(req.body)) {
            req.body = formatData(req.body);
        }
        if (!_.isEmpty(req.query)) {
            req.query = formatData(req.query);
        }
        next();
    } catch (err) {
        console.error(err.message);
        res.status(400).json('数据格式化错误');
    }
});

app.use('/admin',admin);
app.use('/candidate', candidate);
app.use('/user', user);

module.exports = app;

