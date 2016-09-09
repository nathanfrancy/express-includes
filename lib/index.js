var url = require('url');

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

  self.getImports = function(url) {
    var styles = self.globalStyles;
    var scripts = self.globalScripts;

    // Find section, append styles and scripts if section found.
    var sectionConfig = self.getSectionConfig(url);
    if (sectionConfig) {
      styles = styles.concat(sectionConfig.styles);
      scripts = scripts.concat(sectionConfig.scripts);
    }

    return {
      styles: styles,
      scripts: scripts
    };
  };

  return self;
}

module.exports = ImportMiddleware;
