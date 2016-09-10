var CleanCSS = require('clean-css');
var uglify = require('uglify-js');
var fs = require('fs');

function readFile(file) {
    return fs.readFileSync(file).toString('utf-8');
}
module.exports.readFile = readFile;

function readAndMinifyCSS(file) {
    var source = readFile(file);
    var minified = new CleanCSS().minify(source).styles;

    return {
        full: source,
        min: minified
    };
}
module.exports.readAndMinifyCSS = readAndMinifyCSS;

function readAndMinifyJS(file) {
    var source = readFile(file);
    var uglified = uglify.minify([file]);

    return {
        full: source,
        min: uglified.code
    };
}
module.exports.readAndMinifyJS = readAndMinifyJS;