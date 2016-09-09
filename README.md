# express-includes

[![Build Status](https://travis-ci.org/nathanfrancy/express-includes.svg?branch=master)](https://travis-ci.org/nathanfrancy/express-includes)
[![Coverage Status](https://coveralls.io/repos/github/nathanfrancy/express-includes/badge.svg?branch=master)](https://coveralls.io/github/nathanfrancy/express-includes?branch=master)

Express includes is a module for easily including stylesheets and javascript into your views. The idea is setting up configurations for these three levels:
- global: all pages
- section: matching a substring of the url
- page: matching a specific page url

## Installation

```
npm install express-includes --save
```

## Configuration

Here's a sample of how to get this working. You can define global styles like this:


```javascript
var globalStyles = [
    "style.css"
];

var globalScripts = [
    "script.js"
];
```

Here's a sample of section definitions, which attempt to match sections of a website with the current url. For instance, `/section` below would match with `/section`, `/section/page` and `/section/another/page`; but wouldn't match with `/other-section`.

```javascript
var sectionDefinition = [
    {
        url: "/section",
        styles: [ "section.css" ],
        scripts: [ "section.js" ]
    },
    {
        url: "/another/section",
        styles: [ "anothersection.css" ],
        scripts: [ "anothersection.js" ]
    }
];
```

And specific page definitions, which match exactly with the URL. You can also match with a page that has a wildcard (ex. an ID value) with a semicolon (`:`).

```javascript
var pageDefinition = [
    {
        url: "/",
        styles: [ "index.css" ],
        scripts: [ "index.js" ]
    },
    {
        url: "/section/page",
        styles: [ "page.css" ],
        scripts: [ "page.js" ]
    },
    {
        url: "/section/page/:",
        styles: [ "param.css" ],
        scripts: [ "param.js" ]
    }
];
```

After everything is defined, create a new `ExpressIncludes` instance by requiring the library where you're initializing express:

```javascript
var ExpressIncludes = require('express-includes');

var includes = new ExpressIncludes({
    globalStylesheets: globalStylesheets,
    globalScripts: globalScripts,
    sectionDefinition: sectionDefinition,
    pageDefinition: pageDefinition
});
```

Then use the middleware function provided in your express configuration, which will attach the `scripts` and the `styles` to the express `res.locals` object, giving you easy access to it in your view (or other middlewares).

```javascript
app.use(includes.mwFn);
```

### Using in your view
Example using jade.

```jade
each style in styles
    link(rel='stylesheet', href=style)
each script in scripts
    script(type='text/javascript', src=script)
```

## License

[MIT](https://github.com/nathanfrancy/express-includes/blob/master/LICENSE)
