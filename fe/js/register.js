/* globals checkPhoneNumber */
$(function () {
    var $phoneInput = $('#username'),
        $sendVcodeBtn = $('#sendVcode'),
        $captchaInput = $('#captcha'),
        $vcodeInput = $('#vcode'),
        $passwordInput = $('#password'),
        $submitBtn = $('#submit'),
        $usercontract = $('#usercontract'),
        $form = $('#registerForm'),
        $modal = $('#modal');
    var INTERVAL = 10;
    var timerid,
        timeleft,
        phoneNumber = '',
        captcha,
        _captcha = utils.getCookieByKey('_captcha'),
        sendVcodeText = $sendVcodeBtn.text();

    //------------------------------------------------Start of checkSendable


    function init() {
        if (checkSendable()) {
            enableSend();
        } else {
            disableSend();
            countDown();
        }
    }

    function checkSendable() {
        // check phone
        // check captcha
        var condition = checkPhone() && checkCaptcha() && checkInterval();
        if (condition) {
            console.log('Condition:' + condition);
            return true;
        }
        return false;
    }

    function checkPhone() {
        phoneNumber = $phoneInput.val();
        console.log('Phone:' + checkPhoneNumber(phoneNumber));
        return checkPhoneNumber(phoneNumber);
    }

    function checkCaptcha() {
        captcha = $captchaInput.val();
        // console.log('_captcha:' + (_captcha === captcha));
        if (captcha && _captcha && captcha.toLowerCase() === _captcha.toLowerCase()) {
            console.log(captcha.toLowerCase(), _captcha.toLowerCase());
            return true;
        }
        return false;
    }

    function getSpan() {
        var lastsent = utils.getCookieByKey('lastsent') / 1000 || 0;
        var current = Date.now() / 1000;
        return parseInt(current - lastsent);
    }

    function checkInterval() {
        console.log('checkInterval:' + (INTERVAL < getSpan()));
        if (INTERVAL < getSpan()) {
            return true;
        }
        return false;
    }

    function enableSend() {
        $sendVcodeBtn.removeClass('disabled');
        $sendVcodeBtn.on('click', sendVcodeSMS);
    }

    function disableSend() {
        $sendVcodeBtn.addClass('disabled');
        $sendVcodeBtn.off('click', sendVcodeSMS);
    }

    function sendVcodeSMS() {
        // $.get();
        //TO-DO <volving>: how to handle sending?
        var url = location.origin + '/vcode';
        $.get(url, {phone: $phoneInput.val()}, function(result){
            var msg = JSON.parse(result.message);
            console.log(typeof msg + ' ::: ' + msg);
            $modal.find('.modal-title').text('消息');
            if (msg.statusMsg) {
                console.log(msg.statusMsg);
                $modal.find('.modal-message').text(msg.statusMsg);
            }else{
                console.log('发送成功');
                $modal.find('.modal-message').text('发送成功');
            }
            $modal.modal();
        });
        utils.setCookie('lastsent', Date.now());
        countDown();
    }


    function countDown() {
        timeleft = INTERVAL - getSpan() || 0;
        var tip = '';
        if (timeleft > 0) {
            disableSend();
            timerid = setInterval(function () {
                tip = timeleft + '秒后再试';
                $sendVcodeBtn.text(tip);
                timeleft--;
                if (timeleft <= 0) {
                    $sendVcodeBtn.text(sendVcodeText);
                    clearInterval(timerid);
                    handleSend();
                }
            }, 1000);
        } else {
            handleSend();
        }
    }

    function handleSend() {
        if (checkSendable()) {
            enableSend();
        } else {
            disableSend();
        }
    }

    init();
    $phoneInput.on('keyup', handleSend);
    $captchaInput.on('keyup', handleSend);

    //------------------------------------------------End __of checkSendable
    //------------------------------------------------Start of checkSubmitable
    function checkSubmitable(){
        //check phone
        //check password
        //check vcode
        var condition = checkPhone() && checkPwd() && checkVcode() && checkUsercontract();
        if (condition) {
            return true;
        }
        return false;
    }
    function checkPwd(){
        var password = $passwordInput.val();
        if (password && password.length > 5) {
            return true;
        }else{
            return false;
        }
    }
    function checkVcode(){
        var vcode = $vcodeInput.val();
        if (vcode && vcode.length >= 4) {
            return true;
        }else{
            return false;
        }
    }
    function checkUsercontract(){
        var condition = $usercontract.prop('checked');
        if (condition) {
            return true;
        }else{
            return false;
        }
    }


    function enableSubmit(){
        $submitBtn.removeClass('disabled');
        $submitBtn.on('click', submit);
    }
    function disableSubmit(){
        $submitBtn.addClass('disabled');
        $submitBtn.off('click', submit);
    }
    function submit(){
        $form.submit();
    }
    function handleSubmit(){
        if (checkSubmitable()) {
            enableSubmit();
        }else{
            disableSubmit();
        }
    }

    $phoneInput.on('keyup', handleSubmit);
    $vcodeInput.on('keyup', handleSubmit);
    $passwordInput.on('keyup', handleSubmit);
    $usercontract.on('change', handleSubmit);
    //------------------------------------------------End __of checkSubmitable

    /*
        if (checkSendable) {
            $sendVcodeBtn.on('click', sendVcode);
        } else {
            countDown();
        }

        function checkSendable() {
            var lastsent = utils.getCookieByKey('lastsent') / 1000 || 0;
            var current = Date.now() / 1000;
            phoneNumber = $phoneInput.val();
            if (checkPhoneNumber(phoneNumber) && (current - lastsent > INTERVAL) && checkCaptcha()) {
                return true;
            }
            return false;
        }

        function countDown() {
            timeleft = INTERVAL;
            utils.setCookie('lastsent', Date.now());
            var tip = '';
            timerid = setInterval(function () {
                if (timeleft > 0) {
                    tip = timeleft + '秒后再试';
                    timeleft--;
                    return $sendVcodeBtn.text(tip).addClass('disabled');
                }
                clearInterval(timerid);
                $sendVcodeBtn.text(sendVcodeText);
                if (checkCaptcha) {
                    $sendVcodeBtn.removeClass('disabled');
                }
                $sendVcodeBtn.on('click', sendVcode);
            }, 1000);
        }

        function sendVcode() {
            var url = window.location.origin + '/vcode';
            $.get(url, {
                phone: phoneNumber
            }, function (r) {
                console.log(r);
            });
            $sendVcodeBtn.off('click', sendVcode);
            countDown();
            utils.setCookie('lastsent', Date.now());
            return;
        }

        function checkCaptcha() {
            if ($captchaInput && $captchaInput.val() && $captchaInput.val().toLowerCase() === captcha.toLowerCase()) {
                $sendVcodeBtn.removeClass('disabled');
                return true;
            }
            $sendVcodeBtn.addClass('disabled');
            return false;
        }
        $captchaInput.on('keyup', checkCaptcha);
    */
});




var utils = { // jshint ignore: line
    getCookieByKey: function (key) {
        var cookie = document.cookie;
        var regExp = new RegExp(key + '=([0-9A-z._-]*);?');
        var result = cookie.match(regExp);
        if (result && result.length > 1) {
            return result[1];
        }
        return '';
    },
    getCookies: function () {
        var cookie = document.cookie;
        var cookieArray = cookie.split(';');
        var cookies = {};
        cookieArray.map(function (item) {
            var kv = item.split('=');
            var k = kv[0].trim();
            var v = kv[1] && kv[1].trim();
            if (v) {
                cookies[k] = v;
            }
        });
        return cookies;
    },
    setCookie: function (k, v) {
        document.cookie = k + '=' + v + ';';
    },
    delCookie: function (k) {
        document.cookie = k + '=;expires=' + new Date(0);
    },
    ajaxDo: function (url, data, cb) {
        if (!data) {
            data._csrftoken = utils.getCookieByKey('_csrftoken');
        }
        return cb();
    }
};
