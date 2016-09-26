function drawOnCanvas(input,canvas){
    var files = input.files;
        if (files && files.length > 0) {
            var src = window.URL.createObjectURL(files[0]);
            var img = new Image();
            img.src = src;
            var cntx = canvas.getContext('2d');
            img.onload = function(){
                canvas.width = 180;
                canvas.height = 180;
                var cw = canvas.width,
                    ch = canvas.height,
                    iw = img.width,
                    ih = img.height;
                var pos = calcPosition(cw, ch, iw, ih); //jshint ignore: line
                cntx.clearRect(0, 0, cw, ch);
                cntx.drawImage(img, pos.sx, pos.sy, pos.sw, pos.sh, pos.dx, pos.dy, pos.dw, pos.dh);
            };
        }
}


$(function(){
    var previewInput = document.getElementById('preview');
    var magnifyInput = document.getElementById('magnifyview');
    var previewCanvas = document.getElementById('previewCanvas');
    var magnifyCanvas = document.getElementById('magnifyCanvas');

    previewInput.addEventListener('change', function(){
        drawOnCanvas(previewInput, previewCanvas);
        return;
    });

    magnifyInput.addEventListener('change', function(){
        drawOnCanvas(magnifyInput, magnifyCanvas);
        return;
    });

});