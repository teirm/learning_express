/**
 *  Module Dependencies
 */

var express = require('express');
var routes = require('./routes');
var tasks = require('./routes/tasks');
var http = require('http');
var path = require('path');
var mongoskin = require('mongoskin');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = mongoskin.db('mongodb://localhost:27017/todo?auto_reconnect', {safe:true});

var app = express();

app.use(function(req, res, next) {
    req.db = {};
    req.db.tasks = db.collection('tasks');
    next();
})

app.locals.appname = 'Express.js Todo App'
// all environments


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'keyboard pupper'}));
app.use(express.csrf());

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.locals._csrf = req.session._csrf;
    return next();
})
app.use(app.router);


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.param('task_id', function(req, res, next, taskId) {
    req.db.tasks.findById(taskId, function(error, task){
        if (error) return next(error);
        if (!task) return next(new Error('Task is not found.'));
        req.task = task;
        return next();
    });
});

app.get('/',routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted);
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.del('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);

app.all('*', function(req, res) {
    res.send(404);
})

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port '+ app.get('port'));
});

/*
 * OLD CODE FROM EXPRESS GENERATOR
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
*/