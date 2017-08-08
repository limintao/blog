//检查用户登陆；
function checkLogin(req, res, next) {

    if (req.session.user._id) {//已经登陆
        next();
    } else { //未登陆
        req.flash('error', '当前操作只有用户登陆时才能访问,请登陆');
        res.redirect('/user/login');
    }
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {//已经登陆
        req.flash('error', '当前操作只有用户未登陆时才能访问，请先退出');
        res.redirect('/');
    } else { //未登陆
        next();
    }
}
module.exports = {
    checkLogin: checkLogin,
    checkNotLogin: checkNotLogin
};