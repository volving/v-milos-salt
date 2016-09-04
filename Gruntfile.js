'use strict';

module.exports = function(grunt) {
    console.log('hello, grunt running!');
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    var config = {
        _src            : 'fe',
        _dist           : 'public',

        _assets_src     : 'fe/assets',
        _assets_dist    : 'public/assets',


        _vendor_src     : 'bower_components',
        _vendor_dest    : 'public/vendor',      //dest !!

        _less_src       : 'fe/less',
        _less_dist      : 'public/css',

        _js_src         : 'fe/js',
        _js_dist        : 'public/js',

        _tmp            : 'fe/tmp',
        _prefixed       : 'fe/tmp/prefixed',
        _lessed         : 'fe/tmp/lessed',
        _mined          : 'fe/tmp/mined',
        _uglified       : 'fe/tmp/uglified',



    };
    grunt.initConfig({
        config: config,
        less: {
            options: {
                compress: false,
            },
            www: {
                files: [{
                    expand: true,
                    cwd: '<%= config._less_src %>/',
                    src: '**/*.less',
                    dest: '<%= config._lessed %>/',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 2% in US', 'last 4 versions', 'IE 9', 'IE 10']
            },
            www: {
                files: [{
                    expand: true,
                    cwd: '<%= config._lessed %>/',
                    src: '**/*.css',
                    dest: '<%= config._prefixed %>/',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        cssmin: {
            www: {
                files: [{
                    expand: true,
                    cwd: '<%= config._prefixed %>/',
                    src: '**/*.css',
                    dest: '<%= config._mined %>/',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                undef: true,
                unused: true,
                debug: true,
                predef: ['$', 'jQuery', 'console'],
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    nodejs: true,
                    require: true,
                    Map: true,
                },
                ignores: [],
                force: true
            },
            gruntfile:{
                src: 'Gruntfile.js'
            },
            assets:{
                src: ['<%= config._assets_src %>/**/*.js']
            },
            sources: {
                src: ['<%= config._js_src %>/**/*.js']
            }
        },
        // concat: {
        //     options:{
        //         separator:';'
        //     },
        //     www:{
        //         files: [{
        //             expand: true,
        //             cwd: '<%= config._www_src %>',
        //             src: '**/*.js',
        //             dest: '<%= config._prefixed %>/www/dist/www.js'
        //         }]
        //     }
        // },
        uglify: {
            www: {
                files: [{
                    expand: true,
                    cwd: '<%= config._js_src %>/',
                    src: '**/*.js',
                    dest: '<%= config._uglified %>/',
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },
        copy: {
            serve_assets: {
                files: [{
                    expand: true,
                    cwd: '<%= config._assets_src %>/',
                    src: ['**/*'],
                    dest: '<%= config._assets_dist %>/'
                }]
            },
            serve_vendor: {
                files: [{
                    expand: true,
                    cwd: '<%= config._vendor_src %>/',
                    src: ['**/*/dist/**/*'],
                    filter: function() {
                        if (arguments[0].indexOf('node_modules') > -1 || arguments[0].indexOf('/src/') > -1) {
                            return false;
                        }
                        return true;
                    },
                    dest: '<%= config._vendor_dest %>/'
                }]
            },
            dist_prefixed: {
                files: [{
                    expand: true,
                    cwd: '<%= config._prefixed %>/',
                    src: '**/*.css',
                    dest: '<%= config._less_dist %>/',
                    ext: '.css',
                    extDot: 'last'
                }]
            },
            serve_raw_css:{
                files: [{
                    expand: true,
                    cwd: '<%= config._prefixed %>/',
                    src: '**/*.css',
                    dest: '<%= config._less_dist %>/',
                    ext: '.css',
                    extDot: 'last'
                }]
            },
            serve_css:{
                files: [{
                    expand: true,
                    cwd: '<%= config._mined %>/',
                    src: '**/*.css',
                    dest: '<%= config._less_dist %>/',
                    ext: '.css',
                    extDot: 'last'
                }]
            },
            serve_raw_js: {
                files: [{
                    expand: true,
                    cwd: '<%= config._js_src %>/',
                    src: '**/*.js',
                    dest: '<%= config._js_dist %>/',
                    ext: '.js',
                    extDot: 'last'
                }]
            },
            serve_js: {
                files: [{
                    expand: true,
                    cwd: '<%= config._uglified %>/',
                    src: '**/*.js',
                    dest: '<%= config._js_dist %>/',
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },
        clean: {
            vendor: {
                src: '<%= config._vendor_dest %>/*'
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= config._tmp %>',
                    src: '**/*.js'
                }, {
                    expand: true,
                    cwd: '<%= config._assets_dist %>',
                    src: '**/*.js'
                }, {
                    expand: true,
                    cwd: '<%= config._js_dist %>/',
                    src: '**/*.js'
                }, {
                    expand: true,
                    cwd: '<%= config._vendor_dest %>/',
                    src: '**/*.js'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '<%= config._tmp %>',
                    src: '**/*.css'
                }, {
                    expand: true,
                    cwd: '<%= config._assets_dist %>',
                    src: '**/*.css',
                }, {
                    expand: true,
                    cwd: '<%= config._less_dist %>/',
                    src: '**/*.css'

                }, {
                    expand: true,
                    cwd: '<%= config._vendor_dest %>',
                    src: '**/*.css'
                }]
            },
            assets:{
                src:['<%= config._assets_dist %>/*'],
            },
            prefixed: {
                src: ['<%= config._prefixed %>/*']
            },
            dist: {
                src: ['<%= config._dist %>/*']
            },
            tmp: {
                src: ['<%= config._tmp %>/*']
            }
        },
        watch: {
            options: {
                interrupt: false,
                spawn: true
            },
            gconf: {
                options: {
                    reload: true
                },
                files: 'Gruntfile.js'

            },
            css: {
                options: {
                    interrupt: true,
                    spawn: true,
                    livereload: true
                },
                files: '<%= config._less_src %>/**/*.less',
                tasks: ['newer:less', 'newer:autoprefixer', 'newer:copy:serve_raw_css']
            },
            js: {
                options: {
                    interrupt: true,
                    livereload: true
                },
                files: '<%= config._js_src %>/**/*.js',
                tasks: ['newer:jshint', 'newer:copy:serve_raw_js']
            },
            pug: {
                options: {
                    livereload: true
                },
                files: '**/*.pug'
            },
            assets: {
                options: {
                    livereload: true
                },
                files: '<%= config._assets_src %>/*',
                tasks: ['clean:assets', 'newer:copy:serve_assets']
            }
        }

    });
    grunt.registerTask('dev_css', ['less', 'autoprefixer', 'copy:serve_raw_css']);
    grunt.registerTask('dev_js', ['jshint', 'copy:serve_raw_js']);
    grunt.registerTask('dev', ['clean', 'dev_css', 'dev_js', 'copy:serve_assets', 'copy:serve_vendor', 'watch']);

    grunt.registerTask('serve_css', ['less', 'autoprefixer', 'cssmin', 'copy:serve_css']);  // 'copy:dist_mined',
    grunt.registerTask('serve_js', ['jshint', 'uglify', 'copy:serve_js']); // 'copy:dist_js',
    grunt.registerTask('serve', ['clean', 'serve_css', 'serve_js', 'copy:serve_assets', 'copy:serve_vendor', 'clean:tmp']);

    grunt.registerTask('default', ['dev']);
};
