//引入express模块
var express = require('express');
//引入path模块，path.resolve path.join  __dirname
var path = require('path');
//引入serve-favicon模块, 处理ico图标
var favicon = require('serve-favicon');
//引入日志模块;
var logger = require('morgan');
//引入cookie-parser模块，引入后可以通过req.cookies获取cookie信息，res.cookie设置cookie信息
var cookieParser = require('cookie-parser');
//引入body-parser模块，引入后通过req.body直接获取请求体信息
var bodyParser = require('body-parser');

//引入index首页处理的路由容器
var index = require('./routes/index');
//引入users用户页处理的路由容器
var user = require('./routes/user');
//引入article文章页处理的路由容器
var article = require('./routes/article');

var session = require('express-session');//创建session模块, 引入后会在req上增加session属性，对session进行设置和读取
var mongoStorage = require('connect-mongo')(session);//创建connect-mongo模块，用于将session保存到数据库中

var flash = require('connect-flash');//引入flash模块

//创建app，客户端请求处理的监听函数
var app = express();

// view engine setup
//设置ejs模版引擎文件
app.set('views', path.join(__dirname, 'views'));//设置模版引擎文件存放的根路径在views下
app.set('view engine', 'html');//设置模版引擎文件类型是html
app.engine('html', require('ejs').__express);//使用ejs语法解析html模版殷勤文件

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//使用logger模块
app.use(bodyParser.json());//使用body-parser模块，用来处理请求体是json类型的数据{"name":"chenchao", "age":18}
app.use(bodyParser.urlencoded({extended: false}));//使用body-parser模块，处理表单提交  name=chenchao&age=18
// extended: false表示使用bodyparser中自带的解析工具解析，true表示使querystring模块解析
app.use(cookieParser()); //使用cookieparser模块
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源文件根路径是public目录

app.use(session({
    //如果直接将session保存到服务器上，当服务器重新启动的时候session会丢失，也就是用户的登陆信息会丢失
    secret: 'limintao',
    resave: true,
    saveUninitialized: true,

    //将session信息保存到数据库中，即使重启服务器，session数据也不会丢失
    store:new mongoStorage({
        url: require('./dbUrl').dbUrl
    })
}));

//flash必须放在session的后面，依赖session
app.use(flash());

//所有路由都需要配置的公共信息
app.use(function (req, res, next) {
    res.locals.user = req.session.user;

    res.locals.success = req.flash('success');//成功信息
    res.locals.error = req.flash('error');//失败信息

    res.locals.keyword = req.session.keyword;//获取查询的关键字

    next();
});


app.use('/', index); //当请求的路径是/开头的时候，使用index路由中间件处理
app.use('/user', user);//当请求的路径是/users开头的时候，用users路由容器处理
app.use('/article', article);//如果请求路径是articles开头的时候，使用articles路由容器进行处理

// catch 404 and forward to error handler
//当上面的路由都不匹配的时候走下面的错误处理
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    //设置模版引擎文件渲染时候的数据信息
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
