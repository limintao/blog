
module.exports = function md5(data) {
    /*var crypto = require('crypto');
     var md5 = crypto.createHash('md5');
     md5.update(data);
     return md5.digest('hex');*/
    return require('crypto').createHash('md5').update(data).digest('hex');
};
