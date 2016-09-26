// jshint ignore: start
$(function() {
    $('.essential').prev('label').css('color', 'red');
});
// jshint ignore: end


function calcPosition(cw, ch, iw, ih) { //jshint ignore: line

    if (arguments.length >= 4) {
        var wr = cw / iw,
            hr = ch / ih,
            status = wr - hr,
            sw,
            sh,
            dw,
            dh;
        if (status === 0) {
            return {
                dx: 0,
                dy: 0,
                dw: cw,
                dh: ch,
                sx: 0,
                sy: 0,
                sw: iw,
                sh: ih
            };
        }
        if (arguments[5]) {
            // isContain = false; // cover
            if (status < 0) {
                sh = ih * iw / cw;
                return {
                    dx: 0,
                    dy: 0,
                    dw: cw,
                    dh: ch,
                    sx: 0,
                    sy: 0,
                    sw: iw,
                    sh: sh
                };
            } else {
                sw = iw * ih / ch;
                return {
                    dx: 0,
                    dy: 0,
                    dw: cw,
                    dh: ch,
                    sx: 0,
                    sy: 0,
                    sw: sw,
                    sh: ih
                };
            }
        }
        if (status < 0) {
            dh = ih * wr;
            return {
                dx: 0,
                dy: (ch - dh) >> 1,
                dw: cw,
                dh: dh,
                sx: 0,
                sy: 0,
                sw: iw,
                sh: ih
            };
        } else {
            dw = iw * hr;
            return {
                dx: (cw - dw) >> 1,
                dy: 0,
                dw: dw,
                dh: ch,
                sx: 0,
                sy: 0,
                sw: iw,
                sh: ih
            };
        }

    }
    return false;
}
