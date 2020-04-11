var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var index2Router = require('./routes/index2');
// var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var blogRouter = require('./routes/blog');
var registerRouter = require('./routes/register');
var aboutRouter = require('./routes/about');
var about2Router = require('./routes/about2');
var orderRouter = require('./routes/order');
var order2Router = require('./routes/order2');
var signinRouter = require('./routes/signin');
var regis2Router = require('./routes2/transactionRoutesV22')
var memberRouter = require('./routes/member');
// var meRouter = require('./routes/me');
var logoutRouter = require('./routes/logout');
var firstRouter = require('./routes/first');
var riderRouter = require('./routes/rider');
var failedRouter = require('./routes/failed');
var regissuccessRouter = require('./routes/regissuccess');
var regisfailedRouter = require('./routes/regisfailed');


var app = express();
var session = require('express-session')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//var app = express()
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/index2', index2Router);
// app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/blog', blogRouter);
app.use('/register', registerRouter);
app.use('/about', aboutRouter);
app.use('/about2', about2Router);
app.use('/order', orderRouter);
app.use('/order2', order2Router);
app.use('/signin', signinRouter);
app.use('/transactionRoutesV22',regis2Router);
app.use('/member',memberRouter);
// app.use('/me',meRouter);
app.use('/logout',logoutRouter);
app.use('/first',firstRouter);
app.use('/rider',riderRouter);
app.use('/failed',failedRouter);
app.use('/regissuccess',regissuccessRouter);
app.use('/regisfailed',regisfailedRouter);

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
