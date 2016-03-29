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

    /**
     * Returns initialized array of styles or scripts.
     * @param arr
     * @returns {*}
     */
    self.import = function(arr) {
        if (typeof arr === 'undefined' || arr.constructor !== Array) {
            console.log("Imported globals are undefined or invalid.");
            return [];
        }
        else return arr;
    };

    /**
     * Get page configuration for the current url
     * @param url
     * @returns {*}
     */
    self.getPageConfig = function(url) {
        if (typeof url === 'undefined') return null;
        var urlParts = url.split("/");

        for (var i = 0; i < self.pages.length; i++) {
            var itPageParts = self.pages[i].url.split("/");

            if (urlParts.length === itPageParts.length) {
                for (var j = 0; j < itPageParts.length; j++) {
                    if (itPageParts[j] !== ":" || itPageParts[j] !== urlParts[j]) break;
                }
                return self.pages[i];
            }
        }
        return null;
    };

    /**
     * Get section configuration for the passed in url.
     * @param url
     * @returns {*}
     */
    self.getSectionConfig = function(url) {
        if (typeof url === 'undefined') return null;

        for (var i = 0; i < self.sections.length; i++) {
            if (url.indexOf(self.sections[i].url) > -1) return self.sections[i];
        }
        return null;
    };

    /**
     * Gets imports for the passed in url.
     * @param url
     * @returns {{styles: globalStylesheets, scripts: globalScripts, pageConfig: *, sectionConfig: *}}
     */
    self.getImportsForPage = function(url) {
        var styles = self.globalStylesheets;
        var scripts = self.globalScripts;
        var pageConfig = self.getPageConfig(url);
        var sectionConfig = self.getSectionConfig(url);

        if (sectionConfig !== null) {
            styles = styles.concat(sectionConfig.styles);
            scripts = scripts.concat(sectionConfig.scripts);
        }

        if (pageConfig !== null) {
            styles = styles.concat(pageConfig.styles);
            scripts = scripts.concat(pageConfig.scripts);
        }

        return {
            styles: styles,
            scripts: scripts,
            pageConfig: pageConfig,
            sectionConfig: sectionConfig
        };
    };

    /**
     * Middleware function to be used in express configuration.
     * @param req
     * @param res
     * @param next
     */
    self.importMiddleware = function(req, res, next) {
        var imports = self.getImportsForPage(req.originalUrl);
        res.locals.originalUrl = req.originalUrl;
        res.locals.styles = imports.styles;
        res.locals.scripts = imports.scripts;
        next();
    };

    // Import global stylesheets and scripts into the plugin.
    self.globalStylesheets = self.import(options.globalStylesheets);
    self.globalScripts = self.import(options.globalScripts);

    // Import section definition
    self.sections = self.import(options.sections);

    // Import page definition
    self.pages = self.import(options.pages);

    return self;
};

module.exports = ImportMiddleware;