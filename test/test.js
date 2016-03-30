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
        scripts: [ "script.js" ],
        extras: {
            stuff: "yep"
        }
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

var extras = {
    menu: []
};

var ImportMiddleware = require('./../index')({
    globalStylesheets: globalStylesheets,
    globalScripts: globalScripts,
    sections: sectionDefinition,
    pages: pageDefinition,
    extras: extras
});

console.log(ImportMiddleware.getImportsForPage("/"));