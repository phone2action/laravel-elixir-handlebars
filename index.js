var gulp          = require('gulp');
var elixir        = require('laravel-elixir');
var config        = elixir.config;
var utilities     = require('laravel-elixir/ingredients/commands/Utilities');
var notifications = require('laravel-elixir/ingredients/commands/Notification');
var wrap          = require('gulp-wrap');
var concat        = require('gulp-concat');
var declare       = require('gulp-declare');
var handlebars    = require('gulp-handlebars');
var _             = require('underscore');

/**
 * Create elixir extension
 */
elixir.extend('templates', function (src,options) {

    options = _.extend({
        debug : !config.production,
        srcDir: config.assetsDir + (src || 'templates'),
        outputDir: config.assetsDir + 'js',
        outputFile: 'templates.js',
        search: '/**/*.hbs'
    }, options);

    var gulpSrc = "./" + options.srcDir + options.search;

    gulp.task('templates', function () {

        var onError = function (e) {
            new notifications().error(e, 'Handlebars Template Compilation Failed!');
            this.emit('end');
        };

        return gulp.src(gulpSrc)
            .on('error', onError)
            .pipe(handlebars())
            // Wrap each template function in a call to Handlebars.template
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            // Declare template functions as properties and sub-properties of exports
            .pipe(declare({
                root       : 'exports',
                noRedeclare: true, // Avoid duplicate declarations
                processName: function (filePath) {
                    return declare.processNameByPath(filePath.replace(options.srcDir + '/', ''));
                }
            }))
            // Concatenate down to a single file
            .pipe(concat(options.outputFile))
            // Add the Handlebars module in the final output
            .pipe(wrap('var Handlebars = require("handlebars");\n <%= contents %>'))
            .pipe(gulp.dest(options.outputDir));

    });

    this.registerWatcher('templates', gulpSrc, 'default');

    return this.queueTask('templates');
});
