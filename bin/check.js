module.exports = {
    checkPhoneNumber: function (text) {
        return /^(0|86|\+86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(text);
    },
    checkUrl: function (text) {
        var strRegex = "^((((https|http|ftp|rtsp|mms)?:\\/\\/)" + "?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //ftp的user@
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN
            + "([0-9a-zA-Z_!~*'()-]+\.)*)" // 域名- www.
            + "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\." // 二级域名
            + "[a-zA-Z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$" + ')' + '|' // 允许相对路径
            + '((\\.\\/)?([\\.]?[\\w\\-\\_]+)+([\\/\\w\\d\\-\\_\\~\\!\\*])?[^\\.]$)';
        var reg = RegExp(strRegex);
        return reg.test(text);
    },
    httpcodeToMessage: function (code) {
        switch (parseInt(code / 100)) {
        case 4:
            return '客户端错误:';
        case 5:
            return '服务器内部错误:';
        default:
            return '';
        }
    }
};
