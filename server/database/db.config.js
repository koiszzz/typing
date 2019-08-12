var mongoose = require('mongoose');
//将Mongoose的Promise替换成Bluebird
mongoose.Promise = require('bluebird');

var options = {
    poolSize: 20,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true,
    useFindAndModify: false
};

// var dbLink = process.env.NODE_ENV === 'production'? 'mongodb://localhost/jhzf':'mongodb://11.24.122.37:37017/jhzf';
var dbLink = process.env.NODE_ENV === 'production'? 'mongodb://localhost/cust':'mongodb://localhost/cust';

mongoose.connect(dbLink, options, function(err) {
    if (err) {
        console.error('Unable to connect to the server. Please start the server. Error:', err);
        process.exit(1);
    } else {
        console.info('Connected to Server successfully!');
    }
});

if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
}

var db = mongoose.connection;
db.on('error',console.error.bind(console,'数据库连接错误:'));
db.once('close', function () {
    console.info("Closed mongoose");
});
db.once('open',function () {
    console.info('数据库开启!');
});
db.on('connected',function () {
    console.info('Mongodb 连接成功!');
});
db.on('disconnected',function () {
    console.info('disconnected');
});
module.exports = mongoose;
