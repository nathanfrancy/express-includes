var url = require('url');

// TODO: section and page configs should be matches case insensitive, or able to be configured.
// TODO: write more tests around `getPageConfig`
// TODO: "extras" object for sections and pages?

function ImportMiddleware(options) {
  var self = this;

  self.globalStyles = options.globalStyles || [];
  self.globalScripts = options.globalScripts || [];
  self.sectionDefinition = options.sectionDefinition || [];
  self.pageDefinition = options.pageDefinition || [];

  self.mwFn = function(req, res, next) {
    var imports = self.getImports(url.parse(req.url).pathname);
    res.locals.scripts = imports.scripts;
    res.locals.styles = imports.styles;
    next();
  };

  self.getSectionConfig = function(url) {
    if (!url) return null;

    for (var i = 0; i < self.sectionDefinition.length; i++) {
      if (url.indexOf(self.sectionDefinition[i].url) > -1) {
        return {
          url: self.sectionDefinition[i].url || '',
          styles: self.sectionDefinition[i].styles || [],
          scripts: self.sectionDefinition[i].scripts || []
        }
      }
    }
    return null;
  };

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
                  return {
                    url: self.pageDefinition[i].url || '',
                    styles: self.pageDefinition[i].styles || [],
                    scripts: self.pageDefinition[i].scripts || []
                  }
              }
          }
      }
      return null;
  };

  self.getImports = function(url) {
    var styles = self.globalStyles;
    var scripts = self.globalScripts;

    // Find section, append styles and scripts if section found.
    var sectionConfig = self.getSectionConfig(url);
    if (sectionConfig) {
      styles = styles.concat(sectionConfig.styles);
      scripts = scripts.concat(sectionConfig.scripts);
    }

    // Find page, append styles and scripts if page found.
    var pageConfig = self.getPageConfig(url);
    if (pageConfig) {
      styles = styles.concat(pageConfig.styles);
      scripts = scripts.concat(pageConfig.scripts);
    }

    return {
      styles: styles,
      scripts: scripts
    };
  };

  return self;
}

module.exports = ImportMiddleware;
