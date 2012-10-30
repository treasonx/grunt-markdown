/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  
  var path = require('path'); 
  var markdown = require('markdown');
  var hljs = require('highlight.js');

  grunt.registerHelper('markdown', function(src, options) {

    options.highlight = options.highlight || 'manual';

    if(typeof options.highlight === 'string') {
      if(options.highlight === 'auto') {
        options.highlight = function(code) {
          return hljs.highlightAuto(code).value;
        };
      } else if (options.highlight === 'manual') {
        options.highlight = function(code, lang) {
          return hljs.highlight(lang, code).value;
        };
      }
      
    }

    if(typeof options === 'object') {
      markdown.setOptions(options);
    }

    grunt.verbose.write('Marking down...');  

    return markdown(src);

  });

  grunt.registerMultiTask('markdown', 'compiles markdown files into html', function() {

    var options = grunt.config(['jshint', this.target, 'options']);
    var destPath = this.dest.path;
    var extension = this.data.extenstion || 'html';

    grunt.file.expandFiles(this.file.src).forEach(function(filepath) {

      var html = grunt.helper('markdown', grunt.file.read(filepath), options);
      var ext = path.extname(filepath);
      var dest = path.join(destPath, path.basename(filepath, ext) + extension);
      grunt.file.write(dest, html);
      
    });
    
  });
  
};

