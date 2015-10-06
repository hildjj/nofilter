gulp = require 'gulp'
codo = require 'gulp-codo'
coffee = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
gls = require 'gulp-live-server'
gutil = require 'gulp-util'
istanbul = require 'gulp-istanbul'
nodeunit = require 'gulp-nodeunit-runner'
open = require 'open'
sourcemaps  = require 'gulp-sourcemaps'

gulp.task 'coffee', ->
  gulp.src './src/*.coffee'
  .pipe sourcemaps.init()
  .pipe coffee()
    .on 'error', (er) ->
      gutil.log er.stack
  .pipe sourcemaps.write()
  .pipe gulp.dest('./lib')

gulp.task 'lint', ->
  gulp.src './src/*.coffee'
  .pipe coffeelint()
  .pipe coffeelint.reporter()

gulp.task 'doc', ->
  gulp.src './src/*.coffee',
    read: false
  .pipe codo
    name: 'duplex-buffer'
    title: 'Duplex-Buffer Documentation'
    readme: 'README.md'
    dir: './doc/'
    extra: 'LICENSE.md'
    undocumented: true

gulp.task 'test', ['coffee'], ->
  gulp.src './test/*.js'
    .pipe nodeunit()

gulp.task 'pre-coverage', ['coffee'], ->
  gulp.src([ 'lib/*.js' ])
  .pipe istanbul()
  .pipe istanbul.hookRequire()

gulp.task 'coverage', [ 'pre-coverage' ], ->
  gulp.src ['test/*.js']
  .pipe nodeunit()
  .pipe istanbul.writeReports()

gulp.task 'watch', ['coverage'], ->
  gulp.watch ['src/*.coffee', 'test/*.js'], ['coverage']

gulp.task 'serve', ['watch'], ->
  server = gls.static 'coverage/lcov-report'
  server.start()
  open 'http://localhost:3000/'
  gulp.watch ['coverage/lcov-report/**/*.html'], (file) ->
    server.notify.apply server, [file]


gulp.task 'default', ['test']
