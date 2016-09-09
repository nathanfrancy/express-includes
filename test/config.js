module.exports.globalStylesheets = [
    "style.css"
];

module.exports.globalScripts = [
    "script.js"
];

module.exports.pageDefinition = [
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

module.exports.sectionDefinition = [
    {
        url: "/section",
        styles: [ "section.css" ],
        scripts: [ "section.js" ]
    }
];

module.exports.extras = {};
