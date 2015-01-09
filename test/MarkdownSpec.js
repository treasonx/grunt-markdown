/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

var assert = require('chai').assert;
var grunt = require('grunt');
var markdown = require('../tasks/lib/markdown').init(grunt);


var filepath = 'test/samples/javascript.md';
var contextBinderFile = 'test/data/bindertest.md';
var workingPath = 'test/data/';
var file = null;
var defaultFile =  grunt.file.read(filepath);
var templatepath = 'tasks/template.html';
var template = null;
var defaultTemplate = grunt.file.read(templatepath);
var html = null;
var $result = null;
var noop = function() {};
var options = null;
var cheerio = require('cheerio');

function getjQuery() {
  html = markdown.markdown(file, options, template);
  $result = cheerio(html);
}

describe('grunt-markdown', function () {

  beforeEach(function () {
    options = {
      preCompile: noop,
      postCompile: noop,
      templateContext: {},
      markdownOptions: {
          gfm: true,
          highlight: 'manual'
      }
    };
    template = defaultTemplate;
    file = defaultFile;
    getjQuery();
  });

  describe('no options', function () {

  });

  describe('basic processing', function () {

    beforeEach(function () {
      getjQuery();
    });

    it('should create an HTML body', function () {
      assert.ok($result.find('body').length === 1, 'produce a body element');
    });

    it('should create one JS code block', function () {
      assert.ok($result.find('code.lang-javascript').length === 1, 'expected one code block');
    });

    it('should create one JSON code block', function () {
      assert.ok($result.find('code.lang-json').length === 1, 'expected one code block');
    });

    it('should produce a header', function () {
      assert.ok($result.find('h1').length === 1, 'expected an h1');
    });

    it('should produce header with text', function () {
      assert.ok($result.find('h1').text() === 'This is a test of GFM for javascript', 'expected proper text');
    });

    it('should produce a list', function () {
      assert.ok($result.find('ul li').length === 2, 'expected a list with 2 items');
    });

    it('should produce a link', function () {
      var $a = $result.find('a');
      assert.ok($a.text() === 'markdown', 'expected link text');
      assert.ok($a.attr('href') === 'http://daringfireball.net/projects/markdown/syntax', 'expected link target link target');
    });

    it('should produce inline code', function () {
      var $a = $result.find('p code');
      assert.ok($a.text() === 'json', 'expected inline code');
    });

  });

  describe('wrapping code lines', function () {
    beforeEach(function () {
      options.codeLines = {
        before: '<span class="testWrap">',
        after: '</span><span class="testAfterWrap">expected</span>'
      };
      options.markdownOptions.highlight = 'auto';
      getjQuery();
    });

    it('should place before wrapper', function () {
      assert.equal($result.find('.testWrap').length, 7, 'expected to wrap all 7 code lines');
    });

    it('should place after wrapper', function () {
      assert.equal($result.find('.testAfterWrap').length, 7, 'expected to wrap all 7 code lines');
    });

  });

  describe('pre and post compile', function () {

    it('should expand preCompile context', function () {
      template = grunt.file.read('test/data/titletest.html');
      file = grunt.file.read('test/data/titletest.md');

      options.preCompile = function(src, context) {
        var matcher = src.match(/@-title:\s?([^@:\n]+)\n/i);
        context.title = matcher && matcher.length > 1 && matcher[1];
        matcher = src.match(/@-description:\s?([^@:\n]+)\n/i);
        context.description = matcher && matcher.length > 1 && matcher[1];
      };
      getjQuery();
      var $title = $result.find('title');
      var $desc = $result.find('meta[name="description"]');

      assert.ok($title.text() === 'The name is this', 'expected title from preCompile context');
      assert.ok($desc.attr('content') === 'Monkey', 'expected description set from preCompile context');
    });

    it('should save postCompile changes', function () {
      options.postCompile = function(src, context) {
        return '<div><h1>Oh Hai</h1></div>';
      };

      getjQuery();
      var $h1 = $result.find('h1');
      assert.ok($h1.text() === 'Oh Hai', 'expected post compile changes');
    });

    it('should expand template with context', function () {
      template = grunt.file.read('test/data/titletest.html');
      file = grunt.file.read('test/data/titletest.md');

      options.templateContext = {
        title: 'The name is this',
        description: 'Monkey'
      };
      getjQuery();
      var $title = $result.find('title');
      var $desc = $result.find('meta[name="description"]');

      assert.ok($title.text() === 'The name is this', 'the title should be set from preCompile context');
      assert.ok($desc.attr('content') === 'Monkey', 'the description should be set from preCompile context');
    });

    it('should expand template with context function', function () {
      template = grunt.file.read('test/data/titletest.html');
      file = grunt.file.read('test/data/titletest.md');

      options.templateContext = function() {

        return {
          title: 'The name is this',
          description: 'Monkey'
        };

      };

      getjQuery();
      var $title = $result.find('title');
      var $desc = $result.find('meta[name="description"]');

      assert.ok($title.text() === 'The name is this', 'the title should be set from preCompile context');
      assert.ok($desc.attr('content') === 'Monkey', 'the description should be set from preCompile context');
    });

  });

  describe('searching for default template', function() {

    it('should automatically find template for markdown files', function() {

      var templateFile = grunt.file.expand({}, workingPath + '*.jst');
      assert.ok(templateFile[0] === 'test/data/autotemplatetest.jst');
    });

    it('should automatically find template with good extension', function() {

      options.autoTemplateFormat = 'jst'; // Set option

      var templateFile = grunt.file.expand({}, workingPath + '*.' + options.autoTemplateFormat);
      assert.ok(templateFile[0] === 'test/data/autotemplatetest.jst');
    });

    it('should be able to find a good working directory', function() {

      var file = ["test/samples/javascript.md"];
        completePath = JSON.stringify(file).slice(2,-2).split('/'),
        lastPathElement = completePath.pop(),
        fileDirectory = completePath.splice(lastPathElement).join('/');

        assert.ok(fileDirectory === 'test/samples');
    });
  });

  describe('binding own parameters functionality', function() {

    newTemplateContext = {};
    it('should take good part of declared value', function() {
      
      options.contextBinderMark = '@@@'; // set option
      expectedContext = {
        key: 'value' 
      } // expected format

      var sourceFile = grunt.file.read(contextBinderFile),
        pattern = new RegExp('(' + options.contextBinderMark + ')(.*?)(' + options.contextBinderMark + ')', 'g'),
        contextArray;

      sourceFile.match(pattern).forEach(function(item) {
        var cleanString = item.slice(options.contextBinderMark.length, -options.contextBinderMark.length),
          separatedPairs = cleanString.split(':');

        newTemplateContext[separatedPairs[0]] = separatedPairs[1];
      });
      
      assert.ok(JSON.stringify(newTemplateContext) === JSON.stringify(expectedContext));
    });

    it('should be able to check if value was defined in markdown file', function() {

      options.contextBinderMark = '@@@';

      var file = grunt.file.read(contextBinderFile),
        testFile = new RegExp('(' + options.contextBinderMark + ')(.*?)(' + options.contextBinderMark + ')', 'g').test(file);
        assert.ok(testFile === true);
    });

    it('should append the found values to `templateContext` object', function() {

      options.templateContext = newTemplateContext;
      assert.ok(JSON.stringify(options.templateContext) === JSON.stringify(newTemplateContext));
    });


  });


});
