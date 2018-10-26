var mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(require('../dbUrl').dbUrl, {useMongoClient:true});

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    avatar: String,
    phone: Number,
    information: {
        gender: String,
        birthday: String,
        marriage: String,
        profession: String,
    },
    add_time: {
        type: Date,
        default: Date.now()
    },
    Account_binding:{
        qq: String,
        weChat: String,
        github: String
    }
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
    },
    classify: String
});

var articleModel = mongoose.model('article', articleSchema);

module.exports.userModel = userModel;
module.exports.articleModel = articleModel;
