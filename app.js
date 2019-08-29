const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const redis = require('./utils/redis')

const app = express();

const host = 'localhost';
const port = '8888';

const authRouter = require('./routes/auth'); // auth 接口
const indexRouter = require('./routes/index'); // home page 接口
const usersRouter = require('./routes/users'); // 用户接口

const whiteList = ['/auth/login','/auth/logout']
//解决跨域
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X-Token');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }else {
      if((whiteList.indexOf(req.originalUrl) == -1 && req.headers['x-token'])){
        jwt.verify(req.headers['x-token'], 'token', (err, decode)=> {
            if (err) {  //  时间失效的时候 || 伪造的token
              redis.del(req.headers['x-token'])
              redis.del('userInfo')
              next(createError(401));
            } else {
              next();
            }
        })
      }else if(whiteList.indexOf(req.originalUrl) !== -1){
        next();
      }else{
        next(createError(403));
      }
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter); // 在app中注册routes该接口
app.use('/auth', authRouter); // 在app中注册routes该接口
app.use('/user', usersRouter); // 在app中注册users接口

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



var server = app.listen(port,host,function(){
    console.log(`server is port:${port}`)
})