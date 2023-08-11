var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var app = express();

// view engine setup
hbs.registerPartials(path.join(__dirname, 'views/partials/'));
app.engine('hbs', hbs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var indexRouter = require('./routes/index');
var getStartedRouter = require('./routes/getStarted');
var newsRouter = require('./routes/news');
var serversRouter = require('./routes/servers');
var eventsRouter = require('./routes/events').router;
var oauthRouter = require('./routes/oauth');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');

app.use('/', indexRouter);
app.use('/get-started', getStartedRouter);
app.use('/news', newsRouter);
app.use('/servers', serversRouter);
app.use('/events', eventsRouter);
app.use('/oauth', oauthRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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