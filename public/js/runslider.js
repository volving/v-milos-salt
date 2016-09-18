'use strict';

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#blah').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var output = document.getElementById('canvas');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};


$(document).ready(function() {
    $('#vertical').lightSlider({
        gallery: true,
        item: 1,
        vertical: true,
        adaptiveHeight: true,
        vThumbWidth: 50,
        thumbItem: 8,
        thumbMargin: 4,
        slideMargin: 0
    });
    var $fi = $('#fileInput');
    var fi = $fi[0];

    // $fi.change(function() {
    //     readURL(this);
    // });
    $fi.on('change', loadFile);
});
