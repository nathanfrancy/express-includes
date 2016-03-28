var globalStylesheets = [
    "style.js"
];

var globalScripts = [
    "script.js"
];

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

var sectionDefinition = [
    {
        url: "/section",
        styles: [ "section.css" ],
        scripts: [ "section.js" ]
    }
];

var ImportMiddleware = require('./../index')({
    globalStylesheets: globalStylesheets,
    globalScripts: globalScripts,
    sections: sectionDefinition,
    pages: pageDefinition
});

console.log(ImportMiddleware.getImportsForPage("/section/page"));