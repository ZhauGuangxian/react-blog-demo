import crypto from 'crypto';

module.exports = {
    MD5_SUFFIX: 'sskjtxdywdddzyjknn',
    md5: function (pwd) {
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
}