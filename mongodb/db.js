var mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(require('../dbUrl').dbUrl);

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    avatar: String
});

var userModel = mongoose.model('user', userSchema);

var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    poster: String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

var articleModel = mongoose.model('article', articleSchema);

module.exports.userModel = userModel;
module.exports.articleModel = articleModel;
