// Dependencies
var gulp = require('gulp-help')(require('gulp'));
var browserSync = require('browser-sync');
var del = require('del');
var merge2 = require('merge2');
var $ = require('gulp-load-plugins')();

// Assets diretories
var paths = {
  js: './app/assets/js',
  images: './app/assets/images',
  sass: './app/assets/scss',
  site: './site'
};

// Hash options
var hashOptions = {
  algorithm: 'md5',
  hashLength: 10,
  template: '<%= name %>.<%= hash %><%= ext %>'
};

var babelOptions = {
  presets: ['es2017']
};

function addAssetToManifest(stream) {
  return stream
    .pipe($.hash.manifest('asset-hashes.json', true))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({
      stream: true
    }));
}

gulp.task(
    'sass',
    'Compile sass into minified CSS files and copy to site folder', ['clean:css'],
    function() {
    var stream = merge2(
    gulp.src(paths.sass + '/*.scss')
      .pipe($.include())
    )
    .pipe($.sass())
    .pipe($.csso())
    .pipe($.concat('application.css'))
    .pipe($.hash(hashOptions))
    .pipe(gulp.dest(paths.site));

    addAssetToManifest(stream);

    return stream;
  }
);

gulp.task(
    'js',
    'Include JS files, put hash on file names and copy to site folder', ['clean:js'],
    function() {
    var stream = merge2(
      gulp.src(paths.js + '/*.js')
        .pipe($.include())
        .pipe($.babel(babelOptions))
      )
      .pipe($.concat('application.js'))
      .pipe($.uglify())
      .pipe($.hash(hashOptions))
      .pipe(gulp.dest(paths.site));

    addAssetToManifest(stream);

    return stream;
  }
);

gulp.task(
    'js:app',
    'Include JS files, put hash on file names and copy to site folder', ['clean:js'],
    function() {
    var stream = merge2(
      gulp.src(paths.js + '/*.js')
        .pipe($.include())
        .pipe($.babel(babelOptions))
      )
      .pipe($.concat('application.js'))
      .pipe($.hash(hashOptions))
      .pipe(gulp.dest(paths.site));

    addAssetToManifest(stream);

    return stream;
  }
);

gulp.task(
    'sass:app',
    'Compile sass into CSS files and copy to site folder', ['clean:css'],
    function() {
    var stream = merge2(
    gulp.src(paths.sass + '/*.scss')
      .pipe($.include())
    )
    .pipe($.sass())
    .pipe($.csso())
    .pipe($.concat('application.css'))
    .pipe($.hash(hashOptions))
    .pipe(gulp.dest(paths.site));

    addAssetToManifest(stream);

    return stream;
  }
);

gulp.task('clean:css', 'Clean CSS assets', function() {
  return del(paths.site + '/*.css');
});

gulp.task('clean:js', 'Clean JS assets', function() {
  return del(paths.site + '/*.js');
});

gulp.task('clean', ['clean:css', 'clean:js']);

gulp.task(
  'server',
  'Provide a node server with browser sync and rerun tasks when a file changes', ['sass:app', 'js:app'],
  function() {
    browserSync.init([
      paths.site + '/**/*',
    ], {
      proxy: 'hotsite.dev',
      notify: false
    });

    gulp.watch(paths.sass + '/*.scss', ['sass:app']);
    gulp.watch(paths.js + '/*.js', ['js:app']);

    gulp.watch(paths.site, function(event) {
      browserSync.reload(event.path);
    });
  }
);

gulp.task('build', ['sass', 'js']);
gulp.task('default', ['build']);
