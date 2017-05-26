//gulpfile.js

/*-------------------- インストールコマンド --------------------- */
//グローバル
  // npm i -g gulp
//以下はプロジェクトフォルダで入力
  // npm i -D gulp
  // npm i -D gulp-autoprefixer
  // npm i -D gulp-minify-css
  // npm i -D gulp-uglify
  // npm i -D gulp gulp-sass gulp-postcss postcss-cssnext
  // npm i -D css-mqpacker
  // npm i -D gulp-htmlhint
  // npm i -D gulp-csslint
  // npm i -D gulp-scss-lint
  // npm i -D gulp-sourcemaps
  // npm i -D gulp-sass-glob
  // npm i -D browser-sync
  // npm i -D gulp-debug
  // npm i -D gulp-plumber
  // npm i -D gulp-notify
  // npm i -D gulp-imagemin
  // npm i -D gulp-ejs
  // npm i -D gulp-minify-ejs
  // npm i -D gulp-rename
  // npm i -D gulp-pug
  // npm i -D gulp-data
/*-------------------- /インストールコマンド ----------------------*/

/*-------------------- plug-in --------------------------------- */
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sass = require('gulp-sass');
//var autoprefixer = require("gulp-autoprefixer");
var postcss = require("gulp-postcss");
var cssnext = require("postcss-cssnext");
var sassGlob = require("gulp-sass-glob");
var sourcemaps = require("gulp-sourcemaps");
var htmlhint = require("gulp-htmlhint");
//var csslint = require("gulp-csslint");
//var scsslint = require("gulp-scss-lint");
//var browserSync = require("browser-sync");
var reload = browserSync.reload;
//var debug = require("gulp-debug");
//var plumber = require("gulp-plumber");
//var notify  = require("gulp-notify");
var imagemin = require("gulp-imagemin");
var pug = require("gulp-pug");
var fs = require("fs");
var data = require("gulp-data");
/*-------------------- /plug-in -------------------------------- */

/*-------------------- タスク ---------------------------------- */
//scssをコンパイル
var paths = {
  "scss": "src/scss/", //作業するscssのフォルダ
  "css": "dest/css/"  //コンパイルして保存するcssのフォルダ
}
gulp.task('scss', function() {
  var processors = [
    cssnext({browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"]}) //ブラウザ/os バージョン
  ];
  return gulp.src(paths.scss + '**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sassGlob({
      ignorePaths: [
        'foundation/_reset.scss'
      ]
  }))
  .pipe(sass({outputStyle: "expanded"}))
  .pipe(postcss(processors))
  .pipe(postcss([require('css-mqpacker')]))
  .pipe(sourcemaps.write("./"))
  .pipe(gulp.dest(paths.css))
});

//画像圧縮
gulp.task('imagemin', function(){
  var srcGlob = 'src/images/**/*.+(jpg|jpeg|png|gif|svg)';
  var dstGlob = 'src/images/';
  var imageminOptions = {
    optimizationLevel: 7
  };
  gulp.src(srcGlob)
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest("dest/images/"));
});

//JS圧縮
gulp.task("uglify", function() {
  return gulp.src("src/js/*.js")
  .pipe(uglify())
  .pipe(gulp.dest("dest/js/"))
});

//Pug(テンプレートエンジン)
gulp.task("pug", function () {
  //var json = JSON.parse(fs.readFileSync("./pages.json"));
  gulp.src(
    ["src/pug/**/*.pug",'!' + "src/pug/**/_*.pug"] //参照するディレクトリ、出力を除外するファイル
  )
  //.pipe(plumber())
  .pipe(data( file => {
    return JSON.parse(fs.readFileSync(`./pages.json`));
  }))
  .pipe(pug({
    pretty:'    '
  }))
  .pipe(gulp.dest("dest/"))
});
/*-------------------- /タスク -------------------------------- */

/*-------------------- リアルタイム監視------------------------ */
gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.scss", ["scss"]);
  gulp.watch("src/js/*.js", ["uglify"]);
  gulp.watch("src/pug/**/*.pug", ["pug"]);
  browserSync.init({
    files: ["src/scss/**/*.scss","src/js/","src/pug/"],
      proxy: "http://localhost/~flocss-dev/dest/",
      //open: "external"
  });
});
/*-------------------- /リアルタイム監視 ---------------------- */