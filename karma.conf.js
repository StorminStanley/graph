'use strict';
// Karma configuration
// Generated on Tue Jan 07 2014 11:17:21 GMT+0700 (NOVT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'expect', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'web/components/jquery/jquery.js',
      'web/components/angular/angular.js',
      'web/components/angular-route/angular-route.js',
      'web/components/angular-mocks/angular-mocks.js',
      'web/components/angular-local-storage/angular-local-storage.js',
      'web/components/d3/d3.js',
      'web/components/lodash/dist/lodash.js',
      'web/components/sockjs/sockjs.js',
      'web/main.js',
      'web/directives/**/*.js',
      'web/directives/**/*.html',
      'web/apps/**/*.js',
      'web/apps/**/*.html'
    ],

    preprocessors: {
      'web/apps/**/*.html': 'ng-html2js',
      'web/directives/**/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'web/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
