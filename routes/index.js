var express = require('express');//引入express模块
var router = express.Router();//创建路由容器

var articleModel = require('../mongodb/db').articleModel;


/* GET home page. */
//如果访问的是/走下面的路由
router.get('/', function (req, res, next) {
    var query = {};
    var keyword = req.query.keyword;
    req.session.keyword = '';
    if (keyword){//提交搜索
        //设置查询的内容
        var reg = new RegExp(keyword, 'i');//创建搜索的正则，忽略大小写
        query = {$or: [{title:reg}, {content: reg}]};//设置查询的条件，标题或者内容中出现即可
        req.session.keyword = keyword;           //将keyword存到session中；
    }

    var pageNum = parseInt(req.query.pageNum) || 1; //获取显示第几页书籍
    var pageSize = parseInt(req.query.pageSize) || 8;//获取一页显示多少书籍信息

    articleModel.find(query)
        .populate('user')
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .exec(function (err, articles) {
            if (!err) {
                req.flash('success', '获取文章列表成功');
                articleModel.count(query, function (err, count) {
                    if (!err){
                        res.render('index', {
                            title: '文章列表',
                            articles: articles,
                            keyword:keyword,
                            pageNum: pageNum,
                            pageSize: pageSize,
                            totalPage: Math.ceil(count/pageSize)
                        });
                    } else {
                        req.flash('error', '获取文章列表失败');
                        res.redirect('back');
                    }
                });
            } else {
                req.flash('error', '获取文章列表失败');
                res.redirect('back');
            }
        });
});


module.exports = router;
