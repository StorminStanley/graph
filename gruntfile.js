'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      server: ['lib/**/*.js', 'test/**/*.js', '*.js'],
      client: {
        options: {
          jshintrc: 'web/.jshintrc'
        },
        files: {
          src: ['web/apps/**/*.js', 'web/directives/**/*.js', 'web/*.js']
        }
      }
    },
    shell: {
      test: {
        command: 'npm test'
      }
    },
    develop: {
      server: {
        file: 'server.js'
      }
    },
    watch: {
      server: {
        files: ['lib/**/*.js', 'test/**/*.js', 'config/**/*.yml', '*.js'],
        tasks: ['jshint', 'shell:test', 'develop'],
        options: {
          nospawn: true
        }
      },
      clientjs: {
        files: ['web/apps/**/*.js', 'web/directives/**/*.js', 'web/*.js'],
        tasks: ['jshint:client']
      },
      clientcss: {
        files: ['web/less/**/*.less', 'web/apps/**/*.less', 'web/directives/**/*.less'],
        tasks: ['less:development']
      }
    },
    less: {
      development: {
        options: {
          paths: ['web/less']
        },
        files: {
          'web/css/style.css': [
            'web/less/style.less',
            'web/apps/**/style.less',
            'web/directives/*/style.less'
          ]
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');
  
  grunt.registerTask('default', ['jshint', 'less', 'shell:test', 'karma:unit', 'develop', 'watch']);
  grunt.registerTask('production', ['jshint', 'less', 'shell:test']);
  
};