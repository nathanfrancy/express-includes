// 3rd party dependencies.
var url = require('url');
var fs = require('fs');
var path = require('path');

// Internal modules.
var minify = require('./modules/minify');

// TODO: section and page configs should be matches case insensitive, or able to be configured.

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

  // Initialize minified files.
  self.minified = (options && options.minified) ? options.minified : false;
  self.dirName = (options && options.dirName) ? (options.dirName) : null;
  
  // Objects that hold cached css and js files both full and minified.
  self.scriptFiles = {};
  self.styleFiles = {};

  // This looks really ugly. But the point here is to read all the css files that
  // are defined anywhere into memory, minify them in order to get them ready to 
  // go for actual requests.
  if (self.minified && self.dirName) {

    // Get a listing of folders underneath the directory given.
    self.dirs = getFoldersRecursive(self.dirName);

    // Loop through defined global styles.
    self.globalStyles.forEach(function(element, index, array) {
      var source = minify.readAndMinifyCSS(self.dirName + '/' + self.globalStyles[index], self.dirs);
      self.styleFiles[self.globalStyles[index]] = source;
    });

    // Loop through defined global scripts.
    self.globalScripts.forEach(function(element, index, array) {
      var source = minify.readAndMinifyJS(self.dirName + '/' + self.globalScripts[index]);
      self.scriptFiles[self.globalScripts[index]] = source;
    });

    // Loop through defined section definitions.
    self.sectionDefinition.forEach(function(sectionElement, sectionIndex, sectionArray) {

      // styles
      self.sectionDefinition[sectionIndex].styles.forEach(function(el, i, arr) {
        var source = minify.readAndMinifyCSS(self.dirName + '/' + self.sectionDefinition[sectionIndex].styles[i], self.dirs);
        self.styleFiles[self.sectionDefinition[sectionIndex].styles[i]] = source;
      });

      // scripts
      self.sectionDefinition[sectionIndex].scripts.forEach(function(el, i, arr) {
        var source = minify.readAndMinifyJS(self.dirName + '/' + self.sectionDefinition[sectionIndex].scripts[i]);
        self.scriptFiles[self.sectionDefinition[sectionIndex].scripts[i]] = source;
      });

    });

    // Loop through defined page definitions.
    self.pageDefinition.forEach(function(pageElement, pageIndex, pageArray) {

      // styles
      self.pageDefinition[pageIndex].styles.forEach(function(el, i, arr) {
        var source = minify.readAndMinifyCSS(self.dirName + '/' + self.pageDefinition[pageIndex].styles[i], self.dirs);
        self.styleFiles[self.pageDefinition[pageIndex].styles[i]] = source;
      });

      // scripts
      self.pageDefinition[pageIndex].scripts.forEach(function(el, i, arr) {
        var source = minify.readAndMinifyJS(self.dirName + '/' + self.pageDefinition[pageIndex].scripts[i]);
        self.scriptFiles[self.pageDefinition[pageIndex].scripts[i]] = source;
      });

    });

  }

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
   * 
   */
  self.mwFnMinified = function(req, res, next) {
    var imports = self.getImports(url.parse(req.url).pathname);
    res.locals.scripts = imports.scripts;
    res.locals.styles = imports.styles;

    res.locals.cssSource = '';
    res.locals.cssSourceMin = '';
    res.locals.jsSource = '';
    res.locals.jsSourceMin = '';

    res.locals.styles.forEach(function(el, index, arr) {
      res.locals.cssSource += self.styleFiles[res.locals.styles[index]].full;
      res.locals.cssSourceMin += self.styleFiles[res.locals.styles[index]].min;
    });

    res.locals.scripts.forEach(function(el, index, arr) {
      res.locals.jsSource += self.scriptFiles[res.locals.scripts[index]].full;
      res.locals.jsSourceMin += self.scriptFiles[res.locals.scripts[index]].min;
    });

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

// Source: https://gist.github.com/ashblue/3916348
function getFoldersRecursive (folder) {
    var fileContents = fs.readdirSync(folder),
        stats,
        folders = [];

    fileContents.forEach(function (fileName) {
        stats = fs.lstatSync(folder + '/' + fileName);

        if (stats.isDirectory()) {
          folders.push(folder + '/' + fileName);
          folders = folders.concat(getFoldersRecursive(folder + '/' + fileName));
        }
    });

    return folders;
};

// Export the middleware function.
module.exports = IncludeMiddleware;