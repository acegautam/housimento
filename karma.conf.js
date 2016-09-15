var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],

    // list of files/patterns to load in the browser
    files: [{ pattern: 'spec.bundle.js', watched: false }],

    // files to exclude
    exclude: [],

    plugins: [
      require("karma-chai"),
      require("karma-chrome-launcher"),
      require('karma-phantomjs-launcher'),
      require("karma-mocha"),
      require("karma-coverage"),
      require("karma-mocha-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-webpack")
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 'spec.bundle.js': ['webpack', 'sourcemap'] },

    webpack: {
      node : {
        fs: 'empty'
      },
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loader: 'isparta',
            include: [/\.spec\.js/]
          }
        ],
        loaders: [
          { test: /\.js/, exclude: [/app\/lib/, /node_modules/], loader: 'babel' },
          { test: /\.html/, loader: 'raw' },
          { test: /\.less/, loader: 'style!css!less' },
          { test: /\.css$/, loader: 'style!css' }
        ]
      }
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'coverage', 'mocha'],

    coverageReporter: {
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'html',
          dir: 'build/reports/coverage'
        }
      ]
    },

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // if true, Karma runs tests once and exits
    singleRun: true
  });
};
