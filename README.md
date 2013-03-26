# grunt-markdown

Compile markdown to html. This grunt task will take a given set of input markdown files and convert them to HTML. It supports [GFM](http://github.github.com/github-flavored-markdown/) with code highlighting. The code highlighting is done using [highlight.js](http://softwaremaniacs.org/soft/highlight/en/).

## Getting Started
Install this grunt plugin next to your project's [Gruntfile.js][getting_started] with: `npm install grunt-markdown`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-markdown');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation
Creating a markdown task is simple. In your grunt file add the following config.

```javascript
grunt.initConfig({
  markdown: {
    all: {
      files: [
        {
          expand: true,
          src: 'test/sample/*.md',
          dest: 'test/out/'
        }
      ],
      options: {
        htmlExtension: 'html',
        markdownExtension: 'md',
        markdownOptions: {
          gfm: true,
          highlight: manual
          codeLines: {
            before: '<span>',
            after: '</span>'
          }
        }
      }
    }
  }
});

````

The `markdown` task is a multitask and can have different targets. In the example above we have target specified called `all`.

* `files`: This plugin supports use of the [files API](http://gruntjs.com/configuring-tasks#files) introduced in Grunt 0.4.0. Files may be specified using any one of the [Compact Format](http://gruntjs.com/configuring-tasks#compact-format), [Files Objects Format](http://gruntjs.com/configuring-tasks#files-object-format), or [Files Array Format](http://gruntjs.com/configuring-tasks#files-array-format) (as in the above example).
* `template`: If you wish to provide your own html template specify here.
* `options`: `htmlExtension` and `markdownExtension` specify the input and output extensions of your markdown files, respectively. The only other option available is a `markdownOptions` hash, which is passed directly to the markdown parser.

Most markdown options are passed to the [marked](https://github.com/chjj/marked) markdown parser. The only option that is processed prior to compiling the markdown is the `highlight` option. If you specify `auto` or `manual` the task will handle highlighting code blocks for you use highlight.js. If you pass a custom function as the highlight option it will be used to highlight the code.

* `auto`: Will try to detect the language
* `manual`: will pass the language name from markdown to the highlight function
* `codeLines`: specify text that should wrap code lines

###Template File

You can provide any template file you would like and it will be used in place of the generic template provided. Where the HTML is injected into your template is specified using `<%=content%>` tag in your html template.

## License
Copyright (c) 2012 James Morrin
Licensed under the MIT license.
