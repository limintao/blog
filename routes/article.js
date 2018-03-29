var express = require('express');
var router = express.Router();

var auth = require('../middleware/auth');

var articleModel = require('../mongodb/db').articleModel;

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});    //配置,upload是一个中间件处理函数；

router.get('/add', auth.checkLogin, function (req, res) {
    res.render('article/add', {title: '发表文章页面'});
});

router.post('/add', auth.checkLogin, upload.single('poster'), function (req, res) {
    var article = req.body;//获取请求体中提交的文章信息
    article.user = req.session.user._id; //获取登陆的用户_id

    if (req.file){        //req.file保存了上传图片的信息；
        article.poster = '/uploads/'+ req.file.filename;
    }

    articleModel.create(article, function (err, doc) {
        if (!err) {
            req.flash('success', '发表文章成功');
            res.redirect('/');
        } else {
            req.flash('error', '发表文章失败');
            res.redirect('back');
        }
    });
});

router.get('/detail/:_id', function (req, res) {
    var _id = req.params._id;
    var user = req.session.user;
    articleModel.findById(_id, function (err, doc) {  //根据id找到对应的文章信息
        console.info("文章信息",req.session.user);
        if (!err){
            req.flash('success', '获取文章详细信息成功');
            res.render('article/detail', {title:'文章详情页面', article:doc,user:user});
        } else {
            req.flash('error', '获取文章详细信息失败');
            res.redirect('back');
        }
    });
});

 router.get('/delete/:_id',auth.checkLogin, function (req, res) {
    var _id = req.params._id;
    articleModel.remove({_id:_id}, function (err, doc) {
        if (!err){
            req.flash('success', '删除文章信息成功');
            res.redirect('/');
        } else {
            req.flash('error', '删除文章信息失败');
            res.redirect('back');
        }
    });
});

router.get('/edit/:_id',auth.checkLogin, function (req, res) {
    var _id = req.params._id;
    articleModel.findById(_id, function (err, doc) {
        if (!err){
            req.flash('success', '编辑文章页面信息成功');
            res.render('article/edit', {title:'文章编辑页面', article:doc});
        }else {
            req.flash('error', '编辑文章页面信息失败');
            res.redirect('back');
        }
    });
});

router.post('/edit/:_id', auth.checkLogin, upload.single('poster'), function (req, res) {
    var _id = req.params._id;
    var article = req.body;

    if (req.file){
        article.poster = '/uploads/'+req.file.filename;
    }

    console.log(_id);
    console.log(article);

    articleModel.update({_id:_id}, {$set: article}, function (err, doc) {
        if (!err){
            req.flash('success', '更新文章信息成功');
            res.redirect('/');
        }else {
            req.flash('error', '更新文章信息失败');
            res.redirect('back');
        }
    })
});

module.exports = router;