'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    server: 'scripts',
    public: 'public',
    app: '<%= yeoman.public %>/app',
    dist: '<%= yeoman.public %>/dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    watch: {
        sass: {
            files: '<%= yeoman.public %>/scss/{,*/}*.{scss,sass}',
            tasks: ['sass:dev']
        }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        src: [
          '<%= yeoman.server %>/**/*.js'
        ]
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.public %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/angular-restify-mongo-blogger.min.js': [
            '.tmp/scripts/{,*/}*.js'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: '.tmp/scripts/{,*/}*.js',
        dest: '<%= yeoman.dist %>/angular-restify-mongo-blogger.js',
      },
    },
    sass : {
        dev: {
            options: {
                style: 'expanded',
                compass: false
            },
            files: {
                '<%= yeoman.public %>/styles/blog.css': '<%= yeoman.public %>/scss/blog.scss'
            }
        },
        dist: {
            options: {
                style: 'compressed',
                compass: false
            },
            files: {
                '<%= yeoman.public %>/styles/blog.css': '<%= yeoman.public %>/scss/blog.scss'
            }
        }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: []
      },
      concat: {
        expand: true,
        cwd: '<%= yeoman.app %>/',
        dest: '.tmp/scripts/',
        src: '{,*/}*.js'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      dist: [
        'copy:concat'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('test', [
    'clean:server',
    'newer:jshint',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'sass:dev',
    'concurrent:dist',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
