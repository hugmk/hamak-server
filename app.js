require("./models/db");
const config = require("./config");
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('./middlewares/cors.middleware');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const createError = require('http-errors');

const RATE_LIMITER = config.rateLimit.local;

var indexRouter = require('./routes/index.router');
var usersRouter = require('./routes/users.router');
var productsRouter = require('./routes/products.router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors);
app.use(rateLimit(RATE_LIMITER));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

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
    res.json({
        message: err.message,
        error: err,
    });
});

module.exports = app;
