var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/**
 * 文件下载
 */
router.get('/fileDownload', function (req, res, next) {
  if (!req.query.fileName) {
    res.json({
      status: false,
      message: '未输入要下载的文件名称'
    });
    return;
  }
  var filePath = process.cwd() + '/files/' + req.query.fileName.replace('..\g', '');
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.json({
      status: false,
      message: '未找到待下载的文件'
    });
  }
});

module.exports = router;
