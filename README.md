# express-includes

Express middleware for easily including stylesheets and javascript.

```
npm install express-includes --save
```

Here's a sample of how to get this working. You can define global styles like this: 


```javascript
var globalStylesheets = [
    "style.js"
];

var globalScripts = [
    "script.js"
];
```

Section definitions, which attempt to match the current url partially: 

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

And specific page definitions, which match exactly with the URL. You can also match with a page that has a parameter with `:`.

```javascript
var pageDefinition = [
    {
        url: "/",
        styles: [ "page.css" ],
        scripts: [ "script.js" ]
    },
    {
        url: "/section/page",
        styles: [ "param.css" ],
        scripts: [ "param.js" ]
    }
];
```

After everything is configured, create a new ImportMiddleware instance by requiring the library.

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