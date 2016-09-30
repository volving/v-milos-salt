(function($) {
    if (!$) {
        console.log('jQuery is required!');
        return false;
    }

    function Vpreviewit(ele, opt) {
        var z = this;
        z.$element = ele;
        z.initSize = 400;
        z.defaults = {
            key: 'vpreviewit',
            wrapper: '.vpreviewit',
            previewer: '.previewer', //canvas
            prev_size: {
                width: 96,
                height: 96
            },
            img: '.readReady',
            file_input: '.file_input',
            input_trigger: '.trigger',
            pos: {
                sx: 0,
                sy: 0,
                sw: z.initSize,
                sh: z.initSize,
                dx: 0,
                dy: 0,
                dw: z.initSize,
                dh: z.initSize
            },
        };
        z.settings = $.extend({}, z.defaults, opt);

        var imgsrc = $(ele).data('imgsrc') || '';

        z.img = new Image();
        if (imgsrc.length > 0) {
            z.img.src = imgsrc;
        } else {
            z.img.src = '/assets/images/not_found.png';
        }

        z.img.onload = function() {
            var pos = z.settings.pos;
            pos = z.imgCentralizeContain(z.img, z.$roles.previewer);
            z.context.clearRect(0, 0, z.settings.prev_size.width, z.settings.prev_size.height);
            z.$roles.previewer.css('background', 'none');
            z.context.drawImage(z.img, pos.sx, pos.sy, pos.sw, pos.sh, pos.dx, pos.dy, pos.dw, pos.dh); //, 0, 0, canvas.width, canvase.height);
        };
        z.reader = new FileReader();
        z.reader.onloadend = function(e) {
            var src = e.target.result;
            z.img.src = src;

        };
    }
    Vpreviewit.prototype = {
        init: function() {
            var z = this;
            z.$roles = {
                wrapper: z.$element,
                img: z.$element.find(z.settings.img),
                previewer: z.$element.find(z.settings.previewer),
                file_input: z.$element.find(z.settings.file_input),
                input_trigger: z.$element.find(z.settings.input_trigger),
                upload: z.$element.find('.upload')
            };
            z.$roles.input_trigger.on('click', z.trigger.bind(z, z.$roles.file_input));
            z.$roles.file_input.on('change', function() {
                z.file = z.$roles.file_input[0].files[0];
                if (z.file) {
                    z.reader.readAsDataURL(z.file);
                }
            });
            z.canvas = z.$roles.previewer[0];
            z.canvas.width = z.settings.prev_size.width;
            z.canvas.height = z.settings.prev_size.height;
            z.context = z.canvas.getContext('2d');

        },
        createElem: function(configs) {
            var elem = document.createElement(configs.tagName);
            var conf = configs.options;
            for (var key in conf) {
                if (conf.hasOwnProperty(key)) {
                    elem.setAttribute(key, configs.options[key]);
                }
            }

            return elem;
        },
        imgCentralizeContain: function(src, dest) {
            var concorete = function(obj) {
                if (src) {
                    return $(obj);
                }
                return null;
            };
            var $src = concorete(src);
            var $dest = concorete(dest);

            if ($src && $dest) {
                var sw = $src[0].width;
                var sh = $src[0].height;
                var dw = $dest[0].width;
                var dh = $dest[0].height;
                var pos = {
                    sx: 0,
                    sy: 0,
                    sw: sw,
                    sh: sh,
                    dx: 0,
                    dy: 0,
                    dw: dw,
                    dh: dh
                };
                var r = sw * dh / sh / dw;
                var rr = 1;
                // contains:

                // cover:
                if (isNaN(r)) {
                    return null;
                } else {
                    if (r === 1) {
                        return pos;
                    } else if (r > 1) {
                        rr = sh / sw;
                        pos.dh = dw * rr;
                        pos.dy = (dh - pos.dh) >> 1;
                        return pos;
                    } else {
                        rr = sw / sh;
                        pos.dw = dh * rr;
                        pos.dx = (dw - pos.dw) >> 1;
                        return pos;
                    }
                }
            }
            return null;
        },
        trigger: function($input) {
            $input.click();
        }
    };

    $.fn.vpreviewit = function(options) {

        return this.each(function() {
            var $z = $(this),
                instance;
            if (options && options.constructor === Object) {
                instance = new Vpreviewit($z, options);
            } else {
                instance = new Vpreviewit($z, {});
            }
            instance.init();
            $z.data('vpreviewit', instance);
        });
    };
})(jQuery);
