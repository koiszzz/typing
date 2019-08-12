var express = require('express');
var app = express();

app.use('/codeGen', require('./admin/codeGen'));
app.use('/article', require('./admin/article'));
app.use('/exam', require('./admin/exam'));
app.use('/calMethod', require('./admin/calMethod'));

module.exports = app;