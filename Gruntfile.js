/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      dev: {
        options: {
          reporter: 'min',
          ui: 'bdd'
        },
        src: ['test/*Spec.js']
      }
    },
    mocha_istanbul: {
      ci: {
        src: 'test',
        options: {
          mask: '*Spec.js',
          check: {
            lines: 95,
            branches: 82,
            functions: 100,
            statements: 95
          }
        }
      },
      coverage: {
        src: 'test',
        options: {
          mask: '*Spec.js',
          check: {
            lines: 95,
            branches: 82,
            functions: 100,
            statements: 95
          }
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'test/*.js'],
      tasks: ['mocha_istanbul:coverage']
    },
    markdown: {
      all: {
        options: {
          gfm: true,
          highlight: 'manual'
        },
        files: [
          {
            expand: true,
            src: 'test/samples/*.md',
            dest: 'test/out/',
            ext: '.html'
          }
        ]
      },
      wrap:{
        options: {
          gfm: true,
          highlight: 'manual',
          codeLines: {
            before: '<span>',
            after: '</span>'
          }
        },
        files: [
          {
            expand: true,
            src: 'test/samples/*.md',
            dest: 'test/out/',
            ext: '.html'
          }
        ]
      }
    },
		connect: {
			coverage: {
				options: {
					port: 9001,
					livereload: true,
					base: 'coverage/lcov-report/'
				}
			}
		},
    jshint: {
      files: ['Gruntfile.js', 'tasks/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest:dev']);
  grunt.registerTask('test', ['jshint', 'mocha_istanbul:ci']);
  grunt.registerTask('coverage', ['connect:coverage', 'watch', 'jshint']);

};
