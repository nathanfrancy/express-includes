var express = require('express');
var app = express();

var globalStylesheets = [
    "style.css"
];

var globalScripts = [
    "script.js"
];

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

var ImportMiddleware = require('./../index')({
    globalStylesheets: globalStylesheets,
    globalScripts: globalScripts,
    sections: sectionDefinition,
    pages: pageDefinition
});

app.use(ImportMiddleware.importMiddleware);

app.get('/', function (req, res) {
    res.json({
        scripts: res.locals.scripts,
        styles: res.locals.styles
    });
});

app.listen(3000);