var gulp          = require('gulp');
var path          = require('path');
var elixir        = require('laravel-elixir');
var config        = elixir.config;
var gutil       = require('gulp-util');
var notifications = require('laravel-elixir/Notification');
var wrap          = require('gulp-wrap');
var concat        = require('gulp-concat');
var declare       = require('gulp-declare');
var handlebars    = require('gulp-handlebars');
var _             = require('underscore');


var Task = elixir.Task;
/**
 * Create elixir extension
 */
elixir.extend('templates', function (src, output, baseDir, options) {

  /**
   * Prep the Gulp src and output paths.
   *
   * @param  {string|Array} src
   * @param  {string|null}  baseDir
   * @param  {string|null}  output
   * @return {GulpPaths}
   */
  var prepGulpPaths = function(src, baseDir, output) {
      return new elixir.GulpPaths()
          .src(src, baseDir || config.get('assets.js.folder'))
          .output(output || src, 'templates.js');
  };


    var paths = prepGulpPaths(src, baseDir, output);
    options = _.extend({
        debug : !config.production,
        search: '/**/*.hbs'
    }, options);
    console.log(paths);
    console.log(options);

    new Task('templates', function () {

        var onError = function (e) {
            new elixir.Notification().error(e, 'Handlebars Template Compilation Failed!');
            this.emit('end');
        };

        return gulp.src(paths.src.path)
            .on('error', onError)
            .pipe(handlebars({handlebars: require('handlebars')}))
            // Wrap each template function in a call to Handlebars.template
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            // Declare template functions as properties and sub-properties of exports
            .pipe(declare({
                root       : 'exports',
                noRedeclare: true // Avoid duplicate declarations
            }))
            // Concatenate down to a single file
            .pipe(concat(paths.output.name))
            // Add the Handlebars module in the final output
            .pipe(wrap('var Handlebars = require("handlebars");\n <%= contents %>'))
            .pipe(gulp.dest(paths.src.baseDir+'/'+paths.output.baseDir));


    });

});
