import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import sync     from 'run-sequence';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import fs       from 'fs';
import yargs    from 'yargs';
import lodash   from 'lodash';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import del      from 'del';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpachHotMiddelware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';

let root = 'client';

// to resolve paths
let resolveToApp = (glob = '') => {
  return path.join(root, 'app', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

// all paths
let paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  styl: resolveToApp('**/*.styl'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: path.join(__dirname, root, 'app/app.js'),
  vendorEntry: path.join(__dirname, root, 'app/vendor.js'),
  output: root,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  json: path.join(__dirname, 'json/**/*.json'),
  dest: path.join(__dirname, 'public')
};

/***  PROD TASK   ***/
gulp.task('build', ['clean'], (callback) => {
  const config = require('./webpack.prod.config');
  config.entry.app = paths.entry;

  // Using webpack to bundle modules
  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    gulp.src(paths.json).pipe(gulp.dest(paths.dest));
    callback();
  });
});

/***  DEV TASK   ***/
gulp.task('serve', () => {
  const config = require('./webpack.dev.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
    paths.entry
  ];

  var compiler = webpack(config);

  serve({
    port: process.env.PORT || 3000,
    open: true,
    server: [root, 'json'],
    middleware: [
      historyApiFallback(),
      webpackDevMiddelware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpachHotMiddelware(compiler)
    ]
  });
});

gulp.task('watch', ['serve']);

/***  Generate module task  ***/
gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name.toLowerCase();
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);
  console.log(`****** Generating component - ${cap(name)} *******`);
  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean', (callback) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    callback();
  });
});

gulp.task('default', ['watch']);
