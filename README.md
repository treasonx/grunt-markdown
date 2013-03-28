# grunt-markdown

This grunt task takes a set of markdown files and converts them to HTML. It supports [GFM](http://github.github.com/github-flavored-markdown/) with code highlighting. The code highlighting is done using [highlight.js](http://softwaremaniacs.org/soft/highlight/en/).

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile](http://gruntjs.com/getting-started) with:

```shell
npm install grunt-markdown
```

Then add this line to your gruntfile:

```javascript
grunt.loadNpmTasks('grunt-markdown');
```

## Documentation
Creating a markdown task is simple. For the basic functionality add the following config in your gruntfile:

```javascript
grunt.initConfig({
  markdown: {
    all: {
      files: ['docs/src/*.md'],
      dest: 'docs/html/'
    }  
  }  
});

```

Here is an example config using all of the options:

```javascript
grunt.initConfig({
  markdown: {
    all: {
      files: ['docs/src/*.md'],
      dest: 'docs/html/',
      template: 'myTemplate.jst',
      options: {
        gfm: true,
        highlight: 'manual',
        codeLines: {
          before: '<span>',
          after: '</span>'
        }
      }
    }  
  }  
});

```
These are the properties that the `markdown` task accepts:

* `files`: The list of markdown files
* `dest`: The output location for the compiled HTML files
* `template`: If you wish to provide your own template written in `.jst`, list its location here.  Where you want the compiled markdown inserted in your template, include the following line: `<%=content%>`
* `options`: options to be passed to the markdown parser

The parser options are passed to the [marked](https://github.com/chjj/marked) markdown parser. The only option that is processed prior to compiling the markdown is the `highlight` option. If you specify `auto`or `manual` the task will handle highlighting code blocks for you use highlight.js. If you pass a custom function as the highlight option it will be used to highlight the code.

* `auto`: Will try to detect the language
* `manual`: will pass the language name from markdown to the highlight function
* `codeLines`: specify text that should wrap code lines

## License
Copyright (c) 2012 James Morrin  
Licensed under the MIT license.
