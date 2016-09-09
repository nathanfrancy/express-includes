var url = require('url');

// TODO: section and page configs should be matches case insensitive, or able to be configured.
// TODO: write more tests around `getPageConfig`

/**
 * Create a new instance of IncludeMiddleware to use this plugin.
 */
function IncludeMiddleware(options) {
  var self = this;

  // Initialize with passed in configuration or empty arrays.
  self.globalStyles = (options && options.globalStyles) ? options.globalStyles : [];
  self.globalScripts = (options && options.globalScripts) ? options.globalScripts : [];
  self.sectionDefinition = (options && options.sectionDefinition) ? options.sectionDefinition : [];
  self.pageDefinition = (options && options.pageDefinition) ? options.pageDefinition : [];

  /**
   * Express middleware function that gets imports for the current 
   * page and attaches them to `res.locals` object, then calls next(). 
   */
  self.mwFn = function(req, res, next) {
    var imports = self.getImports(url.parse(req.url).pathname);
    res.locals.scripts = imports.scripts;
    res.locals.styles = imports.styles;
    next();
  };

  /**
   * Takes in a url and finds a section configuration from what was 
   * passed in earlier. At this time it can only return 1 section 
   * configuration, or null if none are found.
   * 
   * // TODO: ability to return multiple section configs? 
   */
  self.getSectionConfig = function(url) {
    if (!url) return null;

    for (var i = 0; i < self.sectionDefinition.length; i++) {
      if (url.indexOf(self.sectionDefinition[i].url) > -1) {
        return self.sectionDefinition[i];
      }
    }
    return null;
  };

  /**
   * Breaks down the url and each of the page definitions that were
   * passed in, and determines if there's a match. This function can 
   * currently only return one page config. 
   * 
   * TODO: ability to return multiple page configs?
   */
  self.getPageConfig = function(url) {
      if (!url) return null;
      var urlParts = url.split("/");

      for (var i = 0; i < self.pageDefinition.length; i++) {
          var itPageParts = self.pageDefinition[i].url.split("/");

          if (urlParts.length === itPageParts.length) {
              var match = true;

              for (var j = 0; j < itPageParts.length; j++) {
                  if (itPageParts[j] === ":") continue;
                  if (itPageParts[j] !== urlParts[j]) match = false;
              }

              if (match) {
                return self.pageDefinition[i];
              }
          }
      }
      return null;
  };

  /**
   * Top-level function that uses `getSectionConfig` and `getPageConfig`.
   * This function combines all of the imports that should go with the
   * page including each of the three layers (global, section and page). 
   */
  self.getImports = function(url) {
    var styles = self.globalStyles;
    var scripts = self.globalScripts;

    // Find section, append styles and scripts if section found.
    var sectionConfig = self.getSectionConfig(url);
    if (sectionConfig) {
      if (sectionConfig.styles && Array.isArray(sectionConfig.styles))
        styles = styles.concat(sectionConfig.styles);
      if (sectionConfig.scripts && Array.isArray(sectionConfig.scripts))
        scripts = scripts.concat(sectionConfig.scripts);
    }

    // Find page, append styles and scripts if page found.
    var pageConfig = self.getPageConfig(url);
    if (pageConfig) {
      if (pageConfig.styles && Array.isArray(pageConfig.styles))
        styles = styles.concat(pageConfig.styles);
      if (pageConfig.scripts && Array.isArray(pageConfig.scripts))
        scripts = scripts.concat(pageConfig.scripts);
    }

    // Return the entire list of styles, scripts and configs.
    return {
      styles: styles,
      scripts: scripts,
      pageConfig: pageConfig,
      sectionConfig: sectionConfig
    };
  };

  // Return myself.
  return self;
}

// Export the middleware function.
module.exports = IncludeMiddleware;
