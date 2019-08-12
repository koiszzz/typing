let express = require('express');
let router = express.Router();
let _ = require('loadsh');
let fs = require('fs');

let CodeGenModel = require('../../../database/entity/code-gen.model');

/**
 * 查询代码生成表
 */
router.get('/models', async function (req, res, next) {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let query = _.omit(req.query, ['page', 'pageSize']);
    let tables = await CodeGenModel.find(query, {}, {skip: pageSize * page, limit: pageSize});
    let pageNum = await CodeGenModel.countDocuments(query);
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
        await CodeGenModel.updateOne({_id: req.body.id}, _.omit(req.body, ['id']));
    } else {
        await new CodeGenModel(req.body).save();
    }
    res.json({
        status: true,
        message: '保存成功',
    });
});

router.delete('/model', async function (req, res) {
    if (req.query.id) {
        await CodeGenModel.deleteOne({_id: req.query.id});
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
 * 代码生成
 */
router.post('/genCode', async function (req, res) {
    if (process.env.NODE_ENV === 'production') {
        res.json({
            status: false,
            message: '生产环境不允许直接生成代码'
        });
        return;
    }
    if (!req.body.id) {
        res.json({
            status: false,
            message: '生成失败'
        });
        return;
    }
    let genCode = await CodeGenModel.findOne({_id: req.body.id});
    if (!genCode) {
        res.json({
            status: false,
            message: '没有找到对应的生成配置'
        });
        return;
    }
    let gen = 'var mongoose = require(\'../db.config\');\n' +
        'var Schema = mongoose.Schema;\n\n';
    const cameralName = cameral(genCode.tableName);
    gen += 'var ' + cameralName + 'Schema = Schema({\n';
    genCode.cells.map(function (cell) {
        gen += '\t' + cell.cell + ' : ';
        switch (cell.cellType) {
            case 'array':
            case 'nested':
                gen += cell.cellChild;
                break;
            default:
                gen += cell.cellType;
        }
        gen += ',\n';
    });
    gen = gen.substr(0, gen.length - 2) + '\n' + '});\n\n';
    gen += cameralName + 'Schema.virtual(\'id\').get(function(){\n' +
        '\treturn this._id.toHexString();\n' +
        '});\n';
    gen += cameralName + 'Schema.set(\'toJSON\', {\n' +
        '\tvirtuals: true\n' +
        '});\n';
    gen += cameralName + 'Schema.set(\'toObject\', {\n' +
        '\tvirtuals: true\n' +
        '});\n\n';
    gen += 'var ' + cameralName + 'Model = mongoose.model(\'' + genCode.tableName + '\', ' + cameralName + 'Schema);\n\n'
    gen += 'module.exports = ' + cameralName + 'Model;';
    await fs.writeFileSync(process.cwd() + '/database/entity/' + genCode.tableName + '.model.js', gen);
    res.json({
        status: true,
        message: '代码生成成功'
    });
});

/**
 * 驼峰替换
 * @param str
 */
function cameral(str) {
    if (!str) {
        return '';
    }
    let array = str.split('-');
    if (array.length <= 0) {
        return '';
    }
    let result = array.map(function (v) {
        if (v.length > 0) {
            return v.substr(0, 1).toUpperCase() + v.substr(1, v.length);
        } else {
            return '';
        }
    }).join('');
    return result;
}

module.exports = router;
