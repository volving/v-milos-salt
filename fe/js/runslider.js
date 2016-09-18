'use strict';

// function readURL(input) {

//     if (input.files && input.files[0]) {
//         var reader = new FileReader();

//         reader.onload = function(e) {
//             $('#blah').attr('src', e.target.result);
//         };

//         reader.readAsDataURL(input.files[0]);
//     }
// }
// var loadFile = function(event) {
//     var reader = new FileReader();
//     reader.onload = function() {
//         var output = document.getElementById('canvas');
//         output.src = reader.result;
//     };
//     reader.readAsDataURL(event.target.files[0]);
// };


$(document).ready(function() {
    $('#vertical').lightSlider({
        gallery: true,
        item: 1,
        // vertical: true,
        adaptiveHeight: true,
        vThumbWidth: 50,
        thumbItem: 8,
        thumbMargin: 4,
        slideMargin: 0
    });
    var fileInput = document.getElementById('fileInput');
    var files;
    var img = new Image();
    var canvas = document.getElementById('canvas');
    canvas.width = 500;
    canvas.height = 500;
    var cntx = canvas.getContext('2d');
    var urlData;
    var pos;
    var rotateSpan = 5;
    var rotateAngle = 0;
    var translateX = canvas.width >> 1;
    var translateY = canvas.height >> 1;
    var rotateClockwise = document.getElementById('rotateClockwise');
    var rotateAntiClockwise = document.getElementById('rotateAntiClockwise');
    var rotateReset = document.getElementById('rotateReset');

    fileInput.addEventListener('change', function() {
        files = fileInput.files;
        if (files && files.length) {
            urlData = window.URL.createObjectURL(files[0]);
            img.src = urlData;
            img.onload = function() {
                console.log('hey');
                rotateAngle = 0;
                var cw = 500,
                    ch = 500,
                    iw = img.width,
                    ih = img.height;
                pos = calcPosition(cw, ch, iw, ih);
                cntx.clearRect(0, 0, cw, ch);
                cntx.drawImage(img, pos.sx, pos.sy, pos.sw, pos.sh, pos.dx, pos.dy, pos.dw, pos.dh);
            };
        }
    });

    rotateClockwise.addEventListener('click', function() {
        rotateAngle += rotateSpan;
        rotate(canvas, cntx, translateX, translateY, pos, rotateAngle, img);
    });
    rotateAntiClockwise.addEventListener('click', function() {
        rotateAngle -= rotateSpan;
        rotate(canvas, cntx, translateX, translateY, pos, rotateAngle, img);
    });
    rotateReset.addEventListener('click', function() {
        rotateAngle = 0;
        rotate(canvas, cntx, translateX, translateY, pos, rotateAngle, img);
    });

});


function calcPosition(cw, ch, iw, ih) {

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

function rotate(canvas, painter, translateX, translateY, pos, angle, img) {
    if (painter && pos && canvas) {
        painter.clearRect(0, 0, canvas.width, canvas.height);
        painter.save();
        painter.translate(translateX, translateY);
        painter.rotate(angle * Math.PI / 180);
        painter.drawImage(img, pos.sx, pos.sy, pos.sw, pos.sh, pos.dx - (translateX), pos.dy - (translateY), pos.dw, pos.dh);
        painter.restore();
    }
}
