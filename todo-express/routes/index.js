
/* GET home page. */
var debug = require('debug');

exports.index = function(req, res, next) {
    debug('RENDERING HOME PAGE');
    res.render('index', { title: 'Express.js Todo App' });
};

