# express-includes

Express middleware for easily including stylesheets and javascript into your views. 

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

The idea is setting up configurations for global, section and page level stylesheets and javascript. Start by installing (`--save` to keep the dependency in your `package.json`):

## Installation

```
npm install express-includes --save
```

## Configuration

Here's a sample of how to get this working. You can define global styles like this: 


```javascript
var globalStylesheets = [
    "style.js"
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

And specific page definitions, which match exactly with the URL. You can also match with a page that has a parameter with a semicolon (`:`).

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

After everything is defined, create a new ImportMiddleware instance by requiring the library where you're initializing express:

```javascript
var ImportMiddleware = require('express-includes')({
    globalStylesheets: globalStylesheets,
    globalScripts: globalScripts,
    sections: sectionDefinition,
    pages: pageDefinition
});
```

Then use the middleware function provided in your express configuration.

```javascript
app.use(ImportMiddleware.importMiddleware);
```

### Using in your view

This is basically running each page request through this middleware function, and attempting to find imports that are relevant to the current page url. If configured correctly, you should be able to do something like this (example in jade) in your view:

```jade
each style in styles
    link(rel='stylesheet', href=style)
each script in scripts
    script(type='text/javascript', src=script)
```

## License

[MIT](https://github.com/nathanfrancy/express-includes/blob/master/LICENSE)