/**
 * Creates a new ImportMiddleware class.
 * @param options
 *  {
 *    globalStylesheets: [ "style.css", ... ]
 *    globalScripts: [ "script.js", ... ]
 *  }
 * @returns {ImportMiddleware}
 * @constructor
 */
var ImportMiddleware = function(options) {
    var self = this;

    if (typeof options.globalStylesheets === 'undefined') {
        self.globalStylesheets = [];
    }
    else if (self.globalStylesheets.constructor === Array) {
        self.globalStylesheets = options.globalStylesheets;
    }
    else self.globalStylesheets = [];

    if (typeof options.globalScripts === 'undefined') {
        self.globalScripts = [];
    }
    else if (self.globalScripts.constructor === Array) {
        self.globalScripts = options.globalScripts;
    }
    else self.globalScripts = [];

    return self;
};
module.exports = ImportMiddleware;

ImportMiddleware.prototype.importSections = function() {

};