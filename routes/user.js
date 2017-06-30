var express = require('express');
var router = express.Router();

var userModel = require("../mongodb/db").userModel;

var md5 =require("../md5/md5");
var auth = require("../middleware/auth");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/reg', auth.checkNotLogin,function(req, res, next) {
    res.render('user/reg', {title: '用户注册页面',content:"用户注册页面内容"});
});

router.post('/reg',auth.checkNotLogin, function(req, res, next) {
    var user = req.body;

    user.password = md5(user.password);       //对用户信息加密;

    user.avatar = 'https://secure.gravatar.com/avatar/'+user.email+'?s=48';//添加头像

    userModel.findOne(user,function (err, doc) {
        if (!err){
            if (doc){
                req.flash('error', '该注册信息已经被占用, 请重新注册');
                res.redirect('back');
            }else {
                userModel.create(user,function (err, doc) {
                    if (!err){
                        req.flash('success', '注册用户信息成功');
                        res.redirect("/index")
                    }else {
                        req.flash('error', '注册用户信息失败' + err);
                        res.redirect("back")
                    }
                })
            }
        }else {
            req.flash('error', '注册用户信息失败');
            res.redirect("back")
        }
    });

});

router.get('/login', auth.checkNotLogin,function(req, res, next) {
    res.render('user/login', {title: '用户登陆页面',content:"用户登陆页面内容"});
});

router.post("/login",auth.checkNotLogin,function (req, res,next) {
    var user = req.body;

    user.password = md5(user.password);

    userModel.findOne(user,function (err, doc) {
        if (!err){
            if (doc){
                req.session.user = doc;//将登陆用户信息保存到session中
                req.flash('success', '用户登陆成功');
                res.redirect("/");
            }else {
                req.flash('error', '当前登陆的用户信息未注册，请先注册');
                res.redirect("/user/reg")
            }
        }else {
            req.flash('error', '用户登陆失败');
            res.redirect("back")
        }
    })

});
router.get('/logout', auth.checkLogin,function(req, res, next) {
    req.flash('success', '用户退出成功');
    req.session.user = null;//用户退出的时候清空session中的登陆信息
    res.redirect('/');
});

module.exports = router;
